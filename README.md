# 📸 Virtual Food Photographer

An AI-powered web application that transforms restaurant menus into stunning, professional food photographs using Google's Gemini AI and Imagen models.

## ✨ Features

- **Menu Parsing**: Automatically parses restaurant menu text into structured dishes using Gemini AI
- **AI Image Generation**: Creates photorealistic food images using Imagen 4.0 <img width="887" height="695" alt="image" src="https://github.com/user-attachments/assets/dd012cb3-5729-44af-80cf-d58fec2d9473" />

- **Multiple Photography Styles**: Choose from various professional photography styles (Natural Light, Moody & Atmospheric, Bright & Airy, etc.)
- **Image Editing**: Edit generated images with text prompts using Gemini's vision capabilities <img width="887" height="695" alt="image" src="https://github.com/user-attachments/assets/5fd86ece-657b-4e2e-ab2d-42b4eee5079a" />

- **Social Media Captions**: Generate engaging Instagram captions for your dishes
- **Sample Menu Generator**: Get AI-generated sample menus to try the app

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **AI Models**: 
  - Google Gemini 2.5 Flash (text generation & image editing)
  - Google Imagen 4.0 (image generation)
- **Styling**: CSS with modern UI components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.19.0 or higher, or >= 22.12.0)
- **npm** (comes with Node.js)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Virtual-Food-Photographer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add your Gemini API key to the `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Important**: Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

## 📦 Available Scripts

- **`npm run dev`** - Start the development server
- **`npm run build`** - Build the production bundle
- **`npm run preview`** - Preview the production build locally

## 🌐 Deployment

### Deploy to Netlify

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   netlify deploy --prod --build
   ```

3. **Set Environment Variables** in Netlify:
   - Go to your Netlify dashboard
   - Navigate to: `Site Settings > Environment Variables`
   - Add `GEMINI_API_KEY` with your API key
   - Redeploy the site

> 📝 **Note**: The `netlify.toml` configuration file is already set up for deployment.

## 🎯 How to Use

1. **Enter a Menu**: Paste your restaurant menu text or generate a sample menu
2. **Choose a Style**: Select your preferred photography style
3. **Generate Photos**: Click "Generate All Photos" to create images for all dishes
4. **Edit Images**: Use the edit feature to refine images with text prompts
5. **Generate Captions**: Create engaging social media captions for your dishes
6. **Download**: Save your generated images

## 🔑 API Key Setup

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

### API Usage Notes

- The app uses both Gemini and Imagen models
- Ensure your API key has access to:
  - `gemini-2.5-flash` (text generation)
  - `gemini-2.5-flash-image` (image editing)
  - `imagen-4.0-generate-001` (image generation)

## 🐛 Troubleshooting

### Common Issues

**"API_KEY environment variable not set"**
- Ensure `.env.local` exists in the project root
- Verify `GEMINI_API_KEY` is correctly set
- Restart the development server after adding the key

**Build fails with engine warnings**
- Update Node.js to version 20.19.0+ or 22.12.0+

**Images fail to generate**
- Check your API key is valid and has sufficient quota
- Ensure you have access to the Imagen API

## 📄 License

This project is available for use under standard open source practices.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Google Gemini AI & Imagen
