// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

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

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        appendMessage('user', message);
        userInput.value = '';

        try {
            const response = await fetch(`/api/chat?message=${encodeURIComponent(message)}`);
            const data = await response.json();

            if (data.success) {
                appendMessage('ai', data.msg);
            } else {
                appendMessage('ai', 'Error: ' + data.msg);
            }
        } catch (error) {
            console.error('Fetch error:', error);
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
