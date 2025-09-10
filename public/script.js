// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const scriptSection = document.getElementById('script-section');
    const scriptContent = document.getElementById('script-content');
    const copyScriptButton = document.getElementById('copy-script-button');

    function appendMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('ai-message');
        }
        messageDiv.textContent = message;
        chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
    }

    // Function to parse Markdown code blocks and convert to HTML
    function parseMarkdownCode(markdown) {
        const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
        const match = codeBlockRegex.exec(markdown);
        if (match && match[1]) {
            return match[1].trim(); // Extract content inside the code block
        }
        return markdown; // Return original if no code block found
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';

        // Hide script section if visible
        scriptSection.style.display = 'none';
        scriptContent.textContent = ''; // Clear previous script

        try {
            const response = await fetch(`/api/chat?message=${encodeURIComponent(message)}`);
            const data = await response.json();

            if (data.success) {
                if (data.type === 'script') {
                    const scriptText = parseMarkdownCode(data.msg);
                    scriptContent.textContent = scriptText;
                    scriptSection.style.display = 'block'; // Show script section
                    appendMessage('ai', 'یہ رہا آپ کا اسکرپٹ:'); // Optional: A message in chat saying script is ready
                } else {
                    appendMessage('ai', data.msg); // Normal chat message
                }
            } else {
                appendMessage('ai', 'Error: ' + data.msg);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            appendMessage('ai', 'Server error. Please try again later.');
        }
    }

    // Copy to clipboard functionality
    copyScriptButton.addEventListener('click', () => {
        const textToCopy = scriptContent.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('اسکرپٹ کاپی کر لیا گیا!'); // Or a more subtle notification
        }).catch(err => {
            console.error('Failed to copy script:', err);
            alert('اسکرپٹ کاپی کرنے میں ناکامی۔');
        });
    });

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
