// groqService.js (Renamed from geminiService.js to reflect the change)
const fetch = require("node-fetch");
const Groq = require('groq-sdk'); // Import the Groq SDK

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Initialize the Groq client with your API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure you set GROQ_API_KEY in your .env file
});

exports.extractLocationFromText = async (text) => {
  try {
    // Choose a Groq model. 'llama3-8b-8192' or 'llama3-70b-8192' are good choices.
    // 'mixtral-8x7b-32768' is also excellent for various tasks.
    const model = 'llama3-8b-8192'; // Or 'llama3-70b-8192' for larger capabilities

    // Groq's chat completions API uses a 'messages' array, similar to OpenAI.
    // You can provide a 'system' message to instruct the model on its role.
    const messages = [
      {
        role: 'system',
        content: 'You are a highly accurate location extraction assistant. Your task is to identify and extract the most specific location mentioned in a given disaster report. Respond with only the location, or "N/A" if no clear location is present.',
      },
      {
        role: 'user',
        content: `Extract the location from this disaster report: ${text}`,
      },
    ];

    // Make the API call to Groq for chat completions
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: model,
      stream: true, 
    });

    let result = '';
    // Iterate over the streamed chunks
    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].delta.content) {
        result += chunk.choices[0].delta.content;
      }
    }
    console.log("location in text", result);
    return result.trim();
  } catch (err) {
    console.error('Groq API error:', err);
    throw err;
  }
}



// Convert remote image URL to base64
async function getImageAsBase64(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("Failed to fetch image from URL");
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}




exports.verifyDisasterImageService = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: "Analyze this image for signs of disaster or manipulation. Return a brief caption or warning if it's fake.",
        },
      ],
    });

    const text = result.text || "No response text found";


    return { success: true, analysis: text };
  } catch (error) {
    console.error("Error verifying image:", error);
    return { success: false, error: error.message };
  }
};
