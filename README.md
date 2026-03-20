# 📚 StudyMate — AI-Powered Document Summarizer
 
> Upload any PDF, DOCX, or TXT file and get a smart AI summary instantly. Ask follow-up questions with the built-in Q&A chat.
 
![StudyMate](https://img.shields.io/badge/StudyMate-AI%20Summarizer-4ade80?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
 
---
 
## ✨ Features
 
- 📄 **AI Summaries** — Get short, medium, or detailed summaries from your documents
- 💬 **Q&A Chat** — Ask questions about your uploaded document
- 🌙 **Dark / Light Mode** — Smooth theme toggle
- 📁 **Drag & Drop Upload** — Supports PDF, DOCX, and TXT files
 
---
 
## 🛠 Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React, JavaScript |
| Backend | Node.js, Express |
| AI Model (Summary) | `facebook/bart-large-cnn` via Hugging Face |
| AI Model (Q&A) | `Qwen/Qwen2.5-72B-Instruct` via Hugging Face |
| File Parsing | pdf-parse, mammoth |
| Deployment | Vercel (frontend), Render (backend) |
 
---
 
## 📁 Project Structure
 
```
ai-summarizer/
├── frontend/          # React app
│   └── src/
│       ├── App.js
│       └── App.css
├── backend/           # Node.js + Express API
│   ├── index.js
│   ├── summarize.js
│   ├── health.js
│   └── .env
└── README.md
```
 
---
 
## 🚀 Getting Started (Local)
 
### Prerequisites
- Node.js v18+
- A Hugging Face account & API token
 
---
 
### 1. Clone the repository
 
```bash
git clone https://github.com/mukeshthedev/ai-summarizer.git
cd ai-summarizer
```
 
---
 
### 2. Setup Backend
 
```bash
cd backend
npm install
```
 
Create a `.env` file inside the `backend` folder:
 
```env
HUGGINGFACE_API_KEY=hf_your_token_here
PORT=5000
```
 
> Get your free API token at 👉 https://huggingface.co/settings/tokens
> Make sure to enable **"Make calls to Inference Providers"** permission.
 
Start the backend:
 
```bash
node index.js
```
 
Backend runs at → `http://localhost:5000`
 
---
 
### 3. Setup Frontend
 
Open a new terminal:
 
```bash
cd frontend
npm install
npm start
```
 
Frontend runs at → `http://localhost:3000`
 
<!-- ---
 
## 🌐 Deployment
 
### Backend → Render
 
1. Go to [https://render.com](https://render.com) and sign in with GitHub
2. Click **New → Web Service** → Connect your repo
3. Set the following:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. Add environment variable:
   - `HUGGINGFACE_API_KEY` = your token
5. Click **Deploy**
 
### Frontend → Vercel
 
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project** → Import your repo
3. Set **Root Directory** to `frontend`
4. In `App.js` replace `http://localhost:5000` with your Render backend URL
5. Click **Deploy** -->
 
---
 
## 🔑 Environment Variables
 
| Variable | Description |
|----------|-------------|
| `HUGGINGFACE_API_KEY` | Your Hugging Face API token |
| `PORT` | Backend port (default: 5000) |
 
---
 
## 📖 How to Use
 
1. Open the app in your browser
2. Drag & drop or click to upload a **PDF, DOCX, or TXT** file
3. Choose summary length — **Short, Medium, or Detailed**
4. Click **Summarize** and wait for the AI result
5. Switch to the **Q&A Chat** tab and ask questions about your document
 
---
 
## 👨‍💻 Author
 
**Mukesh** — Frontend Developer 
 
[![GitHub](https://img.shields.io/badge/GitHub-mukeshthedev-181717?style=flat&logo=github)](https://github.com/mukeshthedev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mukeshselvamani-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/mukeshselvamani/)
[![Portfolio](https://img.shields.io/badge/Portfolio-mukeshthedev.vercel.app-4ade80?style=flat)](https://mukeshthedev.vercel.app)
 
---
 
## 📄 License
 
This project is open source and available under the [MIT License](LICENSE).