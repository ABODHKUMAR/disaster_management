// groqService.js (Renamed from geminiService.js to reflect the change)
const Groq = require('groq-sdk'); // Import the Groq SDK

// Initialize the Groq client with your API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure you set GROQ_API_KEY in your .env file
});

async function extractLocationFromText(text) {
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
      stream: true, // Enable streaming for real-time chunks
      // Groq doesn't have a direct equivalent to `thinkingConfig` or `responseMimeType`
      // like Gemini does in this way. You control output format via prompting.
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

// The verifyImage function cannot be directly translated to Groq as Groq
// primarily focuses on text-based LLMs and does not currently offer
// direct image analysis capabilities like Gemini's multimodal models.
// If you need image analysis, you would still need to use a separate service
// (like Google's Gemini Vision models, or other dedicated image analysis APIs).
async function verifyImage(imageUrl) {
  // This function would remain separate or be implemented using a different service
  // if image analysis is still required.
  console.warn("Groq API does not directly support image analysis. This function requires a different service.");
  throw new Error("Image verification is not supported by Groq API.");
}

module.exports = { extractLocationFromText, verifyImage };