import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/userModel.js";

// @desc    Generate personalized cover letter
// @route   POST /api/ai/cover-letter
// @access  Private
export const generateCoverLetter = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { company, role, jobDescription } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const prompt = `
      You are an expert career coach and professional resume writer.
      Write a tailored, professional, and highly engaging cover letter for the following job application.

      Applicant Information:
      - Name: ${user.name}
      - Target Role: ${user.role}
      - Professional Bio: ${user.bio}
      - Core Skills: ${user.skills}

      Job Applying For:
      - Company: ${company}
      - Position: ${role}
      - Additional Details: ${jobDescription || "Not provided. Keep it focused on the core role."}

      Instructions:
      - The tone should be confident, professional, and enthusiastic.
      - Do not use generic buzzwords. Speak specifically about the applicant's skills.
      - Keep it to 3 or 4 concise paragraphs.
      - Do not include placeholder brackets like [Your Address] at the top. Just write the main body of the letter.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ coverLetter: text });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: "Failed to generate cover letter." });
  }
};

// @desc    Calculate ATS Resume Score
// @route   POST /api/ai/ats-score
// @access  Private
export const calculateAtsScore = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { company, role, jobDescription } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const prompt = `
      You are a strict and highly accurate Applicant Tracking System (ATS). 
      Analyze the applicant's profile against the job they are applying for.
      
      Applicant Profile:
      - Target Role: ${user.role}
      - Bio: ${user.bio}
      - Skills: ${user.skills}

      Job Details:
      - Company: ${company}
      - Position: ${role}
      - Description: ${jobDescription || "Standard industry requirements for this role."}

      Evaluate the match and return ONLY a raw JSON object with the following exact keys. Do not include markdown formatting, backticks, or the word "json" in your response. Just the raw object:
      {
        "matchPercentage": (a number between 0 and 100 based on how well the skills align),
        "missingKeywords": (an array of 3 to 5 important skills or keywords the applicant is missing for this specific role),
        "feedback": (A one-sentence piece of harsh but constructive advice on how to improve their chances)
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the text just in case Gemini accidentally adds markdown block formatting
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse the string into an actual JavaScript object
    const parsedData = JSON.parse(text);

    res.status(200).json(parsedData);

  } catch (error) {
    console.error("ATS Scoring Error:", error);
    res.status(500).json({ message: "Failed to calculate ATS score. Ensure profile is complete." });
  }
};