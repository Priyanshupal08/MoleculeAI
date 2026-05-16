<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🧪 MoleculeStruc: AI-Powered Cheminformatics

MoleculeStruc is a modern web application that leverages the power of Google's Gemini AI to provide deep insights into chemical structures. Built with React and Vite, it acts as your personal medicinal chemist and cheminformatics expert.

## ✨ Key Features

- **🧬 Molecule Identification**: Input any SMILES string to instantly retrieve comprehensive data including common names, clinical status, toxicity risk, and solubility.
- **🔬 Synthesis & Interaction Prediction**: Analyze potential interactions between two compounds to predict resultant properties and clinical synergy.
- **📊 Deep Learning Metrics**: Evaluate binding affinity, metabolic stability, and synthesizability scores.
- **🎨 Interactive Visualizations**: Features molecular drawing and dynamic charts to visualize the chemical data.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Visuals:** Framer Motion (animations), Recharts (data viz), Lucide React (icons)
- **Chemistry Tooling:** SMILES Drawer

## 🚀 Live Demo

**[View Live on Vercel](https://your-vercel-deployment-url.vercel.app/)** 
*(Don't forget to update this link with your actual Vercel URL!)*

## 💻 Run Locally

**Prerequisites:** Node.js

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/MoleculeStruc.git
   cd MoleculeStruc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Add your Gemini API key to the `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---
*Note for Deployment: The API key is currently accessed from the frontend. For production-level security, consider moving the API logic to a backend (like Vercel Serverless Functions) to hide the key from the browser.*
