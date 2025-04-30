document.addEventListener("DOMContentLoaded", function() {
    const chatbotBtn = document.querySelector(".chatbot-btn");
    const chatbotPopup = document.getElementById("chatbotPopup");
    const chatbotClose = document.getElementById("chatbotClose");
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    const csrftoken = getCookie('csrftoken');

    chatbotBtn.addEventListener("click", function(e) {
        e.preventDefault();
        chatbotPopup.style.display = chatbotPopup.style.display === "flex" ? "none" : "flex";
        chatbotPopup.style.flexDirection = "column";
    });

    chatbotClose.addEventListener("click", function() {
        chatbotPopup.style.display = "none";
    });

    sendButton.addEventListener("click", function() {
        const message = userInput.value.trim();
        if (!message) return;

        // Show user message
        const userMessageDiv = document.createElement("div");
        userMessageDiv.classList.add("user-message");
        userMessageDiv.innerText = message;
        chatBox.appendChild(userMessageDiv);

        userInput.value = "";

        // Show typing indicator
        const typingIndicator = document.getElementById("typing-indicator");
        typingIndicator.style.display = "block";

        // Send message to backend
        fetch("/api/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => {
            typingIndicator.style.display = "none";
            if (!response.ok) throw new Error("Network error");
            return response.json();
        })
        .then(data => {
            const botMessageDiv = document.createElement("div");
            botMessageDiv.classList.add("bot-message");
            botMessageDiv.innerText = data.response || "No response";
            chatBox.appendChild(botMessageDiv);
        })
        .catch(err => {
            typingIndicator.style.display = "none";
            alert("Something went wrong: " + err.message);
        });
    });
});
