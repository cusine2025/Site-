// Fonction pour interagir avec l'API Groq
async function fetchGroqData(prompt) {
    const apiKey = "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"; // Votre clé API
    const url = "https://api.groq.com/openai/v1/chat/completions"; // Endpoint de l'API Groq

    const requestBody = {
        model: "llama3-8b-8192", // Modèle à utiliser
        messages: [{ role: "user", content: prompt }], // Message de l'utilisateur
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur:', error);
        return "Désolé, une erreur est survenue lors de la communication avec l'API.";
    }
}

// Fonction pour afficher un message dans le chat
function displayMessage(message, className) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add(className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fonction pour afficher "Veuillez patienter..."
function displayTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("bot-message");
    typingIndicator.textContent = "Veuillez patienter...";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingIndicator;
}

// Gestionnaire du bouton d'envoi
document.getElementById("send-btn").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    displayMessage(userInput, 'user-message');
    const typingIndicator = displayTypingIndicator();

    let responseText = await fetchGroqData(userInput);
    document.getElementById("chat-box").removeChild(typingIndicator);
    displayMessage(responseText, 'bot-message');
    document.getElementById("user-input").value = "";
});
