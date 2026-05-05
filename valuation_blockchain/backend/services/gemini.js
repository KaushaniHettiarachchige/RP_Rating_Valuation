const { GoogleGenAI } = require('@google/genai');

// Gemini AI Client factory - creates a client for a specific key
function createGenAIClient(apiKey) {
    return new GoogleGenAI({ apiKey });
}

module.exports = {
    createGenAIClient,
};
