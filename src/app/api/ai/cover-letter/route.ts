import { NextRequest, NextResponse } from 'next/server';
import { generateCoverLetter } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, position, resumeText, jobDescription, tone } = body;

    if (!company || !position) {
      return NextResponse.json(
        { error: 'Company and position are required' },
        { status: 400 }
      );
    }

    const result = await generateCoverLetter(
      company,
      position,
      resumeText || '',
      jobDescription,
      tone
    );

    let parsed;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: result };
    } catch {
      parsed = { raw: result };
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter. Please check your API key.' },
      { status: 500 }
    );
  }
}
