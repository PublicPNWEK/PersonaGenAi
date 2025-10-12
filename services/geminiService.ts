

// Fix: Implement Gemini API call to generate social media profiles.
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { UserInput, ProfileSuggestions } from '../types';

export const generateProfiles = async (data: UserInput): Promise<ProfileSuggestions> => {
    // FIX: Initialize the GoogleGenAI client. API key is provided via environment variables.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const platformNames = data.platforms.join(', ');

    const prompt = `
    Based on the following user persona, generate social media profiles (a username and a bio) for each of the specified platforms.

    **Persona Details:**
    - **Name/Brand:** ${data.name}
    - **Description:** ${data.bioDescription}
    - **Desired Vibe/Tone:** ${data.vibe}
    - **Target Audience:** ${data.audience}
    ${data.affiliateLink ? `- **Promotional Link to include in bio (if appropriate):** ${data.affiliateLink}` : ''}

    **Target Platforms:** ${platformNames}

    **Instructions:**
    1.  For each platform, create a unique, catchy, and available-sounding username.
    2.  For each platform, write a compelling bio. The bio must be tailored to the platform's typical character limits and style (e.g., professional for LinkedIn, short and punchy for Twitter/X).
    3.  If a promotional link is provided, incorporate it naturally into the bio where the platform allows (e.g., at the end of an Instagram or LinkedIn bio).
    4.  Ensure the vibe and tone of the usernames and bios perfectly match the user's request.
    5.  Your response MUST be a valid JSON array of objects. Each object must represent a profile for one platform and contain three string fields: "platform", "username", and "bio".
    `;

    const responseSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            platform: {
              type: Type.STRING,
              description: 'The social media platform name.',
            },
            username: {
              type: Type.STRING,
              description: 'The generated username for the platform.',
            },
            bio: {
              type: Type.STRING,
              description: 'The generated bio for the platform.',
            },
          },
          required: ['platform', 'username', 'bio'],
        },
      };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.7,
            },
        });

        // FIX: Directly access the .text property for the response string.
        const jsonText = response.text.trim();
        if (!jsonText) {
          throw new Error("The AI returned an empty response. Please try adjusting your input or regenerating.");
        }
        
        const suggestions = JSON.parse(jsonText);

        if (!Array.isArray(suggestions) || suggestions.length === 0 || suggestions.some(s => !s.platform || !s.username || !s.bio)) {
            throw new Error('The AI returned an incomplete or invalid response. Please try regenerating.');
        }

        return suggestions as ProfileSuggestions;
    } catch (error) {
        console.error("Error generating profiles with Gemini:", error);
        if (error instanceof Error) {
            // Check for specific error messages from the Gemini API
            if (error.message.includes('API key not valid')) {
                throw new Error('Invalid API Key: The provided Google Gemini API key is invalid or missing. Please ensure it is set correctly as an environment variable.');
            }
            if (error.message.toLowerCase().includes('rate limit')) {
                throw new Error('Rate Limit Exceeded: You have exceeded your API rate limit. Please wait and try again later, or check your quota on the Google AI Studio dashboard.');
            }
             if (error.message.toLowerCase().includes('safety')) {
                throw new Error('Content Safety Block: The request was blocked due to safety settings. Please modify your input to be less sensitive.');
            }
            // Check for JSON parsing or format errors
            if (error instanceof SyntaxError || error.message.includes('invalid response')) {
                 throw new Error(`AI Response Error: ${error.message}`);
            }
        }
        // Generic fallback error
        throw new Error('An unexpected error occurred while communicating with the AI. Please check the console for details and try again.');
    }
};