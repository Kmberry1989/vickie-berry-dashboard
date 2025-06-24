// Using 'require' for Node.js compatibility in Vercel's serverless environment.
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This is the default export that Vercel will run as a serverless function.
// It receives a request (req) and a response (res) object.
module.exports = async (req, res) => {
  // --- Security Check: Only allow POST requests ---
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // --- Get the API Key from Environment Variables ---
    // This is the crucial security step. The key is stored on Vercel's servers.
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("Gemini API key is not set in environment variables.");
    }

    // --- Initialize the Google Gemini AI Client ---
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- Get the user's prompt from the request body ---
    // Vercel automatically parses the JSON body into `req.body`.
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ error: 'No prompt provided' });
      return;
    }

    // --- Make the API Call to Gemini ---
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // --- Send the Successful Response Back to the Frontend ---
    // Use the `res` object to send a 200 OK status and the JSON payload.
    res.status(200).json({ text: text });

  } catch (error) {
    // --- Handle Any Errors ---
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};