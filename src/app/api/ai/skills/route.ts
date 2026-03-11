import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkillGap } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, targetPosition, jobDescription } = body;

    if (!resumeText || !targetPosition) {
      return NextResponse.json(
        { error: 'Resume text and target position are required' },
        { status: 400 }
      );
    }

    const result = await analyzeSkillGap(resumeText, targetPosition, jobDescription);

    let parsed;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: result };
    } catch {
      parsed = { raw: result };
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze skills. Please check your API key.' },
      { status: 500 }
    );
  }
}
