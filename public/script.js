// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const copyNotification = document.getElementById('copy-notification');

    // Helper function to create and append a message
    function appendMessage(sender, message, isScript = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('ai-message');
        }

        if (isScript) {
            const scriptBox = document.createElement('div');
            scriptBox.classList.add('script-message');
            
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button');
            copyButton.textContent = 'کاپی کریں';
            
            const preTag = document.createElement('pre');
            preTag.textContent = message;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(message).then(() => {
                    showCopyNotification();
                }).catch(err => {
                    console.error('Failed to copy script:', err);
                });
            });
            
            scriptBox.appendChild(copyButton);
            scriptBox.appendChild(preTag);
            messageDiv.appendChild(scriptBox);
        } else {
            messageDiv.textContent = message;
        }

        chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
    }
    
    // Function to show a copy notification
    function showCopyNotification() {
        copyNotification.classList.add('show');
        setTimeout(() => {
            copyNotification.classList.remove('show');
        }, 2000); // Hide after 2 seconds
    }

    // Function to handle the loading state
    let loadingMessageElement = null;
    function showLoading() {
        loadingMessageElement = document.createElement('div');
        loadingMessageElement.classList.add('loading-message');
        loadingMessageElement.textContent = 'اسکرپٹ بنایا جا رہا ہے...';
        chatMessages.insertBefore(loadingMessageElement, chatMessages.firstChild);
    }

    function hideLoading() {
        if (loadingMessageElement) {
            loadingMessageElement.remove();
            loadingMessageElement = null;
        }
    }

    // Function to parse Markdown code blocks
    function parseMarkdownCode(markdown) {
        const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
        const match = codeBlockRegex.exec(markdown);
        if (match && match[1]) {
            return match[1].trim();
        }
        return markdown;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';
        
        // Show loading message if a script is requested
        const isScriptRequest = message.toLowerCase().includes('اسکرپٹ') || message.toLowerCase().includes('script');
        if (isScriptRequest) {
            showLoading();
        }

        try {
            const response = await fetch(`/api/chat?message=${encodeURIComponent(message)}`);
            const data = await response.json();

            hideLoading();

            if (data.success) {
                if (data.type === 'script') {
                    const scriptText = parseMarkdownCode(data.msg);
                    appendMessage('ai', scriptText, true); // Append script as a special message
                } else {
                    appendMessage('ai', data.msg); // Normal chat message
                }
            } else {
                appendMessage('ai', 'Error: ' + data.msg);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            hideLoading();
            appendMessage('ai', 'Server error. Please try again later.');
        }
    }

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
