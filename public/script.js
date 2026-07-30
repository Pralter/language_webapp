// ===============================
// DOM ELEMENTS
// ===============================

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

const themeToggle = document.getElementById("themeToggle");

const flashcard = document.getElementById("flashcard");
const flipButton = document.getElementById("flipCard");

const previousButton = document.getElementById("previousCard");
const nextButton = document.getElementById("nextCard");

const masteredButton = document.getElementById("masteredBtn");
const practiceButton = document.getElementById("practiceBtn");

const directionSelect = document.getElementById("directionSelect");
const categorySelect = document.getElementById("categorySelect");

const frontWord = document.getElementById("frontWord");
const translation = document.getElementById("translation");
const phonetic = document.getElementById("phonetic");
const example = document.getElementById("example");
const cardCounter = document.getElementById("cardCounter");

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

const chips = document.querySelectorAll(".chip");


// ===============================
// FLASHCARD DATA
// ===============================

const flashcards = {

    "Greetings": [

        {
            english: "Hello",
            nepali: "नमस्ते",
            pronunciation: "Namaste",
            example:
                "Hello! How are you?\nनमस्ते! तपाईंलाई कस्तो छ?"
        },

        {
            english: "Good Morning",
            nepali: "शुभ प्रभात",
            pronunciation: "Shubha Prabhat",
            example:
                "Good morning everyone.\nसबैलाई शुभ प्रभात।"
        },

        {
            english: "Thank You",
            nepali: "धन्यवाद",
            pronunciation: "Dhanyabad",
            example:
                "Thank you for helping me.\nमलाई सहयोग गर्नु भएकोमा धन्यवाद।"
        },

        {
            english: "Goodbye",
            nepali: "फेरि भेटौँला",
            pronunciation: "Pheri Bhetaula",
            example:
                "Goodbye! See you tomorrow.\nफेरि भेटौँला!"
        }

    ],

    "Daily Life": [

        {
            english: "Water",
            nepali: "पानी",
            pronunciation: "Pani",
            example:
                "Please drink more water.\nकृपया धेरै पानी पिउनुहोस्।"
        },

        {
            english: "House",
            nepali: "घर",
            pronunciation: "Ghar",
            example:
                "My house is nearby.\nमेरो घर नजिकै छ।"
        },

        {
            english: "Book",
            nepali: "किताब",
            pronunciation: "Kitab",
            example:
                "This book is interesting.\nयो किताब रमाइलो छ।"
        },

        {
            english: "School",
            nepali: "विद्यालय",
            pronunciation: "Vidyalaya",
            example:
                "She goes to school.\nउनी विद्यालय जान्छिन्।"
        }

    ],

    "Travel": [

        {
            english: "Airport",
            nepali: "विमानस्थल",
            pronunciation: "Bimanasthal",
            example:
                "Where is the airport?\nविमानस्थल कहाँ छ?"
        },

        {
            english: "Bus",
            nepali: "बस",
            pronunciation: "Bas",
            example:
                "The bus is arriving.\nबस आइरहेको छ।"
        },

        {
            english: "Hotel",
            nepali: "होटल",
            pronunciation: "Hotel",
            example:
                "Our hotel is clean.\nहाम्रो होटल सफा छ।"
        },

        {
            english: "Ticket",
            nepali: "टिकट",
            pronunciation: "Tikat",
            example:
                "I need one ticket.\nमलाई एउटा टिकट चाहिन्छ।"
        }

    ],

    "Food & Dining": [

        {
            english: "Rice",
            nepali: "भात",
            pronunciation: "Bhat",
            example:
                "Rice is ready.\nभात पाकिसकेको छ।"
        },

        {
            english: "Tea",
            nepali: "चिया",
            pronunciation: "Chiya",
            example:
                "Would you like tea?\nतपाईंलाई चिया चाहिन्छ?"
        },

        {
            english: "Restaurant",
            nepali: "भोजनालय",
            pronunciation: "Bhojanalaya",
            example:
                "Let's go to the restaurant.\nभोजनालय जाऔँ।"
        },

        {
            english: "Delicious",
            nepali: "मिठो",
            pronunciation: "Mitho",
            example:
                "The food is delicious.\nखाना मिठो छ।"
        }

    ]

};


// ===============================
// APPLICATION STATE
// ===============================

let currentCategory = "Greetings";
let currentIndex = 0;
let direction = "ne-en";


// ===============================
// THEME
// ===============================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const darkMode = document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        darkMode ? "dark" : "light"
    );

    themeToggle.textContent = darkMode
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

});


// ===============================
// TAB SWITCHING
// ===============================

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(button =>
            button.classList.remove("active")
        );

        panels.forEach(panel =>
            panel.classList.remove("active")
        );

        tab.classList.add("active");

        document
            .getElementById(tab.dataset.tab)
            .classList.add("active");

    });

});
// ===============================
// FLASHCARD ENGINE
// ===============================

function getCurrentCards() {
    return flashcards[currentCategory];
}

function getCurrentCard() {
    return getCurrentCards()[currentIndex];
}

function getStatusKey() {
    return `flashcard-status-${currentCategory}-${currentIndex}`;
}

