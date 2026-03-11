import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'generate') {
      const { company, position, type, resumeText } = body;

      if (!company || !position) {
        return NextResponse.json(
          { error: 'Company and position are required' },
          { status: 400 }
        );
      }

      const result = await generateInterviewQuestions(company, position, type, resumeText);

      let parsed;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: result };
      } catch {
        parsed = { raw: result };
      }

      return NextResponse.json({ success: true, data: parsed });
    }

    if (action === 'evaluate') {
      const { question, answer, position } = body;

      if (!question || !answer) {
        return NextResponse.json(
          { error: 'Question and answer are required' },
          { status: 400 }
        );
      }

      const result = await evaluateInterviewAnswer(question, answer, position);

      let parsed;
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: result };
      } catch {
        parsed = { raw: result };
      }

      return NextResponse.json({ success: true, data: parsed });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "generate" or "evaluate".' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please check your API key.' },
      { status: 500 }
    );
  }
}
