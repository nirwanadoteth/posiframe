# PosiFrame - Farcaster Positive Reframing Tool

**Turn Negativity Into Positivity with AI-Powered Language Transformation**

PosiFrame is a Farcaster Mini App that helps users transform negative or hostile language into positive, constructive communication using AI-powered sentiment analysis and reframing.

## 🎯 Research Scope (Batasan Masalah)

This application was developed with specific research constraints:

### 1. **Platform Scope**

- **Exclusive to Farcaster**: This system is designed specifically for the Farcaster social platform ecosystem
- **Post Creation Focus**: Covers interaction through post/cast creation only
- **Not included**: Other social media platforms (Instagram, TikTok, YouTube, Facebook)

### 2. **Input Processing**

- **Text-only**: Processes text input in **English and Indonesian** languages only
- **No multimedia**: Does not process or moderate images, audio, or video content

### 3. **AI Technology Approach**

- **Third-party LLM API**: Uses Google Gemini API via third-party service
- **Prompt Engineering**: Focuses on prompt engineering optimization for reframing results
- **No fine-tuning**: Does not include fine-tuning or training LLM models from scratch

### 4. **API Key Management**

- **BYOK (Bring Your Own Key)**: Users must configure their own API keys
- **Client-side Configuration**: API keys are set up directly in the app interface
- **Encrypted Storage**: Keys are encrypted and stored locally in the browser

### 5. **Reframing Strategy**

- **Positive Rephrasing**: Focuses on transforming negative tone into constructive communication
- **Preserves Core Meaning**: Does not change the fundamental message intent
- **Empathetic Language**: Emphasizes empathy and professional communication

### 6. **Functional Features**

Based on user needs survey, features are limited to:

- ✅ **Text Input**: Draft messages in English or Indonesian
- ✅ **Automatic Reframing**: AI-powered reframing using Gemini
- ✅ **Simple Sentiment Statistics**: Track analysis history (total, negative, positive)
- ✅ **Direct Publish to Farcaster**: One-click publish to Farcaster feed

---

## 🚀 Features

### 1. **Bilingual Sentiment Analysis**

- Detects sentiment in both **English** and **Indonesian**
- Identifies negative, aggressive, passive-aggressive, or neutral tones
- Provides reasoning for detected sentiment

### 2. **AI-Powered Positive Reframing**

- Transforms negative language into constructive alternatives
- Maintains the core message while improving emotional tone
- Uses Google Gemini 2.5 Flash model for fast, accurate results
- Response in the same language as input

### 3. **Simple Statistics Dashboard**

- **Total Analyses**: Count of all sentiment analyses performed
- **Negative Detected**: Number of texts with negative sentiment
- **Already Positive**: Number of texts with positive sentiment
- Persistent statistics stored locally in browser

### 4. **Direct Farcaster Integration**

- Compose casts directly from the app
- One-click "Publish to Farcaster" button
- "Use & Publish" feature to apply suggestion and publish immediately
- Seamless integration with Farcaster composer

### 5. **Secure API Key Management (BYOK)**

- Bring Your Own Key approach
- Client-side encryption using Web Crypto API
- Keys stored securely in browser localStorage
- No server-side key storage

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, React 19.2, Turbopack)
- **UI Components**: Shadcn/ui, Radix UI, Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash via `@google/genai`
- **Farcaster Integration**: `@farcaster/miniapp-sdk`
- **Type Safety**: TypeScript, Zod for schema validation
- **Code Quality**: Ultracite (Biome) for linting and formatting

---

## 📋 Prerequisites

- Node.js 20+ and npm
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Farcaster account (for publishing casts)

---

## 🏃 Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd posiframe
npm install
\`\`\`

### 2. Configure Environment Variables (Optional)

Create a \`.env.local\` file:

\`\`\`env
NEXT_PUBLIC_URL=<http://localhost:3000>

# Farcaster Manifest Signing (for production deployment)

FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### 4. Configure Your API Key

1. Enter your Google Gemini API key when prompted
2. The key will be encrypted and stored locally
3. You can clear and reconfigure the key anytime

---

## 📱 How to Use

### Step 1: Configure API Key

- On first launch, enter your Google Gemini API key
- Get a free key at: <https://aistudio.google.com/app/apikey>
- The key is encrypted and stored locally on your device

### Step 2: Draft Your Message

- Type your message in English or Indonesian
- The textarea accepts any text input

### Step 3: Analyze & Refine

- Click "Analyze & Refine" to process your text
- View sentiment analysis results:
  - **Sentiment**: Brief description of detected tone
  - **Reasoning**: Analysis of underlying message
  - **Suggestion**: Positive reframe of your text

### Step 4: Choose Your Action

- **Keep Original**: Discard suggestion and keep your text
- **Use Suggestion**: Replace your text with the positive version
- **Publish to Farcaster**: Publish current text directly (requires Farcaster)
- **Use & Publish**: Apply suggestion and publish immediately

### Step 5: Track Your Progress

- View statistics at the top:
  - Total analyses performed
  - Negative sentiments detected
  - Already positive messages

---

## 🔐 Security & Privacy

### API Key Storage

- Keys are encrypted using AES-GCM with a device-specific encryption key
- Stored locally in browser's localStorage
- Never transmitted to any server except Google's Gemini API
- Can be cleared at any time

### Data Processing

- Text is sent only to Google Gemini API for analysis
- No text is stored on any server
- Statistics are stored locally in your browser
- Complete data privacy and control

---

## 📊 Research Application

This application demonstrates:

1. **Prompt Engineering**: Optimized prompts for bilingual sentiment analysis
2. **Positive Rephrasing**: AI-powered language transformation strategies
3. **BYOK Architecture**: User-controlled API key management
4. **Mini App Integration**: Seamless Farcaster platform integration
5. **Bilingual NLP**: English and Indonesian language processing

---

## 🎨 Code Quality

The project follows strict code quality standards using **Ultracite**:

\`\`\`bash

# Check for issues

npm run check

# Auto-fix formatting and linting

npm run fix
\`\`\`

Standards enforced:

- Type safety with TypeScript
- Accessible React components
- Modern JavaScript/TypeScript patterns
- Proper error handling
- Semantic HTML

---

## 🚢 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables (optional)
4. Deploy

### Farcaster Manifest

For production deployment as a Farcaster Mini App:

1. Sign your manifest at: <https://farcaster.xyz/~/developers/mini-apps/manifest>
2. Add signed values to environment variables:
   - \`FARCASTER_HEADER\`
   - \`FARCASTER_PAYLOAD\`
   - \`FARCASTER_SIGNATURE\`
3. Ensure \`.well-known/farcaster.json\` is accessible

Refer to [Farcaster Mini Apps Documentation](https://miniapps.farcaster.xyz/docs/guides/publishing)

---

## 📖 Learn More

### Farcaster Development

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/)
- [Farcaster SDK Reference](https://miniapps.farcaster.xyz/docs/sdk/actions)
- [Publishing Guide](https://miniapps.farcaster.xyz/docs/guides/publishing)

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Documentation](https://react.dev/)

### AI & NLP

- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

---

## 🤝 Contributing

This is a research project. For questions or contributions, please follow standard GitHub workflow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

---

## 📄 License

This project is developed for research purposes.

---

## 🙏 Acknowledgments

- **Farcaster Team** for the Mini Apps platform
- **Google** for Gemini API
- **Vercel** for Next.js and hosting platform
- Research participants for user needs survey

---

**Made with ❤️ for positive communication on Farcaster**
