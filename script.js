        import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
        import { GoogleGenerativeAI } from "@google/generative-ai";

        const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            apiUrl: API_URL
        });

        function filterResponse(text) {
            text = text.replace(/Gemini/gi, "AI");
            const inappropriateWords = ["idota", "badword2"];
            for (let word of inappropriateWords) {
                const regex = new RegExp(`\\b${word}\\b`, "gi");
                text = text.replace(regex, "[censuré]");
            }
            return text;
        }

        function appendMessage(content, sender) {
            const message = document.createElement("div");
            message.classList.add(sender === "user" ? "user-message" : "bot-message");
            message.innerHTML = `<div class="message-container">${marked.parse(content)}</div>`;

            document.getElementById("chat-box").appendChild(message);
            document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;
        }

        async function run() {
            const prompt = document.getElementById("user-input").value.trim().toLowerCase();
            if (!prompt) return;

            appendMessage(prompt, "user");

            const typingIndicator = document.createElement("div");
            typingIndicator.classList.add("bot-message");
            typingIndicator.innerHTML = `<div class="message-container">veillez patienter . . .</div>`;
            document.getElementById("chat-box").appendChild(typingIndicator);

            let responseText;

            if (prompt === "salut, comment vas-tu ?") {
                responseText = "Bonjour";
            } else if (prompt === "bonjour, comment vas-tu ?") {
                responseText = "je vais bien et toi ?";
            } else if (prompt.includes("comment vas-tu ?") || prompt.includes("qui es-tu ?")) {
                responseText = "Je suis une intelligence artificielle créée par Messie Osango !";
            } else if (prompt.includes("créateur")) {
                responseText = "Mon créateur est Messie Osango.";
            } else {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = await response.text();
                responseText = filterResponse(text);
            }

            document.getElementById("chat-box").removeChild(typingIndicator);
            appendMessage(responseText || "Désolé, je ne peux pas répondre à ça.", "bot");
            document.getElementById("user-input").value = "";
        }

        document.getElementById("send-btn").addEventListener("click", run);
        document.getElementById("user-input").addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                run();
            }
        });
