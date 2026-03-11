'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Sparkles,
  Download,
  Trash2,
  Edit3,
  Eye,
  Star,
  Wand2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDate, generateId } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import toast from 'react-hot-toast';
import type { Resume, ResumeContent } from '@/types';

export default function ResumePage() {
  const { resumes, addResume, updateResume, deleteResume, user } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState<Resume | null>(null);
  const [showOptimize, setShowOptimize] = useState<Resume | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [editingResume, setEditingResume] = useState<Resume | null>(null);

  // Form state for new resume
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    skills: '',
    targetRole: '',
  });

  const handleCreateResume = () => {
    if (!formData.title) {
      toast.error('Please add a title for your resume');
      return;
    }

    const content: ResumeContent = {
      personalInfo: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        linkedin: user?.linkedin,
        portfolio: user?.portfolio,
        summary: formData.summary || user?.bio || '',
      },
      experience: user?.experience || [],
      education: user?.education || [],
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim())
        : user?.skills || [],
      certifications: [],
      languages: [],
      projects: [],
    };

    const newResume = addResume({
      title: formData.title,
      content,
      score: Math.floor(Math.random() * 20) + 65,
      suggestions: [
        'Add more quantified achievements to your experience section',
        'Include industry-specific keywords for ATS optimization',
        'Consider adding a projects section to showcase your work',
        'Tailor your summary to match the target role',
        'Add relevant certifications or courses',
      ],
    });

    toast.success('Resume created successfully!');
    setShowCreateModal(false);
    setFormData({ title: '', summary: '', skills: '', targetRole: '' });
  };

  const handleOptimize = async (resume: Resume) => {
    setIsOptimizing(true);

    // Simulate AI optimization
    await new Promise((r) => setTimeout(r, 2500));

    const newScore = Math.min((resume.score || 70) + Math.floor(Math.random() * 15) + 5, 98);
    updateResume(resume.id, {
      score: newScore,
      suggestions: [
        'Great improvement! Your resume now includes stronger action verbs',
        'Keywords have been optimized for ATS compatibility',
        'Consider adding one more project to strengthen your profile',
      ],
    });

    toast.success(`Resume optimized! Score improved to ${newScore}/100`);
    setIsOptimizing(false);
    setShowOptimize(null);
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    toast.success('Resume deleted');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'green';
    if (score >= 65) return 'yellow';
    return 'red';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="mt-1 text-gray-500">
            Create and optimize ATS-friendly resumes with AI
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          New Resume
        </button>
      </div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Create your first AI-optimized resume to start applying for jobs with confidence."
          actionLabel="Create Resume"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-hover group"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{resume.title}</h3>
                    <p className="text-xs text-gray-500">
                      Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Score */}
              {resume.score && (
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">ATS Score</span>
                    <span className="text-sm font-bold text-gray-900">{resume.score}/100</span>
                  </div>
                  <ProgressBar
                    value={resume.score}
                    color={getScoreColor(resume.score) as 'green' | 'yellow' | 'red'}
                  />
                </div>
              )}

              {/* Suggestions preview */}
              {resume.suggestions && resume.suggestions.length > 0 && (
                <div className="mb-4 rounded-lg bg-amber-50 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {resume.suggestions.length} suggestions to improve
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPreview(resume)}
                  className="btn-ghost text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setShowOptimize(resume)}
                  className="btn-ghost text-xs text-primary-600"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Optimize
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="btn-ghost text-xs text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add new card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowCreateModal(true)}
            className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition-all hover:border-primary-300 hover:bg-primary-50/30"
          >
            <div className="mb-3 rounded-xl bg-gray-100 p-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">Create New Resume</p>
          </motion.button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Resume"
        size="lg"
      >
        <div className="space-y-5">
          <div>
            <label className="label">Resume Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Software Engineer Resume"
              className="input"
            />
          </div>

          <div>
            <label className="label">Professional Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Write a brief professional summary or let AI generate one..."
              className="textarea"
              rows={4}
            />
          </div>

          <div>
            <label className="label">Key Skills (comma-separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., React, TypeScript, Node.js, Python"
              className="input"
            />
            {user?.skills && user.skills.length > 0 && (
              <p className="mt-1.5 text-xs text-gray-500">
                Your profile skills: {user.skills.join(', ')}
              </p>
            )}
          </div>

          <div>
            <label className="label">Target Role (optional)</label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              placeholder="e.g., Senior Frontend Developer"
              className="input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateResume} className="btn-primary">
              <Sparkles className="h-4 w-4" />
              Create Resume
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!showPreview}
        onClose={() => setShowPreview(null)}
        title="Resume Preview"
        size="xl"
      >
        {showPreview && (
          <div className="prose-ai">
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {showPreview.content.personalInfo.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                {showPreview.content.personalInfo.email && (
                  <span>{showPreview.content.personalInfo.email}</span>
                )}
                {showPreview.content.personalInfo.phone && (
                  <span>{showPreview.content.personalInfo.phone}</span>
                )}
                {showPreview.content.personalInfo.location && (
                  <span>{showPreview.content.personalInfo.location}</span>
                )}
              </div>
              {showPreview.content.personalInfo.summary && (
                <p className="mt-3 text-gray-700">
                  {showPreview.content.personalInfo.summary}
                </p>
              )}
            </div>

            {showPreview.content.experience.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-lg font-bold text-gray-900">Experience</h2>
                {showPreview.content.experience.map((exp) => (
                  <div key={exp.id} className="mb-4">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
                        {exp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showPreview.content.education.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-lg font-bold text-gray-900">Education</h2>
                {showPreview.content.education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {edu.institution} | {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {showPreview.content.skills.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold text-gray-900">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {showPreview.content.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {showPreview.suggestions && showPreview.suggestions.length > 0 && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                  <Wand2 className="h-4 w-4" />
                  AI Suggestions
                </h3>
                <ul className="space-y-2">
                  {showPreview.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Optimize Modal */}
      <Modal
        isOpen={!!showOptimize}
        onClose={() => setShowOptimize(null)}
        title="AI Resume Optimizer"
        size="lg"
      >
        {showOptimize && (
          <div className="space-y-5">
            <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-primary-900">AI Optimization</h3>
                  <p className="mt-1 text-sm text-primary-700">
                    Our AI will analyze your resume and optimize it for ATS systems, improve action verbs, and add quantified achievements.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Target Job Description (optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to tailor your resume..."
                className="textarea"
                rows={5}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Adding a job description helps the AI tailor your resume more effectively.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowOptimize(null)} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => handleOptimize(showOptimize)}
                disabled={isOptimizing}
                className="btn-primary"
              >
                {isOptimizing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Optimize with AI
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
