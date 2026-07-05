// State Management
let currentCharacter = 'hitesh';
let conversations = {
  hitesh: [],
  piyush: []
};
let activeTheme = 'dark';

// DOM Elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const charCards = document.querySelectorAll('.character-card');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const typingStatus = document.getElementById('typingStatus');

// Character Meta Details
const charMeta = {
  hitesh: {
    name: 'Hitesh Sir',
    tagline: 'Tech Educator • Chai Lover',
    statusLink: 'https://hitesh.ai/',
    statusText: 'hitesh.ai',
    placeholder: 'Ask Hitesh Sir about development, React, Docker, or grab a cup of chai...'
  },
  piyush: {
    name: 'Piyush Sir',
    tagline: 'Principal Engineer • Thar 4x4',
    statusLink: 'https://www.piyushgarg.dev/',
    statusText: 'piyushgarg.dev',
    placeholder: 'Ask Piyush Sir about distributed systems, backend scaling, or Thar chassis...'
  }
};

// Initialize Application
function init() {
  // Load Theme
  const savedTheme = localStorage.getItem('persona-theme');
  if (savedTheme) {
    activeTheme = savedTheme;
  }
  document.documentElement.setAttribute('data-theme', activeTheme);
  
  // Load Conversations
  const savedChats = localStorage.getItem('persona-chats');
  if (savedChats) {
    try {
      conversations = JSON.parse(savedChats);
    } catch (e) {
      console.error("Error loading chat history", e);
    }
  }

  // Load Active Character
  const savedChar = localStorage.getItem('persona-char');
  if (savedChar && charMeta[savedChar]) {
    currentCharacter = savedChar;
  }

  setupEventListeners();
  updateUIForCharacter();
  renderChatHistory();
}

// Setup Event Listeners
function setupEventListeners() {
  // Sidebar toggles for mobile
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
  });

  sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  // Character selectors
  charCards.forEach(card => {
    card.addEventListener('click', () => {
      const char = card.getAttribute('data-char');
      if (char !== currentCharacter) {
        switchCharacter(char);
      }
      sidebar.classList.remove('open'); // close on mobile select
    });
  });

  // Theme switch
  themeToggleBtn.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('persona-theme', activeTheme);
  });

  // Clear Chat History
  clearChatBtn.addEventListener('click', () => {
    if (confirm(`Are you sure you want to clear your chat history with ${charMeta[currentCharacter].name}?`)) {
      conversations[currentCharacter] = [];
      localStorage.setItem('persona-chats', JSON.stringify(conversations));
      renderChatHistory();
    }
  });

  // Textarea auto-resize
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight - 16) + 'px';
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Form Submit
  chatForm.addEventListener('submit', handleFormSubmit);
}

