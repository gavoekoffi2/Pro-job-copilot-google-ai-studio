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
  OutreachContext,
  OutreachEmail,
  JobOffer,
  OfferComparison,
  SkillsGapAnalysis,
} from '@/types';
import type { CVData } from '@/types/cv';

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

// ─── Outreach Email Generator ────────────────────────────────
export async function generateOutreachEmail(
  ctx: OutreachContext
): Promise<OutreachEmail> {
  const model = getModel();

  const typeDescriptions: Record<string, string> = {
    'cold-email': `a cold outreach email to a hiring manager at ${ctx.companyName} for the ${ctx.jobTitle} position. The sender has not applied yet and wants to make a strong first impression.`,
    'linkedin-connect': `a LinkedIn connection request message to ${ctx.recipientName || 'a professional'} at ${ctx.companyName}. Keep it under 300 characters for the note field.`,
    'follow-up': `a follow-up email after applying for the ${ctx.jobTitle} position at ${ctx.companyName}. Polite, concise, showing continued interest.`,
    'thank-you': `a post-interview thank you email to ${ctx.recipientName || 'the interviewer'} at ${ctx.companyName} for the ${ctx.jobTitle} role. Interview date: ${ctx.interviewDate || 'recently'}.`,
    'referral': `a referral request email asking ${ctx.referrerName || 'a contact'} to refer them for the ${ctx.jobTitle} role at ${ctx.companyName}.`,
  };

  const toneDesc: Record<string, string> = {
    professional: 'formal and polished business language',
    friendly: 'warm, personable, and approachable while still professional',
    concise: 'extremely concise and direct — maximum 150 words in the body',
  };

  const prompt = `You are an expert career coach who writes highly effective professional emails that get responses.

Write ${typeDescriptions[ctx.type]}

Sender name: ${ctx.yourName || 'the candidate'}
${ctx.yourBackground ? `Sender background: ${ctx.yourBackground}` : ''}
${ctx.specificInsight ? `Specific insight to mention: ${ctx.specificInsight}` : ''}
Tone: ${toneDesc[ctx.tone]}

Guidelines:
- Make it feel genuinely personal, not templated
- Reference specific details about the company/role to show research
- Include a clear, low-friction call to action
- Do NOT use clichés like "I hope this finds you well" or "I am reaching out to..."

Respond ONLY with a valid JSON object (no markdown):
{
  "subject": "<compelling email subject line>",
  "body": "<the complete email body with proper line breaks using \\n>"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<OutreachEmail>(text);
  } catch (error) {
    throw new Error(`Email generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Job Offer Comparator ─────────────────────────────────────
export async function compareJobOffers(
  offers: JobOffer[]
): Promise<OfferComparison> {
  const model = getModel();

  const offersText = offers.map(o => `
Company: ${o.company}
Role: ${o.role}
Base Salary: $${o.baseSalary.toLocaleString()}
Bonus: ${o.bonus}%
Equity: ${o.equity || 'None'}
Location: ${o.location} (${o.remote})
Benefits: ${o.benefits || 'Not specified'}
Notes: ${o.notes || 'None'}
  `.trim()).join('\n\n---\n\n');

  const companyNames = offers.map(o => o.company);

  const prompt = `You are an expert compensation consultant and career strategist who has helped thousands of professionals evaluate job offers.

Analyze these ${offers.length} job offers and provide a comprehensive comparison:

${offersText}

Respond ONLY with a valid JSON object (no markdown):
{
  "winner": "<company name of the best overall offer>",
  "analyses": {
    ${companyNames.map(name => `"${name}": {
      "financialScore": <0-100>,
      "growthScore": <0-100 career growth potential>,
      "workLifeScore": <0-100 work-life balance>,
      "overallScore": <0-100>,
      "pros": [<3-5 specific pros>],
      "cons": [<2-4 specific cons>],
      "fiveYearComp": <estimated 5-year total compensation as a number>
    }`).join(',\n    ')}
  },
  "recommendation": "<2-3 paragraph nuanced recommendation explaining the winner and key tradeoffs>",
  "questionsToAsk": {
    ${companyNames.map(name => `"${name}": [<3 smart questions to ask this company before deciding>]`).join(',\n    ')}
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<OfferComparison>(text);
  } catch (error) {
    throw new Error(`Offer comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── Skills Gap Analyzer ─────────────────────────────────────
export async function analyzeSkillsGap(
  targetRole: string,
  resumeText?: string,
  jobDescription?: string
): Promise<SkillsGapAnalysis> {
  const model = getModel();

  const resumeSection = resumeText
    ? `\nCandidate's Current Resume:\n---\n${resumeText}\n---`
    : '\n(No resume provided — assess gaps for someone new to this field)';

  const jobSection = jobDescription
    ? `\nTarget Job Description:\n---\n${jobDescription}\n---`
    : '';

  const prompt = `You are a world-class career development coach and skills expert.

Analyze the skills gap for someone targeting: ${targetRole}
${resumeSection}
${jobSection}

Respond ONLY with a valid JSON object (no markdown):
{
  "readinessScore": <0-100, how ready they are for this role right now>,
  "matchingSkills": [<skills from their resume that match the target role, empty array if no resume>],
  "criticalGaps": [
    {
      "skill": "<skill name>",
      "importance": "<critical|important|nice-to-have>",
      "learningPath": "<specific, actionable way to learn this skill>",
      "timeEstimate": "<realistic time to reach proficiency, e.g. '2-4 weeks', '3 months'>",
      "resources": [<2-3 specific learning resources: course names, books, platforms>]
    }
  ],
  "thirtyDayPlan": [<3-4 specific actionable steps for month 1>],
  "sixtyDayPlan": [<3-4 specific actionable steps for month 2>],
  "ninetyDayPlan": [<3-4 specific actionable steps for month 3>],
  "summary": "<2-3 sentence honest assessment of their readiness and main focus areas>"
}

Order criticalGaps by importance (critical first). Include 3-8 gaps total.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return parseJSON<SkillsGapAnalysis>(text);
  } catch (error) {
    throw new Error(`Skills gap analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── CV Photo Import (Vision) ────────────────────────────────
export async function extractCVFromImage(
  imageBase64: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp'
): Promise<Partial<CVData>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert CV/resume parser. Analyze this CV image and extract all information.

Return ONLY a valid JSON object (no markdown) with this exact structure (use empty string "" for missing fields, empty arrays [] for missing lists):
{
  "firstName": "",
  "lastName": "",
  "title": "",
  "email": "",
  "phone": "",
  "location": "",
  "website": "",
  "linkedin": "",
  "github": "",
  "summary": "",
  "experience": [
    {
      "id": "1",
      "company": "",
      "position": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "id": "1",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "honors": ""
    }
  ],
  "skills": [
    {
      "id": "1",
      "category": "",
      "items": []
    }
  ],
  "languages": [
    {
      "language": "",
      "level": "Intermediate"
    }
  ],
  "certifications": [],
  "projects": []
}

Extract EVERYTHING visible in the image. For experience descriptions, extract bullet points as the achievements array. Be thorough and accurate.`;

  try {
    const result = await model.generateContent([
      { inlineData: { mimeType, data: imageBase64 } },
      prompt,
    ]);
    const text = result.response.text();
    return parseJSON<Partial<CVData>>(text);
  } catch (error) {
    throw new Error(`CV extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ─── CV Translator ────────────────────────────────────────────
export async function translateCVContent(
  cv: CVData,
  targetLanguage: string
): Promise<CVData> {
  const model = getModel();

  // Build a text-only representation of all translatable fields
  const translatable = {
    title: cv.title,
    summary: cv.summary,
    experience: cv.experience.map(e => ({
      id: e.id,
      position: e.position,
      description: e.description,
      achievements: e.achievements,
    })),
    education: cv.education.map(e => ({
      id: e.id,
      degree: e.degree,
      field: e.field,
      honors: e.honors || '',
    })),
    skills: cv.skills.map(s => ({
      id: s.id,
      category: s.category,
      items: s.items,
    })),
    certifications: cv.certifications.map(c => ({
      id: c.id,
      name: c.name,
    })),
    projects: cv.projects.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
    })),
  };

  const prompt = `You are a professional CV translator. Translate the following CV content to ${targetLanguage}.

IMPORTANT rules:
- Translate ONLY the text content, never the JSON keys
- Do NOT translate: company names, institution names, tool/technology names (React, Python, etc.), URLs, email addresses, phone numbers, dates
- DO translate: job titles, descriptions, achievements, skill categories, degree fields, summaries, project names/descriptions
- Maintain professional language appropriate for a CV
- Keep the exact same JSON structure

Input JSON:
${JSON.stringify(translatable, null, 2)}

Return ONLY the translated JSON with the exact same structure (no markdown, no explanation).`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const translated = parseJSON<typeof translatable>(text);

    // Merge translated fields back into original CV data
    const merged: CVData = {
      ...cv,
      title: translated.title,
      summary: translated.summary,
      experience: cv.experience.map(e => {
        const t = translated.experience.find(te => te.id === e.id);
        return t ? { ...e, position: t.position, description: t.description, achievements: t.achievements } : e;
      }),
      education: cv.education.map(e => {
        const t = translated.education.find(te => te.id === e.id);
        return t ? { ...e, degree: t.degree, field: t.field, honors: t.honors || e.honors } : e;
      }),
      skills: cv.skills.map(s => {
        const t = translated.skills.find(ts => ts.id === s.id);
        return t ? { ...s, category: t.category, items: t.items } : s;
      }),
      certifications: cv.certifications.map(c => {
        const t = translated.certifications.find(tc => tc.id === c.id);
        return t ? { ...c, name: t.name } : c;
      }),
      projects: cv.projects.map(p => {
        const t = translated.projects.find(tp => tp.id === p.id);
        return t ? { ...p, name: t.name, description: t.description } : p;
      }),
    };

    return merged;
  } catch (error) {
    throw new Error(`CV translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
