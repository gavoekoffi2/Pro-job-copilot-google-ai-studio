import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  ResumeAnalysis,
  JobAnalysis,
  InterviewQuestion,
  AnswerFeedback,
  LinkedInSections,
  LinkedInOptimization,
  SalaryInsights,
  CoverLetterTone,
} from '@/types';

// ─── Client Singleton ────────────────────────────────────────
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

function getModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });
}

// ─── JSON Parser Helper ──────────────────────────────────────
function parseJSON<T>(text: string): T {
  // Try direct parse first
  try {
    return JSON.parse(text) as T;
  } catch {
    // Extract JSON from markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1].trim()) as T;
      } catch {
        // ignore
      }
    }
    // Find raw JSON object/array
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]) as T;
      } catch {
        // ignore
      }
    }
    throw new Error('Could not parse JSON response from AI');
  }
}

// ─── Resume Analyzer ────────────────────────────────────────
export async function analyzeResume(
  resumeText: string,
  jobTitle?: string
): Promise<ResumeAnalysis> {
  const model = getModel();
  const jobContext = jobTitle ? `The candidate is targeting the role: "${jobTitle}".` : '';

  const prompt = `You are an expert resume coach and ATS specialist with 20 years of experience.
Analyze the following resume and provide a comprehensive assessment.
${jobContext}

Resume:
---
${resumeText}
---

Respond ONLY with a valid JSON object (no markdown) following this exact structure:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "strengths": [<3-5 specific strengths>],
  "weaknesses": [<3-5 specific weaknesses>],
  "improvements": [<5-7 actionable improvement suggestions>],
  "missingKeywords": [<5-10 important keywords missing for the target role>],
  "sectionScores": {
    "summary": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>,
    "formatting": <number 0-100>
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<ResumeAnalysis>(text);
  } catch (error) {
    throw new Error(`Resume analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Cover Letter Generator ──────────────────────────────────
export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  companyName: string,
  roleTitle: string,
  tone: CoverLetterTone
): Promise<string> {
  const model = getModel();

  const toneDesc = {
    professional: 'formal and professional, using business language',
    enthusiastic: 'warm, enthusiastic, and passionate about the opportunity',
    concise: 'concise and direct, respecting the reader\'s time (max 300 words)',
  }[tone];

  const prompt = `You are an expert career coach who writes exceptional cover letters.
Write a compelling cover letter for the following application.

Tone: ${toneDesc}
Company: ${companyName}
Role: ${roleTitle}

Candidate's Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

Write a complete, personalized cover letter that:
1. Opens with a compelling hook
2. Connects the candidate's specific experience to the role requirements
3. Shows genuine knowledge of the company (based on the job description)
4. Highlights 2-3 key achievements with metrics if available
5. Closes with a clear call to action

Write ONLY the cover letter text, no additional commentary or explanations. Start with "Dear Hiring Manager," or use the name if provided.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error(`Cover letter generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Job Description Analyzer ───────────────────────────────
export async function analyzeJobDescription(
  jobDescription: string,
  resumeText?: string
): Promise<JobAnalysis> {
  const model = getModel();
  const resumeContext = resumeText
    ? `\nAlso compare against this candidate's resume:\n---\n${resumeText}\n---`
    : '';

  const prompt = `You are an expert job market analyst and career strategist.
Analyze the following job description and extract key insights.${resumeContext}

Job Description:
---
${jobDescription}
---

Respond ONLY with a valid JSON object (no markdown) following this exact structure:
{
  "requiredSkills": [<list of required technical/soft skills>],
  "niceToHaveSkills": [<list of preferred/bonus skills>],
  "experienceLevel": "<Junior/Mid-level/Senior/Lead/Principal>",
  "estimatedSalaryRange": "<salary range estimate based on role and market>",
  "redFlags": [<potential concerns or red flags in the posting, empty array if none>],
  "cultureHints": [<hints about company culture and work environment>],
  ${resumeText ? '"matchScore": <number 0-100 how well the resume matches>,' : ''}
  ${resumeText ? '"missingFromResume": [<skills/experience missing from resume>],' : ''}
  "summary": "<2-3 sentence summary of the role and ideal candidate>"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<JobAnalysis>(text);
  } catch (error) {
    throw new Error(`Job analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Interview Questions Generator ──────────────────────────
export async function getInterviewQuestions(
  role: string,
  level: string,
  companyType: string
): Promise<InterviewQuestion[]> {
  const model = getModel();

  const prompt = `You are an expert interview coach who has conducted thousands of interviews.
Generate 10 interview questions for the following role.

Role: ${role}
Level: ${level}
Company Type: ${companyType}

Return ONLY a valid JSON array (no markdown) of 10 questions with this structure:
[
  {
    "id": "<unique id like q1, q2...>",
    "question": "<the interview question>",
    "type": "<behavioral|technical|situational>",
    "tip": "<a brief tip on how to answer this question well>"
  }
]

Mix question types: include 4 behavioral, 3 technical, and 3 situational questions. Make them specific to the role and level.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<InterviewQuestion[]>(text);
  } catch (error) {
    throw new Error(`Interview questions generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Answer Evaluator ────────────────────────────────────────
export async function evaluateInterviewAnswer(
  question: string,
  answer: string,
  role: string
): Promise<AnswerFeedback> {
  const model = getModel();

  const prompt = `You are an expert interview coach evaluating a candidate's interview answer.

Role being interviewed for: ${role}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer and respond ONLY with a valid JSON object (no markdown):
{
  "score": <number 0-100>,
  "strengths": [<2-3 things done well in the answer>],
  "improvements": [<2-3 specific improvements to make>],
  "sampleAnswer": "<a strong example answer using STAR method if applicable>",
  "overallFeedback": "<1-2 sentence overall assessment>"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<AnswerFeedback>(text);
  } catch (error) {
    throw new Error(`Answer evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── LinkedIn Optimizer ──────────────────────────────────────
export async function optimizeLinkedIn(
  sections: LinkedInSections
): Promise<LinkedInOptimization> {
  const model = getModel();

  const prompt = `You are a LinkedIn optimization expert and personal branding specialist.
Analyze and improve the following LinkedIn profile sections.

Current Profile:
Headline: ${sections.headline}
About: ${sections.about}
Recent Experience: ${sections.experience}
Skills: ${sections.skills}

Respond ONLY with a valid JSON object (no markdown):
{
  "overallScore": <number 0-100>,
  "headline": {
    "improved": "<optimized headline under 220 characters>",
    "explanation": "<why this is better>",
    "score": <number 0-100>
  },
  "about": {
    "improved": "<optimized about section 2-3 paragraphs>",
    "explanation": "<key improvements made>",
    "score": <number 0-100>
  },
  "experience": {
    "improved": "<optimized experience description with bullet points>",
    "explanation": "<improvements made>",
    "score": <number 0-100>
  },
  "skills": {
    "improved": "<optimized skills list with additions>",
    "explanation": "<skills added/reordered and why>",
    "score": <number 0-100>
  },
  "generalTips": [<3-5 general LinkedIn profile tips>]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<LinkedInOptimization>(text);
  } catch (error) {
    throw new Error(`LinkedIn optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Salary Insights ────────────────────────────────────────
export async function getSalaryInsights(
  role: string,
  location: string,
  yearsExperience: number,
  currentOffer?: number,
  companySize?: string
): Promise<SalaryInsights> {
  const model = getModel();

  const offerContext = currentOffer
    ? `The candidate has received an offer of $${currentOffer.toLocaleString()}.`
    : '';
  const companySizeContext = companySize ? `Company size: ${companySize}.` : '';

  const prompt = `You are an expert salary negotiation coach and compensation analyst.
Provide comprehensive salary insights and negotiation guidance.

Role: ${role}
Location: ${location}
Years of Experience: ${yearsExperience}
${offerContext}
${companySizeContext}

Respond ONLY with a valid JSON object (no markdown):
{
  "marketRange": {
    "min": <annual salary minimum number in USD>,
    "median": <annual salary median number in USD>,
    "max": <annual salary maximum number in USD>
  },
  "currency": "USD",
  "negotiationScript": "<a complete negotiation script the candidate can use, 2-3 paragraphs>",
  "talkingPoints": [<5-7 specific talking points to use in negotiation>],
  "emailTemplate": "<a complete email template for negotiating via email>",
  "tips": [<4-5 negotiation strategy tips>]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<SalaryInsights>(text);
  } catch (error) {
    throw new Error(`Salary insights failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Daily Tip ───────────────────────────────────────────────
export async function getDailyTip(context?: string): Promise<string> {
  const model = getModel();

  const prompt = `You are a career coach. Give one specific, actionable career tip for job seekers.
${context ? `Context: The user has been using these tools: ${context}` : ''}
Keep it to 2-3 sentences. Be specific, encouraging, and practical. Do not start with "Tip:" or use bullet points.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return 'Focus on tailoring your resume for each application. Research shows that customized applications get 3x more callbacks than generic ones.';
  }
}
