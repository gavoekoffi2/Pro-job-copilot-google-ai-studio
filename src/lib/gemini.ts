import { GoogleGenerativeAI } from '@google/generative-ai';

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function generateWithGemini(prompt: string): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function optimizeResume(
  resumeText: string,
  jobDescription?: string
): Promise<string> {
  const prompt = `You are an expert resume writer and career coach. Analyze and optimize the following resume.
${jobDescription ? `\nTarget Job Description:\n${jobDescription}\n` : ''}
Resume Content:
${resumeText}

Please provide:
1. An optimized version of the resume with improved bullet points using the STAR method
2. Better action verbs and quantified achievements
3. ATS-friendly keyword optimization${jobDescription ? ' tailored to the job description' : ''}
4. A score out of 100 for the resume
5. Top 5 specific suggestions for improvement

Format your response as JSON:
{
  "optimizedResume": "the full optimized resume text",
  "score": 85,
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "summary": "brief summary of changes made"
}`;

  return generateWithGemini(prompt);
}

export async function generateCoverLetter(
  company: string,
  position: string,
  resumeText: string,
  jobDescription?: string,
  tone?: string
): Promise<string> {
  const prompt = `You are an expert cover letter writer. Generate a compelling, personalized cover letter.

Company: ${company}
Position: ${position}
Tone: ${tone || 'professional yet personable'}
${jobDescription ? `\nJob Description:\n${jobDescription}\n` : ''}
Candidate Resume:
${resumeText}

Write a cover letter that:
1. Opens with a compelling hook that shows genuine interest
2. Highlights 2-3 most relevant achievements from the resume
3. Demonstrates knowledge of the company
4. Shows cultural fit and enthusiasm
5. Ends with a confident call to action
6. Is between 250-400 words

Format your response as JSON:
{
  "coverLetter": "the full cover letter text",
  "keyPoints": ["point 1", "point 2", ...],
  "customizationTips": ["tip 1", "tip 2", ...]
}`;

  return generateWithGemini(prompt);
}

export async function generateInterviewQuestions(
  company: string,
  position: string,
  type: 'behavioral' | 'technical' | 'mixed',
  resumeText?: string
): Promise<string> {
  const prompt = `You are an expert interview coach. Generate interview preparation questions.

Company: ${company}
Position: ${position}
Interview Type: ${type}
${resumeText ? `\nCandidate Resume:\n${resumeText}\n` : ''}

Generate 8 interview questions with:
1. A mix of difficulties (easy, medium, hard)
2. Category labels (behavioral, technical, situational, company)
3. Suggested answer frameworks using the STAR method
4. Key points to hit in the answer

Format your response as JSON:
{
  "questions": [
    {
      "question": "the question",
      "category": "behavioral",
      "difficulty": "medium",
      "suggestedAnswer": "A detailed suggested answer framework",
      "keyPoints": ["point 1", "point 2"]
    }
  ],
  "generalTips": ["tip 1", "tip 2", ...]
}`;

  return generateWithGemini(prompt);
}

export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  position: string
): Promise<string> {
  const prompt = `You are an expert interview coach. Evaluate this interview answer.

Position: ${position}
Question: ${question}
Candidate's Answer: ${answer}

Provide:
1. A score out of 10
2. Specific strengths in the answer
3. Areas for improvement
4. A model answer for comparison

Format as JSON:
{
  "score": 8,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "modelAnswer": "An ideal answer to this question",
  "overallFeedback": "Brief overall feedback"
}`;

  return generateWithGemini(prompt);
}

export async function analyzeSkillGap(
  resumeText: string,
  targetPosition: string,
  jobDescription?: string
): Promise<string> {
  const prompt = `You are a career development expert. Analyze the skill gap between this candidate and their target role.

Target Position: ${targetPosition}
${jobDescription ? `\nJob Description:\n${jobDescription}\n` : ''}
Candidate Resume:
${resumeText}

Provide:
1. Skills the candidate already has that match
2. Skills that need development
3. Recommended learning resources for each gap
4. Estimated time to close each gap
5. Priority ranking of skills to develop

Format as JSON:
{
  "matchingSkills": [{"skill": "name", "level": "strong/moderate/basic"}],
  "skillGaps": [{"skill": "name", "priority": "high/medium/low", "estimatedTime": "2-3 months", "resources": ["resource 1"]}],
  "overallMatch": 75,
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

  return generateWithGemini(prompt);
}
