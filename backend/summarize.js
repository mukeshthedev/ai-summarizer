const axios = require("axios");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
 
const HuggingFaceToken = process.env.HUGGINGFACE_API_KEY;
const upload = multer({ dest: "uploads/" });
 
const summarize = async (text, type = "medium") => {
  if (!HuggingFaceToken)
    return { status: 400, message: "Invalid Hugging Face token" };
 
  const lengthSettings = {
    short: { min_length: 50, max_length: 150 },
    medium: { min_length: 150, max_length: 400 },
    detailed: { min_length: 400, max_length: 800 },
  };
 
  const { min_length, max_length } =
    lengthSettings[type] || lengthSettings.medium;
 
  try {
    const maxTokens = 1024;
    if (text.length > maxTokens) {
      text = text.substring(0, maxTokens);
    }
 
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        inputs: text,
        parameters: { min_length, max_length, truncation: true },
      },
      { headers: { Authorization: `Bearer ${HuggingFaceToken}` } }
    );
 
    if (!response.data || !response.data[0] || !response.data[0].summary_text) {
      return { status: 500, message: "Summarization failed, try again later." };
    }
 
    return { status: 200, message: response.data[0].summary_text };
 
  } catch (error) {
    console.error("Hugging Face API Error:", error.response?.data || error.message);
    return {
      status: 500,
      message: "Summarization service is currently unavailable.",
    };
  }
};
 
const answerQuestion = async (question) => {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "Qwen/Qwen2.5-72B-Instruct:fastest",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Answer clearly and concisely.",
          },
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 300,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${HuggingFaceToken}`,
          "Content-Type": "application/json",
        },
      }
    );
 
    const answer = response.data?.choices?.[0]?.message?.content?.trim();
 
    if (!answer) {
      return { status: 400, message: "Could not find an answer." };
    }
 
    return { status: 200, answer };
 
  } catch (error) {
    console.error("Hugging Face API Error:", error.response?.data || error.message);
    return { status: 500, message: "Failed to process the question." };
  }
};
 
module.exports = { summarize, answerQuestion };
 