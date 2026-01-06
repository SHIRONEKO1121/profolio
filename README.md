# 🎨 Portfolio Website

> A modern, interactive personal portfolio website built with React, TypeScript, and Vite. Features AI-powered chatbot, interactive games, travel map, music player, and more.

## ✨ Features

- 🤖 **AI Chatbot** - DeepSeek-powered conversational AI with knowledge base integration
- 🎮 **Interactive Games** - Dino game, Pixel Art, Piano, and more
- 🌍 **Travel Map** - 3D interactive globe showing visited countries
- 🎵 **Music Player** - Built-in audio player with multiple tracks
- 📸 **Gallery** - Beautiful photo gallery with lightbox modal
- 🌙 **Dark Mode** - Automatic dark mode (7 PM - 6 AM)
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ⚡ **Fast Performance** - Vite bundler for optimized builds
- **More Coming...**

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Bundler**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Maps**: D3-Geo + TopoJSON
- **AI**: DeepSeek API
- **Icons**: Lucide React
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm (v11 or higher)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/SHIRONEKO1121/profolio.git
cd profolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_deepseek_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## 🏗️ Project Structure

```
portfolio/
├── components/              # React components
│   ├── AIChat.tsx          # AI chatbot component
│   ├── DinoGame.tsx        # Dino game
│   ├── Gallery.tsx         # Photo gallery
│   ├── TravelMap.tsx       # 3D travel map
│   ├── MusicPlayer.tsx     # Audio player
│   ├── Piano.tsx           # Piano game
│   └── ...
├── public/                  # Static assets
│   ├── Music/              # Audio files
│   ├── gallery/            # Gallery images
│   └── icon/               # Icons and images
├── App.tsx                 # Main app component
├── constants.tsx           # Global constants & config
├── knowledge.ts            # AI knowledge base
├── types.ts                # TypeScript types
└── vite.config.ts          # Vite configuration
```

## 📦 Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files ready for deployment.

## 🌐 Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Sign in with GitHub account
4. Click "Add New" → "Project"
5. Select your `profolio` repository
6. Vercel automatically detects the configuration
7. Click "Deploy"
8. Your site is live! 🎉

### Option 2: Manual Deployment

Upload the `dist/` folder to your hosting provider:
- Virtual host (shared hosting)
- Cloud server (AWS, Aliyun, Tencent Cloud, etc.)
- Any static file hosting service

## 🔧 Configuration

### Dark Mode

Dark mode activates automatically between 7 PM and 6 AM based on device time. Edit `App.tsx` to customize:

```typescript
const calculateDarkMode = () => {
  const hour = now.getHours();
  const shouldBeDark = hour >= 19 || hour < 6;
  setIsDarkMode(shouldBeDark);
};
```

### Chat Background

Edit the chat background image in `constants.tsx`:

```typescript
chatBackground: 'https://your-image-url.com/image.png'
```

### Gallery Images

Add or modify gallery images in `constants.tsx`:

```typescript
GALLERY_IMAGES: [
  '/gallery/your-image.jpg',
  // ...
]
```

### Travelled Countries

Update the world map in `constants.tsx`:

```typescript
TRAVELLED_COUNTRIES: [
  { name: 'China', lng: 104.065, lat: 35.861 },
  // ...
]
```

## 📱 Features Breakdown

### AI Chat
- Powered by DeepSeek API
- Markdown formatting support
- Scrollable message history
- Integration with knowledge base system

### Games
- **Dino Game**: Jump and dodge obstacles
- **Pixel Art**: Drawing canvas
- **Piano**: Interactive keyboard

### Music Player
- Play/pause controls
- Multiple tracks support
- Volume control
- Local audio files

### Travel Map
- 3D interactive globe
- Drag and rotate
- Scroll to zoom
- Visited countries highlighted

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | DeepSeek API key for AI chat |

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**SHIRONEKO1121**

- GitHub: [@SHIRONEKO1121](https://github.com/SHIRONEKO1121)
- Email: lucas20041121@gmail.com

## 🙏 Acknowledgments

- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [D3.js](https://d3js.org)
- [DeepSeek API](https://deepseek.com)

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/SHIRONEKO1121/profolio/issues) on GitHub.