function renderCard() {

    const card = getCurrentCard();

    if (direction === "ne-en") {

        frontWord.textContent = card.nepali;
        translation.textContent = card.english;

    } else {

        frontWord.textContent = card.english;
        translation.textContent = card.nepali;

    }

    phonetic.textContent = card.pronunciation;
    example.textContent = card.example;

    cardCounter.textContent =
        `Card ${currentIndex + 1} of ${getCurrentCards().length}`;

    flashcard.classList.remove("flipped");

    updateStatusButtons();
}

function updateStatusButtons() {

    const status = localStorage.getItem(getStatusKey());

    masteredButton.classList.remove("primary");
    masteredButton.classList.add("secondary");

    practiceButton.classList.remove("primary");
    practiceButton.classList.add("secondary");

    if (status === "mastered") {

        masteredButton.classList.remove("secondary");
        masteredButton.classList.add("primary");

    }

    if (status === "practice") {

        practiceButton.classList.remove("secondary");
        practiceButton.classList.add("primary");

    }

}

function saveStatus(value) {

    localStorage.setItem(getStatusKey(), value);

    updateStatusButtons();

}


// ===============================
// FLIP CARD
// ===============================

function flipCard() {

    flashcard.classList.toggle("flipped");

}

flipButton.addEventListener("click", flipCard);

flashcard.addEventListener("click", flipCard);


// ===============================
// NEXT CARD
// ===============================

nextButton.addEventListener("click", () => {

    if (currentIndex < getCurrentCards().length - 1) {

        currentIndex++;

    } else {

        currentIndex = 0;

    }

    renderCard();

});


// ===============================
// PREVIOUS CARD
// ===============================

previousButton.addEventListener("click", () => {

    if (currentIndex > 0) {

        currentIndex--;

    } else {

        currentIndex = getCurrentCards().length - 1;

    }

    renderCard();

});


// ===============================
// CATEGORY CHANGE
// ===============================

categorySelect.addEventListener("change", () => {

    currentCategory = categorySelect.value;

    currentIndex = 0;

    renderCard();

});


// ===============================
// LANGUAGE DIRECTION
// ===============================

directionSelect.addEventListener("change", () => {

    direction = directionSelect.value;

    renderCard();

});


// ===============================
// STATUS BUTTONS
// ===============================

masteredButton.addEventListener("click", () => {

    saveStatus("mastered");

});

practiceButton.addEventListener("click", () => {

    saveStatus("practice");

});


// ===============================
// KEYBOARD SHORTCUTS
// ===============================

document.addEventListener("keydown", (event) => {

    // Don't interfere while typing in the chat box
    if (document.activeElement === userInput) return;

    switch (event.key) {

        case "ArrowRight":
            nextButton.click();
            break;

        case "ArrowLeft":
            previousButton.click();
            break;

        case " ":
            event.preventDefault();
            flipCard();
            break;

    }

});


// ===============================
// INITIAL RENDER
// ===============================

renderCard();

// ===============================
// AI CHATBOT
// ===============================

function addMessage(text, sender) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        "message",
        sender
    );

    messageDiv.textContent = text;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;

}


// ===============================
// TYPING INDICATOR
// ===============================

function showTypingIndicator() {

    const typing = document.createElement("div");

    typing.classList.add(
        "message",
        "bot"
    );

    typing.id = "typingIndicator";

    typing.textContent = "Typing...";

    chatBox.appendChild(typing);

    chatBox.scrollTop = chatBox.scrollHeight;

}


function removeTypingIndicator() {

    const typing =
        document.getElementById("typingIndicator");

    if (typing) {

        typing.remove();

    }

}


// ===============================
// SEND MESSAGE TO GEMINI
// ===============================

async function sendMessage() {

    const message =
        userInput.value.trim();


    if (!message) {

        return;

    }


    addMessage(
        message,
        "user"
    );


    userInput.value = "";


    showTypingIndicator();


    sendButton.disabled = true;


    try {

        const response =
            await fetch("/api/chat", {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"

                },

                body: JSON.stringify({

                    message

                })

            });


        const data =
            await response.json();


        removeTypingIndicator();


        if (data.success) {

            addMessage(
                data.reply,
                "bot"
            );

        } else {

            addMessage(
                "Sorry, I could not generate a response.",
                "bot"
            );

        }


    } catch (error) {


        console.error(
            "Chat error:",
            error
        );


        removeTypingIndicator();


        addMessage(
            "⚠️ Unable to connect to the tutor. Please check your internet connection or server.",
            "bot"
        );


    } finally {


        sendButton.disabled = false;

        userInput.focus();


    }

}


// ===============================
// SEND BUTTON
// ===============================

sendButton.addEventListener(
    "click",
    sendMessage
);


// ===============================
// ENTER TO SEND
// ===============================

userInput.addEventListener(
    "keydown",
    (event) => {


        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }


    }
);


// ===============================
// QUICK PROMPT CHIPS
// ===============================

chips.forEach(chip => {


    chip.addEventListener(
        "click",
        () => {


            userInput.value =
                chip.dataset.prompt;


            sendMessage();


        }
    );


});


// ===============================
// INITIAL MESSAGE FOCUS
// ===============================

userInput.focus();