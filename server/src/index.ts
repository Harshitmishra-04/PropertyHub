import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
/** Comma-separated list, e.g. "https://app.vercel.app,http://localhost:8080" */
const CLIENT_ORIGINS = (() => {
  const list = CLIENT_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : ["http://localhost:5173"];
})();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser clients (curl, server-to-server) send no Origin
      if (!origin) return callback(null, true);
      if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

// Simple JWT auth middleware (Authorization: Bearer <token>)
const authMiddleware = (requireAdmin = false) => {
  return async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice("Bearer ".length);
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        return res.status(401).json({ error: "Invalid token" });
      }
      if (requireAdmin && user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
      }
      (req as any).user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

const createJwtForUser = (user: { id: string; email: string; name: string; role: string }) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const getOptionalUserFromRequest = async (req: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length);
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user ?? null;
  } catch {
    return null;
  }
};

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ---------- Auth ----------

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {};
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hash,
        role: "user",
      },
    });

    const token = createJwtForUser(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /auth/signup error:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = createJwtForUser(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /auth/login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/auth/me", authMiddleware(false), (req: any, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

// ---------- Admin ----------

app.get("/admin/users", authMiddleware(true), async (_req: any, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("GET /admin/users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ---------- AI (OpenRouter proxy) ----------

app.post("/ai/chat", async (req: any, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(503).json({ error: "AI service is not configured" });
    }

    const { messages, model } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    const refererForOpenRouter = CLIENT_ORIGINS[0] || "http://localhost:5173";
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": refererForOpenRouter,
        "X-Title": "PropertyHub",
      },
      body: JSON.stringify({
        model:
          typeof model === "string" && model.trim() ? model : "openai/gpt-4o-mini",
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("OpenRouter error:", response.status, text);
      return res.status(502).json({ error: "AI provider error" });
    }

    const data: any = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    res.json({ content });
  } catch (error) {
    console.error("POST /ai/chat error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

// ---------- Properties ----------

// List properties (approved by default)
app.get("/properties", async (req, res) => {
  try {
    const { type } = req.query;
    const currentUser = await getOptionalUserFromRequest(req);
    const where: any = {};

    // Guests: approved only
    // Authenticated users: approved + own
    // Admin: all
    if (!currentUser) {
      where.approvalStatus = "approved";
    } else if (currentUser.role !== "admin") {
      where.OR = [
        { approvalStatus: "approved" },
        { sellerId: currentUser.id },
      ];
    }

    if (type && typeof type === "string") {
      where.type = type;
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(properties);
  } catch (error) {
    console.error("GET /properties error:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// Create property (authenticated)
app.post("/properties", authMiddleware(false), async (req: any, res) => {
  try {
    const body = req.body;
    const user = req.user;

    const property = await prisma.property.create({
      data: {
        title: body.title,
        price: body.price,
        location: body.location,
        city: body.city,
        locality: body.locality,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        area: body.area,
        image: body.image,
        type: body.type,
        propertyType: body.propertyType,
        description: body.description ?? "",
        amenities: body.amenities ?? [],
        images: body.images ?? [],
        coordinates: body.coordinates ?? { lat: 0, lng: 0 },
        approvalStatus: body.approvalStatus ?? "pending",
        constructionStatus: body.constructionStatus ?? "ready",
        floorPlan: body.floorPlan ?? null,
        virtualTour: body.virtualTour ?? null,
        sellerInfo: body.sellerInfo ?? {},
        featured: body.featured ?? false,
        listingPackage: body.listingPackage ?? "free",
        views: body.views ?? 0,
        enquiries: body.enquiries ?? 0,
        neighborhood: body.neighborhood ?? null,
        facing: body.facing ?? null,
        furnished: body.furnished ?? null,
        parking: body.parking ?? null,
        floor: body.floor ?? null,
        totalFloors: body.totalFloors ?? null,
        age: body.age ?? null,
        bhk: body.bhk ?? null,
        sellerId: user.id,
      },
    });

    res.status(201).json(property);
  } catch (error) {
    console.error("POST /properties error:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
});

// Get single property
app.get("/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    console.error("GET /properties/:id error:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// Update property
app.patch("/properties/:id", authMiddleware(false), async (req: any, res) => {
  try {
    const { id } = req.params;
    const data = req.body ?? {};
    const user = req.user;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }
    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.property.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    console.error("PATCH /properties/:id error:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
});

// Delete property
app.delete("/properties/:id", authMiddleware(false), async (req: any, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Property not found" });
    }
    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Delete dependent records first to avoid FK constraint failures.
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { propertyId: id } }),
      prisma.lead.deleteMany({ where: { propertyId: id } }),
      prisma.favorite.deleteMany({ where: { propertyId: id } }),
      prisma.comparison.deleteMany({ where: { propertyId: id } }),
      prisma.property.delete({ where: { id } }),
    ]);
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /properties/:id error:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// ---------- Leads ----------

// Create lead (public)
app.post("/leads", async (req, res) => {
  try {
    const body = req.body;

    const lead = await prisma.lead.create({
      data: {
        propertyId: body.propertyId,
        sellerId: body.sellerId ?? null,
        sellerName: body.sellerName,
        buyerName: body.buyerName,
        buyerEmail: body.buyerEmail,
        buyerPhone: body.buyerPhone,
        message: body.message ?? null,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("POST /leads error:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

// List leads for current user (seller/admin)
app.get("/leads", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;

    let where: any = {};
    if (user.role === "seller") {
      where.sellerId = user.id;
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(leads);
  } catch (error) {
    console.error("GET /leads error:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

app.patch("/leads/:id", authMiddleware(false), async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body ?? {};
    const user = req.user;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Lead not found" });
    }

    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status: status ?? existing.status,
        notes: notes ?? existing.notes,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("PATCH /leads/:id error:", error);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

app.delete("/leads/:id", authMiddleware(false), async (req: any, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Lead not found" });
    }

    if (user.role !== "admin" && existing.sellerId !== user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.lead.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /leads/:id error:", error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

// ---------- Reviews ----------

app.get("/properties/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { propertyId: id },
      orderBy: { date: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    console.error("GET /properties/:id/reviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.post("/properties/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const review = await prisma.review.create({
      data: {
        propertyId: id,
        rating: body.rating,
        comment: body.comment ?? "",
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("POST /properties/:id/reviews error:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

app.post("/reviews/:id/helpful", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Review not found" });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { helpful: existing.helpful + 1 },
    });

    res.json(updated);
  } catch (error) {
    console.error("POST /reviews/:id/helpful error:", error);
    res.status(500).json({ error: "Failed to mark review helpful" });
  }
});

// ---------- Favorites & Comparisons ----------

app.get("/favorites", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;
    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
    });
    res.json(favorites);
  } catch (error) {
    console.error("GET /favorites error:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

app.post("/favorites", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;
    const { propertyId } = req.body ?? {};
    const favorite = await prisma.favorite.upsert({
      where: { userId_propertyId: { userId: user.id, propertyId } },
      update: {},
      create: { userId: user.id, propertyId },
    });
    res.status(201).json(favorite);
  } catch (error) {
    console.error("POST /favorites error:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

app.delete("/favorites/:propertyId", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;
    const { propertyId } = req.params;
    await prisma.favorite.delete({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /favorites/:propertyId error:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

app.get("/comparisons", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;
    const comparisons = await prisma.comparison.findMany({
      where: { userId: user.id },
    });
    res.json(comparisons);
  } catch (error) {
    console.error("GET /comparisons error:", error);
    res.status(500).json({ error: "Failed to fetch comparison list" });
  }
});

app.post("/comparisons", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;
    const { propertyId } = req.body ?? {};
    const comparison = await prisma.comparison.upsert({
      where: { userId_propertyId: { userId: user.id, propertyId } },
      update: {},
      create: { userId: user.id, propertyId },
    });
    res.status(201).json(comparison);
  } catch (error) {
    console.error("POST /comparisons error:", error);
    res.status(500).json({ error: "Failed to add to comparison list" });
  }
});

app.delete("/comparisons/:propertyId", authMiddleware(false), async (req: any, res) => {
  try {
    const user = req.user;
    const { propertyId } = req.params;
    await prisma.comparison.delete({
      where: { userId_propertyId: { userId: user.id, propertyId } },
    });
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /comparisons/:propertyId error:", error);
    res.status(500).json({ error: "Failed to remove from comparison list" });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

