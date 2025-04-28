document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Fade Animation for All Cards ---
    const sections = document.querySelectorAll('.card');
    const observerOptions = {
        root: null,
        threshold: 0.3,
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // --- Smooth Expand + Scroll on Nav Link Click ---
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection && !targetSection.classList.contains('expanded')) {
                targetSection.classList.add('expanded');
            }

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // --- Chatbot Button Click ---
    // const chatbotBtn = document.querySelector('.chatbot-btn');
    // chatbotBtn.addEventListener('click', () => {
    //     alert("Hi there! 👋\nThis chatbot is coming soon. Stay tuned!");
    //     // Later you can open a chatbot modal or connect to a real chatbot
    // });
});
