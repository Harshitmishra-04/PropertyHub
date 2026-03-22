import { apiPost } from "@/lib/api";

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PropertyRecommendation {
  propertyId: string;
  reason: string;
  score: number;
}

export const aiService = {
  /**
   * Chat with AI assistant
   */
  async chat(messages: Message[]): Promise<string> {
    try {
      const data = await apiPost<{ content: string }>("/ai/chat", {
        model: "openai/gpt-4o-mini",
        messages,
      });
      return data.content || "No response from AI";
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  /**
   * Get property recommendations based on user preferences
   */
  async getPropertyRecommendations(
    userPreferences: {
      budget?: number;
      location?: string;
      bedrooms?: number;
      propertyType?: string;
    },
    availableProperties: any[]
  ): Promise<PropertyRecommendation[]> {
    try {
      const limited = Array.isArray(availableProperties) ? availableProperties.slice(0, 20) : [];
      const prompt = `Given these user preferences: ${JSON.stringify(userPreferences)}
      And these available properties: ${JSON.stringify(limited.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: p.location,
        bedrooms: p.bedrooms,
        propertyType: p.propertyType,
      })))}
      
      Recommend the top 3 properties with reasons. Return JSON array with format:
      [{"propertyId": "id", "reason": "explanation", "score": 0-100}]`;

      const response = await this.chat([
        {
          role: 'system',
          content: 'You are a real estate AI assistant that helps users find their perfect property. Always return valid JSON only, no markdown code blocks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]);

      // Remove markdown code blocks if present
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
      }
      
      const recommendations = JSON.parse(cleanedResponse);
      return recommendations;
    } catch (error) {
      console.error('Recommendation Error:', error);
      return availableProperties.slice(0, 3).map((prop, index) => ({
        propertyId: prop.id,
        reason: 'Top match based on your criteria',
        score: 100 - index * 10,
      }));
    }
  },

  /**
   * Get property search assistance
   */
  async getSearchAssistance(userQuery: string, properties: any[]): Promise<string> {
    // Keep payload small (input tokens + reserved max_tokens cost credits).
    const limited = Array.isArray(properties) ? properties.slice(0, 15) : [];
    const summary = limited.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      location: p.location,
      bedrooms: p.bedrooms,
      type: p.type,
      propertyType: p.propertyType,
    }));
    const messages: Message[] = [
      {
        role: 'system',
        content: `You are a helpful real estate assistant. Help users find properties based on their requirements.
Available properties (JSON): ${JSON.stringify(summary)}`,
      },
      {
        role: 'user',
        content: userQuery,
      },
    ];

    return await this.chat(messages);
  },
};
