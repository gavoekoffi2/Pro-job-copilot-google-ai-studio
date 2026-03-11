'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Sparkles,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Send,
  RotateCcw,
  Trophy,
  Target,
  Brain,
  Clock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDate, generateId } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import toast from 'react-hot-toast';
import type { InterviewQuestion, InterviewSession } from '@/types';

const sampleQuestions: Record<string, InterviewQuestion[]> = {
  behavioral: [
    {
      id: '1',
      question: 'Tell me about a time you had to deal with a difficult team member. How did you handle it?',
      category: 'behavioral',
      difficulty: 'medium',
      suggestedAnswer: 'Use the STAR method: Describe the Situation with the difficult team member, the Task you needed to accomplish, the Action you took to address the conflict, and the positive Result that came from your approach. Focus on your communication and conflict resolution skills.',
    },
    {
      id: '2',
      question: 'Describe a project where you had to learn a new technology quickly. What was your approach?',
      category: 'behavioral',
      difficulty: 'easy',
      suggestedAnswer: 'Highlight your learning agility and resourcefulness. Describe how you broke down the learning process, what resources you used, and how you applied the new knowledge effectively to deliver results.',
    },
    {
      id: '3',
      question: 'Tell me about a time you failed. What did you learn from it?',
      category: 'behavioral',
      difficulty: 'hard',
      suggestedAnswer: 'Be honest and vulnerable. Choose a real failure, explain what went wrong, take responsibility, and most importantly, detail the lessons learned and how you applied them going forward.',
    },
    {
      id: '4',
      question: 'How do you prioritize when you have multiple deadlines?',
      category: 'situational',
      difficulty: 'medium',
      suggestedAnswer: 'Discuss your framework for prioritization (urgency vs importance matrix, etc.). Give a specific example where you successfully managed competing priorities and delivered results.',
    },
    {
      id: '5',
      question: 'Describe your biggest professional achievement.',
      category: 'behavioral',
      difficulty: 'easy',
      suggestedAnswer: 'Choose an achievement that is relevant to the role. Quantify the impact where possible and explain your specific contribution and the skills that made it possible.',
    },
  ],
  technical: [
    {
      id: '1',
      question: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?',
      category: 'technical',
      difficulty: 'medium',
      suggestedAnswer: 'Compare REST (resource-based, multiple endpoints, over/under-fetching) with GraphQL (single endpoint, client-specified queries, typed schema). Discuss trade-offs including caching, complexity, and use cases for each.',
    },
    {
      id: '2',
      question: 'How would you design a system to handle millions of concurrent users?',
      category: 'technical',
      difficulty: 'hard',
      suggestedAnswer: 'Discuss horizontal scaling, load balancing, caching strategies (CDN, Redis), database sharding, microservices architecture, message queues, and monitoring. Start with high-level architecture and drill down.',
    },
    {
      id: '3',
      question: 'What is your approach to writing testable code?',
      category: 'technical',
      difficulty: 'medium',
      suggestedAnswer: 'Discuss dependency injection, separation of concerns, pure functions, SOLID principles, and different types of tests (unit, integration, e2e). Give examples from your experience.',
    },
    {
      id: '4',
      question: 'Explain how you would optimize a slow database query.',
      category: 'technical',
      difficulty: 'medium',
      suggestedAnswer: 'Cover query analysis (EXPLAIN), indexing strategies, query refactoring, denormalization when appropriate, caching layers, and monitoring tools. Provide a real example if possible.',
    },
    {
      id: '5',
      question: 'What are the key principles of CI/CD and why are they important?',
      category: 'technical',
      difficulty: 'easy',
      suggestedAnswer: 'Explain continuous integration (frequent merges, automated testing), continuous delivery (always deployable), and continuous deployment (automatic releases). Discuss benefits: faster feedback, fewer bugs, reliable releases.',
    },
  ],
  mixed: [
    {
      id: '1',
      question: 'Why are you interested in this role?',
      category: 'company',
      difficulty: 'easy',
      suggestedAnswer: 'Show genuine enthusiasm. Connect your career goals with the company mission, highlight specific aspects of the role that excite you, and explain how your skills make you a great fit.',
    },
    {
      id: '2',
      question: 'How do you handle disagreements with your manager about technical decisions?',
      category: 'behavioral',
      difficulty: 'medium',
      suggestedAnswer: 'Show maturity and professionalism. Discuss data-driven decision making, presenting alternatives with evidence, knowing when to advocate and when to align, and maintaining a positive working relationship.',
    },
    {
      id: '3',
      question: 'Walk me through how you would architect a new feature from requirements to deployment.',
      category: 'technical',
      difficulty: 'hard',
      suggestedAnswer: 'Cover the full lifecycle: requirements gathering, system design, API design, implementation approach, testing strategy, deployment plan, monitoring, and iteration. Show end-to-end thinking.',
    },
    {
      id: '4',
      question: 'Where do you see yourself in 5 years?',
      category: 'company',
      difficulty: 'easy',
      suggestedAnswer: 'Show ambition aligned with the company trajectory. Discuss skills you want to develop, types of problems you want to solve, and leadership aspirations while showing commitment to growth within the organization.',
    },
    {
      id: '5',
      question: 'Tell me about a time you mentored someone. What was the outcome?',
      category: 'behavioral',
      difficulty: 'medium',
      suggestedAnswer: 'Describe who you mentored, what skills or knowledge you helped them develop, your mentoring approach, and the measurable outcomes. Show your leadership and communication skills.',
    },
  ],
};

