document.addEventListener("DOMContentLoaded", function() {
    const chatbotBtn = document.querySelector(".chatbot-btn");
    const chatbotPopup = document.getElementById("chatbotPopup");
    const chatbotClose = document.getElementById("chatbotClose");

    chatbotBtn.addEventListener("click", function(e) {
        e.preventDefault();
        chatbotPopup.style.display = chatbotPopup.style.display === "flex" ? "none" : "flex";
        chatbotPopup.style.flexDirection = "column"; // Make sure it's a column layout
    });

    chatbotClose.addEventListener("click", function() {
        chatbotPopup.style.display = "none";
    });
});
