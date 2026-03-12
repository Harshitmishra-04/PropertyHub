import { PrismaClient } from "@prisma/client";
import properties from "../../src/data/mockProperties";
import { mockReviews } from "../../src/data/mockReviews";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed properties
  for (const p of (properties as any[])) {
    await prisma.property.create({
      data: {
        title: p.title,
        price: p.price,
        location: p.location,
        city: p.city,
        locality: p.locality,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        image: p.image,
        type: p.type,
        propertyType: p.propertyType,
        description: p.description ?? "",
        amenities: p.amenities ?? [],
        images: p.images ?? [],
        coordinates: p.coordinates ?? { lat: 0, lng: 0 },
        approvalStatus: p.approvalStatus ?? "approved",
        constructionStatus: p.constructionStatus ?? "ready",
        floorPlan: p.floorPlan ?? null,
        virtualTour: p.virtualTour ?? null,
        sellerInfo: p.sellerInfo ?? {},
        featured: p.featured ?? false,
        listingPackage: p.listingPackage ?? "free",
        views: p.views ?? 0,
        enquiries: p.enquiries ?? 0,
        neighborhood: p.neighborhood ?? null,
        facing: p.facing ?? null,
        furnished: p.furnished ?? null,
        parking: p.parking ?? null,
        floor: p.floor ?? null,
        totalFloors: p.totalFloors ?? null,
        age: p.age ?? null,
        bhk: p.bhk ?? null,
      },
    });
  }

  // Seed reviews
  for (const r of mockReviews as any[]) {
    await prisma.review.create({
      data: {
        propertyId: r.propertyId,
        rating: r.rating,
        comment: r.comment ?? "",
        helpful: r.helpful ?? 0,
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