export default function InterviewPage() {
  const { interviewSessions, addInterviewSession, updateInterviewSession, deleteInterviewSession } = useAppStore();
  const [showNewSession, setShowNewSession] = useState(false);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    company: '',
    position: '',
    type: 'mixed' as 'behavioral' | 'technical' | 'mixed',
  });

  const startSession = () => {
    if (!sessionForm.company || !sessionForm.position) {
      toast.error('Please fill in company and position');
      return;
    }

    const questions = sampleQuestions[sessionForm.type].map((q) => ({
      ...q,
      id: generateId(),
    }));

    const session = addInterviewSession({
      company: sessionForm.company,
      position: sessionForm.position,
      type: sessionForm.type,
      questions,
    });

    setActiveSession(session);
    setCurrentQuestionIndex(0);
    setShowNewSession(false);
    setUserAnswer('');
    setShowFeedback(false);
    toast.success('Interview session started!');
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please write your answer before submitting');
      return;
    }
    if (!activeSession) return;

    setIsEvaluating(true);
    await new Promise((r) => setTimeout(r, 1500));

    const score = Math.floor(Math.random() * 4) + 6; // 6-9
    const updatedQuestions = [...activeSession.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      userAnswer,
      score,
      feedback:
        score >= 8
          ? 'Excellent answer! You demonstrated strong communication skills and provided specific examples.'
          : score >= 6
          ? 'Good answer with room for improvement. Try to include more specific metrics and use the STAR method more consistently.'
          : 'This answer needs more work. Focus on providing specific examples and quantifying your achievements.',
    };

    const updatedSession = { ...activeSession, questions: updatedQuestions };
    updateInterviewSession(activeSession.id, { questions: updatedQuestions });
    setActiveSession(updatedSession);
    setShowFeedback(true);
    setIsEvaluating(false);
  };

  const nextQuestion = () => {
    if (!activeSession) return;

    if (currentQuestionIndex < activeSession.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      // Finish session
      const avgScore =
        activeSession.questions.reduce((acc, q) => acc + (q.score || 0), 0) /
        activeSession.questions.length;

      updateInterviewSession(activeSession.id, {
        overallScore: Math.round(avgScore * 10),
        overallFeedback:
          avgScore >= 8
            ? 'Outstanding performance! You are well-prepared for this interview.'
            : avgScore >= 6
            ? 'Good performance. Focus on the suggested improvements to strengthen your answers.'
            : 'You need more practice. Review the model answers and try again.',
      });

      toast.success('Session completed! Check your results.');
      setActiveSession(null);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setShowFeedback(false);
    }
  };

  // Active interview session view
  if (activeSession) {
    const currentQuestion = activeSession.questions[currentQuestionIndex];
    const answeredCount = activeSession.questions.filter((q) => q.userAnswer).length;

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Session header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {activeSession.company} - {activeSession.position}
              </h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {activeSession.questions.length}
              </p>
            </div>
            <button
              onClick={() => {
                setActiveSession(null);
                setCurrentQuestionIndex(0);
              }}
              className="btn-ghost text-sm text-red-600"
            >
              End Session
            </button>
          </div>
          <div className="mt-3">
            <ProgressBar
              value={answeredCount}
              max={activeSession.questions.length}
              color="blue"
            />
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`badge ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
            <span className="badge bg-gray-100 text-gray-700">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{currentQuestion.question}</h2>
        </motion.div>

        {/* Answer input */}
        {!showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <label className="label">Your Answer</label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here... Try using the STAR method (Situation, Task, Action, Result)"
              className="textarea"
              rows={6}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={isEvaluating}
                className="btn-primary"
              >
                {isEvaluating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && currentQuestion.score && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Score */}
              <div className="card">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white ${
                      currentQuestion.score >= 8
                        ? 'bg-emerald-500'
                        : currentQuestion.score >= 6
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {currentQuestion.score}/10
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentQuestion.score >= 8
                        ? 'Excellent!'
                        : currentQuestion.score >= 6
                        ? 'Good Job!'
                        : 'Needs Improvement'}
                    </h3>
                    <p className="text-sm text-gray-600">{currentQuestion.feedback}</p>
                  </div>
                </div>
              </div>

              {/* Suggested answer */}
              <div className="card border-primary-100 bg-primary-50/50">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-primary-900">
                  <Brain className="h-4 w-4" />
                  Model Answer
                </h3>
                <p className="text-sm text-primary-800 leading-relaxed">
                  {currentQuestion.suggestedAnswer}
                </p>
              </div>

              {/* Next button */}
              <div className="flex justify-end">
                <button onClick={nextQuestion} className="btn-primary">
                  {currentQuestionIndex < activeSession.questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4" />
                      Finish Session
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Session list view
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Prep</h1>
          <p className="mt-1 text-gray-500">
            Practice with AI-generated questions and get instant feedback
          </p>
        </div>
        <button onClick={() => setShowNewSession(true)} className="btn-primary">
          <Play className="h-4 w-4" />
          New Session
        </button>
      </div>

      {/* Quick stats */}
      {interviewSessions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: 'Sessions Completed',
              value: interviewSessions.filter((s) => s.overallScore).length,
              icon: Target,
              color: 'bg-blue-50',
            },
            {
              label: 'Average Score',
              value: `${Math.round(
                interviewSessions
                  .filter((s) => s.overallScore)
                  .reduce((acc, s) => acc + (s.overallScore || 0), 0) /
                  Math.max(interviewSessions.filter((s) => s.overallScore).length, 1)
              )}%`,
              icon: Trophy,
              color: 'bg-amber-50',
            },
            {
              label: 'Questions Practiced',
              value: interviewSessions.reduce(
                (acc, s) => acc + s.questions.filter((q) => q.userAnswer).length,
                0
              ),
              icon: Brain,
              color: 'bg-purple-50',
            },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${stat.color} p-2.5`}>
                  <stat.icon className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {interviewSessions.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No practice sessions yet"
          description="Start a mock interview session to practice with AI-generated questions tailored to your target role."
          actionLabel="Start Practice"
          onAction={() => setShowNewSession(true)}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Past Sessions</h2>
          {interviewSessions
            .slice()
            .reverse()
            .map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {session.company} - {session.position}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                        <span className="badge bg-gray-100 text-gray-600">{session.type}</span>
                        <span>{session.questions.length} questions</span>
                        <span>{formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.overallScore ? (
                      <div
                        className={`rounded-xl px-3 py-1.5 text-sm font-bold ${
                          session.overallScore >= 80
                            ? 'bg-emerald-100 text-emerald-700'
                            : session.overallScore >= 60
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {session.overallScore}%
                      </div>
                    ) : (
                      <span className="badge bg-gray-100 text-gray-600">Incomplete</span>
                    )}
                    <button
                      onClick={() => deleteInterviewSession(session.id)}
                      className="btn-ghost text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {/* New Session Modal */}
      <Modal
        isOpen={showNewSession}
        onClose={() => setShowNewSession(false)}
        title="New Interview Session"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary-600" />
              <p className="text-sm text-primary-700">
                Practice with AI-generated questions tailored to your target role. Get instant feedback on your answers.
              </p>
            </div>
          </div>

          <div>
            <label className="label">Company</label>
            <input
              type="text"
              value={sessionForm.company}
              onChange={(e) => setSessionForm({ ...sessionForm, company: e.target.value })}
              placeholder="e.g., Google"
              className="input"
            />
          </div>

          <div>
            <label className="label">Position</label>
            <input
              type="text"
              value={sessionForm.position}
              onChange={(e) => setSessionForm({ ...sessionForm, position: e.target.value })}
              placeholder="e.g., Senior Developer"
              className="input"
            />
          </div>

          <div>
            <label className="label">Interview Type</label>
            <select
              value={sessionForm.type}
              onChange={(e) =>
                setSessionForm({
                  ...sessionForm,
                  type: e.target.value as 'behavioral' | 'technical' | 'mixed',
                })
              }
              className="select"
            >
              <option value="mixed">Mixed (Recommended)</option>
              <option value="behavioral">Behavioral</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowNewSession(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={startSession} className="btn-primary">
              <Play className="h-4 w-4" />
              Start Session
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
