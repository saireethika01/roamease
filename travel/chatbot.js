/* chatbot.js */

let chatMessages = [];
let chatHistory = [];

document.addEventListener("DOMContentLoaded", () => {
    const chatbotHTML = `
        <div class="chatbot-fab" id="chatbotFab" onclick="toggleChatbot()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="roamie-svg">
                <path fill="var(--head-color)" d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14V15A2,2 0 0,1 19,17H18V18A3,3 0 0,1 15,21H9A3,3 0 0,1 6,18V17H5A2,2 0 0,1 3,15V14A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z"/>
                <circle cx="9.5" cy="12.5" r="2.5" fill="var(--socket-color)" />
                <circle cx="14.5" cy="12.5" r="2.5" fill="var(--socket-color)" />
                <g class="bot-pupils">
                    <circle cx="9.5" cy="12.5" r="1.2" fill="var(--pupil-color)" />
                    <circle cx="14.5" cy="12.5" r="1.2" fill="var(--pupil-color)" />
                </g>
            </svg>
        </div>

        <div class="chatbot-sheet" id="chatbotSheet">
            <div class="chatbot-header">
                <div class="chatbot-header-content">
                    <div class="chatbot-avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="roamie-svg">
                            <path fill="var(--head-color)" d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14V15A2,2 0 0,1 19,17H18V18A3,3 0 0,1 15,21H9A3,3 0 0,1 6,18V17H5A2,2 0 0,1 3,15V14A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z"/>
                            <circle cx="9.5" cy="12.5" r="2.5" fill="var(--socket-color)" />
                            <circle cx="14.5" cy="12.5" r="2.5" fill="var(--socket-color)" />
                            <g class="bot-pupils">
                                <circle cx="9.5" cy="12.5" r="1.2" fill="var(--pupil-color)" />
                                <circle cx="14.5" cy="12.5" r="1.2" fill="var(--pupil-color)" />
                            </g>
                        </svg>
                    </div>
                    <div class="chatbot-header-text">
                        <div class="name-row">
                            <h3>Roamie</h3>
                            <span class="prev-chats-link" onclick="showPreviousChats()">Previous Chats</span>
                        </div>
                        <span class="chatbot-status">Online</span>
                    </div>
                </div>
                <div class="chatbot-header-actions">
                    <div class="chatbot-action" onclick="clearChat()" title="Start New Chat">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </div>
                    <div class="chatbot-action close-btn" onclick="toggleChatbot()" title="Close">&times;</div>
                </div>
            </div>
            
            <div class="chatbot-body" id="chatbotBody">
                <!-- Messages go here -->
            </div>

            <div class="chatbot-history-body" id="chatbotHistoryBody" style="display: none;">
                <div class="history-header">
                    <button class="back-to-chat-btn" onclick="hidePreviousChats()">
                        &larr; Back to Chat
                    </button>
                </div>
                <div id="historyList" class="history-list"></div>
            </div>
            
            <div class="chatbot-footer" id="chatbotFooter">
                <div class="chatbot-input-container">
                    <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Ask Roamie anything..." onkeypress="handleChatbotKeyPress(event)">
                    <button class="chatbot-send-btn" onclick="sendChatbotMessage()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    loadChat();
});

// Load marked.js for markdown parsing
const markedScript = document.createElement('script');
markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
document.head.appendChild(markedScript);

function toggleChatbot() {
    const sheet = document.getElementById('chatbotSheet');
    sheet.classList.toggle('open');
}

function saveChat() {
    localStorage.setItem('roamease_current_chat', JSON.stringify(chatMessages));
}

function loadChat() {
    const savedHistory = localStorage.getItem('roamease_chat_history');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
    }
    const saved = localStorage.getItem('roamease_current_chat');
    const chatBody = document.getElementById('chatbotBody');
    chatBody.innerHTML = '';
    
    if (saved) {
        chatMessages = JSON.parse(saved);
        if (chatMessages.length === 0) {
            appendMessage("Hi! I'm Roamie ✨ How can I help you plan your next adventure?", 'bot', false);
        } else {
            chatMessages.forEach(msg => {
                appendMessage(msg.content, msg.role === 'user' ? 'user' : 'bot', false);
            });
        }
    } else {
        chatMessages = [];
        appendMessage("Hi! I'm Roamie ✨ How can I help you plan your next adventure?", 'bot', false);
    }
}

function saveCurrentChatToHistory() {
    // Only save if there are user messages
    if (chatMessages.some(m => m.role === 'user')) {
        chatHistory.push({
            timestamp: Date.now(),
            messages: [...chatMessages]
        });
        localStorage.setItem('roamease_chat_history', JSON.stringify(chatHistory));
    }
}

function clearChat() {
    saveCurrentChatToHistory();
    chatMessages = [];
    saveChat();
    loadChat();
}

function showPreviousChats() {
    document.getElementById('chatbotBody').style.display = 'none';
    document.getElementById('chatbotFooter').style.display = 'none';
    document.getElementById('chatbotHistoryBody').style.display = 'flex';
    
    renderHistoryList();
}

function hidePreviousChats() {
    document.getElementById('chatbotHistoryBody').style.display = 'none';
    document.getElementById('chatbotBody').style.display = 'flex';
    document.getElementById('chatbotFooter').style.display = 'block';
    
    const chatBody = document.getElementById('chatbotBody');
    chatBody.scrollTop = chatBody.scrollHeight;
}

function renderHistoryList() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    
    if (chatHistory.length === 0) {
        list.innerHTML = '<div class="no-history">No previous chats.</div>';
        return;
    }
    
    // Reverse copy so newest is at the top
    const historyReversed = [...chatHistory].reverse();
    historyReversed.forEach((historyItem, index) => {
        const realIndex = chatHistory.length - 1 - index;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        
        const firstUserMsg = historyItem.messages.find(m => m.role === 'user');
        let title = firstUserMsg ? firstUserMsg.content : 'Chat Session';
        if (title.length > 40) title = title.substring(0, 40) + '...';
        
        const dateStr = new Date(historyItem.timestamp).toLocaleString();
        
        itemDiv.innerHTML = `
            <div class="history-title">${title}</div>
            <div class="history-date">${dateStr}</div>
        `;
        itemDiv.onclick = () => loadHistoryChat(realIndex);
        list.appendChild(itemDiv);
    });
}

function loadHistoryChat(index) {
    saveCurrentChatToHistory();
    
    const historyItem = chatHistory[index];
    chatMessages = [...historyItem.messages];
    saveChat();
    
    // Remove from history list as it is now the active chat
    chatHistory.splice(index, 1);
    localStorage.setItem('roamease_chat_history', JSON.stringify(chatHistory));
    
    loadChat();
    hidePreviousChats();
}

function handleChatbotKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

async function sendChatbotMessage() {
    const inputField = document.getElementById('chatbotInput');
    const message = inputField.value.trim();
    if (!message) return;

    inputField.value = '';

    chatMessages.push({ role: 'user', content: message });
    saveChat();
    appendMessage(message, 'user', true);

    const typingId = showTypingIndicator();

    try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: chatMessages })
        });

        const data = await response.json();
        removeElement(typingId);

        if (response.ok) {
            appendMessage(data.reply, 'bot', true);
            chatMessages.push({ role: 'assistant', content: data.reply });
            saveChat();
        } else {
            appendMessage("Sorry, I encountered an error.", 'bot', true);
        }
    } catch (error) {
        removeElement(typingId);
        appendMessage("Sorry, I couldn't connect to the server.", 'bot', true);
    }
}

function appendMessage(text, sender, animate = true) {
    const chatBody = document.getElementById('chatbotBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    if (!animate) msgDiv.style.animation = 'none';
    
    if (sender === 'bot') {
        if (typeof marked !== 'undefined') {
            msgDiv.innerHTML = marked.parse(text);
        } else {
            msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        }
    } else {
        msgDiv.innerText = text;
    }
    
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
    const chatBody = document.getElementById('chatbotBody');
    const id = 'typing-' + Date.now();
    const typingHTML = `
        <div class="chat-message bot typing-indicator" id="${id}">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatBody.insertAdjacentHTML('beforeend', typingHTML);
    chatBody.scrollTop = chatBody.scrollHeight;
    return id;
}

function removeElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Add pupil tracking for Roamie's eyes
document.addEventListener('mousemove', (e) => {
    const svgs = document.querySelectorAll('.roamie-svg');
    svgs.forEach(svg => {
        const pupilGroup = svg.querySelector('.bot-pupils');
        if (!pupilGroup) return;
        
        const rect = svg.getBoundingClientRect();
        if (rect.width === 0) return;

        const svgCenterX = rect.left + rect.width / 2;
        const svgCenterY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - svgCenterX;
        const deltaY = e.clientY - svgCenterY;
        
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(1, Math.sqrt(deltaX*deltaX + deltaY*deltaY) / 300);
        
        const moveX = Math.cos(angle) * distance * 1.3;
        const moveY = Math.sin(angle) * distance * 1.3;
        
        pupilGroup.setAttribute('transform', `translate(${moveX}, ${moveY})`);
    });
});
