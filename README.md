# 🎭 Persona AI - Interactive Chat

An innovative web application that allows users to interact with AI-powered personas of renowned tech educators. Chat, learn and get insights from different personalities in a dynamic conversation experience.

## 🌐 Live Demo

**Deployed Application:** [https://personai.janhvidev.in/](https://personai.janhvidev.in/)

## ✨ Features

- **Interactive Multi-Persona Chat**: Switch between different AI personas (Hitesh Sir, Piyush Sir, and more)
- **Real-time Conversations**: Seamless chat experience powered by OpenAI's API
- **Conversation History**: Maintain context across multiple messages with each persona
- **Responsive Design**: Beautiful, modern UI that works across all devices
- **Dark Mode Support**: Eye-friendly interface with theme toggle capability
- **Character Profiles**: Distinct personalities with unique perspectives and expertise
- **Stream-based Responses**: Real-time message streaming for natural conversation flow

## 🛠️ Tech Stack

- **Frontend:**
  - HTML5, CSS3, JavaScript (Vanilla)
  - Lucide Icons for beautiful iconography
  - Google Fonts (Outfit, Plus Jakarta Sans)
  - Responsive & Modern UI Design

- **Backend:**
  - Node.js
  - Express.js (v5.2.1)
  - OpenAI API Client (v6.45.0)

- **Environment Management:**
  - dotenv for secure configuration

## 📋 Project Structure

```
Persona/
├── server.js                 # Express server & API routes
├── prompts.js               # AI persona prompts and system messages
├── hitsesh_sir.js           # Hitesh persona configuration
├── piyush_sir.js            # Piyush persona configuration
├── package.json             # Project dependencies
├── public/                  # Frontend assets
│   ├── index.html          # Main HTML file
│   ├── app.js              # Frontend JavaScript logic
│   ├── style.css           # Styling
│   ├── hitesh.jpg          # Hitesh persona avatar
│   └── piyush.jpg          # Piyush persona avatar
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API Key

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/janhvi1508/Persona.git
   cd Persona
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file in the root directory:**

   ```env
   SECRET_KEY=your_openai_api_key_here
   PORT=3000
   ```

   - Get your OpenAI API key from [OpenAI Dashboard](https://platform.openai.com/api-keys)
   - Replace `your_openai_api_key_here` with your actual API key

### Running Locally

```bash
# Start the development server
npm run dev

# Or use
npm start
```

The application will be available at `http://localhost:3000`

## 💬 Usage

1. **Select a Persona**: Click on a character card in the sidebar to choose which AI persona you want to chat with
2. **Type Your Message**: Enter your question or message in the chat input field
3. **Get Responses**: The AI will respond with the personality and knowledge of the selected persona
4. **Switch Characters**: Change personas mid-conversation to get different perspectives
5. **Review History**: Scroll through your conversation history with each character

## 🤖 Available Personas

### Hitesh Sir

- Retired veteran software engineer turned tech educator
- Founder of multiple startups (LCO, Learnyst)
- Creator of popular tech products and platforms
- Runs multiple cohorts on ChaiCode covering Web Development, DevOps, AI, and more
- YouTube channels: [@HiteshCodeLab](https://www.youtube.com/@HiteshCodeLab), [@chaiaurcode](https://www.youtube.com/@chaiaurcode)

### Piyush Sir

- Experienced tech educator and mentor
- Specialized knowledge in various tech domains
- Practical approach to problem-solving

## 🔌 API Endpoints

### POST `/api/chat`

Sends a message to the selected AI persona and receives a response.

**Request Body:**

```json
{
  "character": "hitesh",
  "history": [
    {
      "role": "user",
      "content": "What is the best way to learn web development?"
    }
  ]
}
```

**Response:**

```json
{
  "response": "AI persona's response text here..."
}
```

**Parameters:**

- `character`: String - The selected persona (`"hitesh"` or `"piyush"`)
- `history`: Array - Conversation history with previous messages

## 🔐 Security

- API keys are stored in `.env` file (never commit this file)
- Use environment variables for all sensitive configuration
- Add `.env` to `.gitignore` before pushing to version control

## 📦 Dependencies

```json
{
  "express": "^5.2.1", // Web framework
  "openai": "^6.45.0", // OpenAI API client
  "dotenv": "^17.4.2" // Environment variable management
}
```

## 🎨 Customization

### Adding New Personas

1. Create a new persona configuration file (e.g., `new_persona.js`)
2. Add the system prompt to `prompts.js`
3. Update the frontend character list in `public/index.html`
4. Add the character card and styling
5. Update the backend route handler in `server.js`

### Styling

Modify `public/style.css` to customize:

- Color schemes
- Typography
- Layout and spacing
- Theme variables

## 🐛 Troubleshooting

- **"SECRET_KEY is not defined"**: Make sure your `.env` file exists and contains `SECRET_KEY=your_api_key`
- **Connection errors**: Verify your OpenAI API key is valid and has available credits
- **Frontend not loading**: Ensure `public` folder is in the root directory
- **Port already in use**: Change the `PORT` in `.env` or kill the process using the current port

## For questions or support, reach out through:

- GitHub Issues: [Persona Repository](https://github.com/janhvi1508/Persona)
- Project Website: [https://personai.janhvidev.in/](https://personai.janhvidev.in/)
