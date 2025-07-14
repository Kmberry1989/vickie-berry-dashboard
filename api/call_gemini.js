const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check for the API key and throw a clear error if it's missing.
if (!process.env.GEMINI_API_KEY) {
  throw new Error('The GEMINI_API_KEY environment variable is not set. Please set it in your hosting environment.');
}

// Assumes the API key is set as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.status(200).json({ text });

  } catch (error) {
    console.error('Error calling Generative AI API:', error);
    // Send a more specific error message back to the client.
    res.status(500).json({
        error: 'Failed to call Generative AI API',
        details: error.message
    });
  }
};