// Switch Character
function switchCharacter(char) {
  currentCharacter = char;
  localStorage.setItem('persona-char', char);
  
  // Update Active Class on Sidebar
  charCards.forEach(card => {
    if (card.getAttribute('data-char') === char) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  updateUIForCharacter();
  renderChatHistory();
}

// Update Chat Header details and Input placeholders
function updateUIForCharacter() {
  const meta = charMeta[currentCharacter];
  document.getElementById('headerName').textContent = meta.name;
  document.getElementById('headerStatus').innerHTML = `<a href="${meta.statusLink}" target="_blank" class="header-status-link">${meta.statusText}</a>`;
  
  const headerAvatar = document.getElementById('headerAvatar');
  headerAvatar.innerHTML = `<img src="${currentCharacter}.jpg" alt="${meta.name}">`;
  headerAvatar.className = `avatar active-header-avatar ${currentCharacter}-avatar`;
  
  userInput.placeholder = meta.placeholder;
  userInput.value = '';
  userInput.style.height = 'auto';
}

// Render Chat History
function renderChatHistory() {
  chatMessages.innerHTML = '';
  const history = conversations[currentCharacter] || [];

  if (history.length === 0) {
    // Show welcome message
    const welcome = document.createElement('div');
    welcome.className = 'system-message';
    welcome.innerHTML = `
      <div class="system-avatar orange-glow">
        <i data-lucide="sparkles"></i>
      </div>
      <div class="system-content">
        <h3>Chat with ${charMeta[currentCharacter].name}</h3>
      </div>
    `;
    chatMessages.appendChild(welcome);
    lucide.createIcons();
    return;
  }

  let i = 0;
  while (i < history.length) {
    const msg = history[i];

    if (msg.role === 'user') {
      appendUserBubble(msg.content);
      i++;
    } else if (msg.role === 'assistant') {
      // Group consecutive assistant steps belonging to a single API call response pipeline
      const steps = [];
      while (i < history.length && history[i].role === 'assistant') {
        try {
          const parsed = JSON.parse(history[i].content);
          steps.push(parsed);
        } catch (e) {
          // Fallback if not stringified JSON
          steps.push({ step: 'OUTPUT', text: history[i].content });
        }
        i++;
      }

      // Separate thoughts from the final output/rejected message
      const thoughtSteps = [];
      let finalOutput = null;

      steps.forEach(stepObj => {
        const stepName = (stepObj.step || '').toUpperCase();
        if (stepName === 'OUTPUT' || stepName === 'REJECTED') {
          finalOutput = stepObj;
        } else {
          thoughtSteps.push(stepObj);
        }
      });

      appendAIPipelineAndResponse(thoughtSteps, finalOutput);
    } else {
      i++; // skip system prompt or other roles
    }
  }

  scrollToBottom();
}

// Helper: Get custom welcome message text based on character
function getWelcomeSnippet(char) {
  if (char === 'hitesh') {
    return 'Hanji, kesse ho app, tho aaj hum baat karenge tech jobs, React native, aur architecture ke baare mein. Keep a cup of hot chai ready, aur chaliye shuru karte hain!';
  } else {
    return "Hey everyone, Piyush here! Let's talk about real-world backend engineering. Stop writing toy code, let's build for production. Chalo machate hain!";
  }
}

// Append User Message Bubble
function appendUserBubble(text) {
  const row = document.createElement('div');
  row.className = 'message-row user';
  row.innerHTML = `
    <div class="message-bubble">
      ${escapeHTML(text)}
    </div>
  `;
  chatMessages.appendChild(row);
}

// Append AI pipeline steps + Output bubble
function appendAIPipelineAndResponse(thoughts, outputObj) {
  // 1. Render pipeline steps if they exist
  if (thoughts.length > 0) {
    const pipelineContainer = document.createElement('div');
    pipelineContainer.className = 'pipeline-container';
    
    const stepsHtml = thoughts.map((t, idx) => {
      const stepClass = (t.step || '').toLowerCase();
      const stepTitle = getStepTitle(t.step);
      return `
        <div class="pipeline-step ${stepClass}">
          <div class="step-marker">${idx + 1}</div>
          <div class="step-details">
            <div class="step-name">${stepTitle}</div>
            <div class="step-text">${escapeHTML(t.text)}</div>
          </div>
        </div>
      `;
    }).join('');

    pipelineContainer.innerHTML = `
      <div class="pipeline-header">
        <span class="pipeline-title">
          <i data-lucide="brain-circuit"></i>
          AI Reasoning Pathway (${thoughts.length} steps)
        </span>
        <i data-lucide="chevron-down" class="pipeline-chevron"></i>
      </div>
      <div class="pipeline-body">
        ${stepsHtml}
      </div>
    `;

    // Add collapse trigger
    const header = pipelineContainer.querySelector('.pipeline-header');
    header.addEventListener('click', () => {
      pipelineContainer.classList.toggle('open');
    });

    chatMessages.appendChild(pipelineContainer);
  }

  // 2. Render final response bubble
  if (outputObj) {
    const row = document.createElement('div');
    row.className = 'message-row ai';
    
    const isRejected = (outputObj.step || '').toUpperCase() === 'REJECTED';
    const bubbleClass = isRejected ? 'message-bubble rejected-bubble' : 'message-bubble';
    
    // Convert links into clickable tags
    const formattedText = linkifyText(escapeHTML(outputObj.text));

    row.innerHTML = `
      <div class="${bubbleClass}">
        ${formattedText}
      </div>
    `;
    chatMessages.appendChild(row);
  }

  lucide.createIcons();
}

// Helper: Get full title for pipeline steps
function getStepTitle(step) {
  switch ((step || '').toUpperCase()) {
    case 'INITIAL': return 'Initial Assessment';
    case 'THINK': return 'Deep Think Loop';
    case 'ANALYSE': return 'Technical Validation';
    case 'REJECTED': return 'Policy Violation (Rejected)';
    default: return step || 'Thinking Step';
  }
}

// Escape HTML utility
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Linkify text containing youtube/other HTTP links
function linkifyText(text) {
  const urlPattern = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(urlPattern, '<a href="$1" target="_blank" class="chat-link">$1</a>');
}

// Scroll to bottom of chat area
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  // Clear Input & reset size
  userInput.value = '';
  userInput.style.height = 'auto';

  // Add message to conversation state
  const userMsg = { role: 'user', content: text };
  conversations[currentCharacter].push(userMsg);
  
  // Render user bubble immediately
  appendUserBubble(text);
  scrollToBottom();

  // Show Typing Indicator
  typingStatus.textContent = "Connecting to agent...";
  typingIndicator.classList.remove('hidden');
  scrollToBottom();

  // Disable Inputs
  userInput.disabled = true;
  sendBtn.disabled = true;

  try {
    // Setup interval to cycle typing status text for immersive pipeline feeling
    const statuses = ["Analyzing query...", "Executing prompt pipelines...", "Thinking...", "Validating response..."];
    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      if (!typingIndicator.classList.contains('hidden')) {
        typingStatus.textContent = statuses[statusIdx % statuses.length];
        statusIdx++;
      } else {
        clearInterval(statusInterval);
      }
    }, 2000);

    // Call Express API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        character: currentCharacter,
        history: conversations[currentCharacter].slice(0, -1) // pass history before current message
          .map(msg => {
            // Ensure intermediate steps are passed correctly as assistant JSON strings
            return { role: msg.role, content: msg.content };
          })
          .concat(userMsg)
      })
    });

    clearInterval(statusInterval);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to communicate with AI');
    }

    // Hide loader
    typingIndicator.classList.add('hidden');

    // Store responses in conversation state
    const newSteps = data.newSteps || [];
    newSteps.forEach(step => {
      conversations[currentCharacter].push({
        role: 'assistant',
        content: JSON.stringify(step)
      });
    });

    // Save to local storage
    localStorage.setItem('persona-chats', JSON.stringify(conversations));

    // Render response
    const thoughtSteps = [];
    let finalOutput = null;

    newSteps.forEach(stepObj => {
      const stepName = (stepObj.step || '').toUpperCase();
      if (stepName === 'OUTPUT' || stepName === 'REJECTED') {
        finalOutput = stepObj;
      } else {
        thoughtSteps.push(stepObj);
      }
    });

    appendAIPipelineAndResponse(thoughtSteps, finalOutput);
    scrollToBottom();

  } catch (error) {
    console.error(error);
    typingIndicator.classList.add('hidden');
    
    // Render error bubble
    const row = document.createElement('div');
    row.className = 'message-row ai';
    row.innerHTML = `
      <div class="message-bubble error-bubble">
        <strong>Error:</strong> ${escapeHTML(error.message || 'Something went wrong.')}
      </div>
    `;
    chatMessages.appendChild(row);
    scrollToBottom();
    
    // Remove the failed user message from history so they can retry
    conversations[currentCharacter].pop();
  } finally {
    // Re-enable Inputs
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// Run Initialization
document.addEventListener('DOMContentLoaded', init);
