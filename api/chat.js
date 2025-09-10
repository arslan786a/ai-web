// api/chat.js
const fetch = require('node-fetch');

// Helper function to check if a message is a script request
function isScriptRequest(message) {
  const keywords = ['سکرپٹ', 'اسکرپٹ', 'اسکرپٹ بناؤ', 'script', 'make a script', 'create a script'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, msg: 'Method Not Allowed' });
  }

  const { message } = req.query;

  if (!message) {
    return res.status(400).json({ success: false, msg: 'Please provide a message query parameter.' });
  }

  try {
    if (isScriptRequest(message)) {
      // Logic for script generation (same as the previous answer)
      const apis = [
        { name: 'chatgpt', url: `https://ai-api-phi-seven.vercel.app/api/chatgpt?message=${encodeURIComponent(message)}` },
        { name: 'deepseek', url: `https://ai-api-phi-seven.vercel.app/api/deepseek?message=${encodeURIComponent(message)}` },
        { name: 'gemini', url: `https://ai-api-phi-seven.vercel.app/api/gemini?message=${encodeURIComponent(message)}` },
        { name: 'grok', url: `https://ai-api-phi-seven.vercel.app/api/grok?message=${encodeURIComponent(message)}` },
        { name: 'qwen', url: `https://ai-api-phi-seven.vercel.app/api/qwen?message=${encodeURIComponent(message)}` },
        { name: 'claude', url: `https://ai-api-phi-seven.vercel.app/api/claude?message=${encodeURIComponent(message)}` },
        { name: 'meta', url: `https://ai-api-phi-seven.vercel.app/api/meta?message=${encodeURIComponent(message)}` }
      ];

      const apiPromises = apis.map(api =>
        fetch(api.url).then(response => response.json()).catch(error => {
          console.error(`Error fetching from ${api.name}:`, error);
          return { success: false, msg: `Error from ${api.name}` };
        })
      );

      const results = await Promise.all(apiPromises);

      const combinedMessage = results.reduce((acc, current) => {
        if (current.success) {
          acc += `${current.msg}\n\n`;
        }
        return acc;
      }, 'These are different AI responses to the request. Combine and refine them into a single, comprehensive script:\n\n');

      const chatGptApiUrl = `https://ai-api-phi-seven.vercel.app/api/chatgpt?message=${encodeURIComponent(combinedMessage)}`;
      const finalResponse = await fetch(chatGptApiUrl);
      const finalData = await finalResponse.json();

      res.status(200).json({ success: true, msg: finalData.msg });

    } else {
      // Logic for normal conversation (direct ChatGPT call)
      const chatGptApiUrl = `https://ai-api-phi-seven.vercel.app/api/chatgpt?message=${encodeURIComponent(message)}`;
      const response = await fetch(chatGptApiUrl);
      const data = await response.json();
      res.status(200).json({ success: true, msg: data.msg });
    }

  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ success: false, msg: 'An internal server error occurred.' });
  }
};
