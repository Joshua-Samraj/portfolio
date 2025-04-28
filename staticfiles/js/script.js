document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const clearHistoryBtn = document.getElementById('clear-history-btn'); // Add this button to your HTML

    // Load chat history when page loads
    loadChatHistory();

    // Add initial greeting if no history exists
    if (chatBox.children.length === 0) {
        setTimeout(() => {
            addBotMessage("Hello! I'm your Django chatbot. How can I help you today?", true);
        }, 800);
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearChatHistory);
    }

    // Main Functions
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addUserMessage(message);
            userInput.value = '';
            userInput.style.height = 'auto';
            
            showTypingIndicator();
            
            try {
                const response = await fetch('/api/chat/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({message: message})
                });
                
                const data = await response.json();
                hideTypingIndicator();
                
                if (data.response) {
                    simulateTyping(data.response);
                } else if (data.error) {
                    addBotMessage("Sorry, there was an error: " + data.error, true);
                }
            } catch (error) {
                hideTypingIndicator();
                addBotMessage("Sorry, I couldn't process your request.", true);
                console.error('Error:', error);
            }
        }
    }

    // Message Handling Functions
    function addUserMessage(message) {
        const messageElement = createMessageElement('user', message);
        chatBox.appendChild(messageElement);
        animateMessageIn(messageElement);
        saveMessageToHistory('user', message);
        scrollToBottom();
    }

    function addBotMessage(message, immediate = false) {
        const messageElement = createMessageElement('bot', message);
        chatBox.appendChild(messageElement);
        
        if (immediate) {
            saveMessageToHistory('bot', message);
            scrollToBottom();
        } else {
            animateMessageIn(messageElement);
            saveMessageToHistory('bot', message);
        }
    }

    function simulateTyping(message) {
        let i = 0;
        const messageElement = createMessageElement('bot', '');
        chatBox.appendChild(messageElement);
        animateMessageIn(messageElement);
        
        const content = messageElement.querySelector('.message-content');
        const typingInterval = setInterval(() => {
            if (i < message.length) {
                content.textContent += message.charAt(i);
                i++;
                scrollToBottom();
            } else {
                clearInterval(typingInterval);
                saveMessageToHistory('bot', message);
            }
        }, 5 + Math.random() * 3);
    }

    // History Management Functions
    function loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const now = new Date();
        
        // Filter out messages older than 7 days
        const recentHistory = history.filter(msg => {
            const msgDate = new Date(msg.timestamp);
            return (now - msgDate) < (7 * 24 * 60 * 60 * 1000);
        });
        
        // Update storage if we filtered anything out
        if (recentHistory.length !== history.length) {
            localStorage.setItem('chatHistory', JSON.stringify(recentHistory));
        }
        
        recentHistory.forEach(msg => {
            const messageElement = createMessageElement(msg.sender, msg.content);
            chatBox.appendChild(messageElement);
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        
        scrollToBottom();
    }

    function saveMessageToHistory(sender, content) {
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        history.push({
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        });
        
        // Keep only the last 100 messages
        if (history.length > 100) {
            history.shift();
        }
        
        localStorage.setItem('chatHistory', JSON.stringify(history));
    }

    function clearChatHistory() {
        localStorage.removeItem('chatHistory');
        chatBox.innerHTML = '';
        setTimeout(() => {
            addBotMessage("Hello! I'm your Django chatbot. How can I help you today?", true);
        }, 800);
    }

    // UI Helper Functions
    function createMessageElement(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const senderLabel = document.createElement('div');
        senderLabel.classList.add('message-sender');
        senderLabel.textContent = sender === 'user' ? 'You' : 'Bot';
        messageElement.appendChild(senderLabel);
        
        const content = document.createElement('div');
        content.classList.add('message-content');
        content.textContent = message;
        messageElement.appendChild(content);
        
        const time = document.createElement('div');
        time.classList.add('message-time');
        time.textContent = getCurrentTime();
        messageElement.appendChild(time);
        
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        
        return messageElement;
    }

    function animateMessageIn(element) {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            scrollToBottom();
        }, 10);
    }

    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    function scrollToBottom() {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Utility Function
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});