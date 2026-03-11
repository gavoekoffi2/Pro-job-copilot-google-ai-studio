'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Plus,
  Sparkles,
  Trash2,
  Eye,
  Copy,
  Download,
  Wand2,
  Building2,
  Briefcase,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function CoverLetterPage() {
  const { coverLetters, addCoverLetter, deleteCoverLetter, user } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState<typeof coverLetters[0] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    jobDescription: '',
    tone: 'professional',
  });

  const handleGenerate = async () => {
    if (!formData.company || !formData.position) {
      toast.error('Please fill in company and position');
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 2000));

    const generatedContent = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.position} position at ${formData.company}. With ${user?.experience?.length || 'several'} years of experience in software development and a proven track record of delivering high-impact solutions, I am confident that my skills and passion make me an excellent fit for this role.

In my current role at ${user?.experience?.[0]?.company || 'my current company'}, I have ${user?.experience?.[0]?.achievements?.[0]?.toLowerCase() || 'led multiple successful projects and driven significant business outcomes'}. This experience has honed my ability to collaborate effectively with cross-functional teams and deliver results that exceed expectations.

What particularly excites me about ${formData.company} is your commitment to innovation and the opportunity to work on challenging problems at scale. My technical expertise in ${user?.skills?.slice(0, 3).join(', ') || 'modern technologies'} aligns perfectly with the requirements of this role, and I am eager to bring my unique perspective to your team.

I am particularly drawn to this opportunity because it combines my technical skills with my passion for building products that make a real difference. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${formData.company}'s continued success.

Thank you for considering my application. I look forward to the possibility of discussing this exciting opportunity with you.

Best regards,
${user?.name || 'Your Name'}`;

    addCoverLetter({
      title: `${formData.position} at ${formData.company}`,
      company: formData.company,
      position: formData.position,
      content: generatedContent,
    });

    toast.success('Cover letter generated!');
    setIsGenerating(false);
    setShowCreateModal(false);
    setFormData({ company: '', position: '', jobDescription: '', tone: 'professional' });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    deleteCoverLetter(id);
    toast.success('Cover letter deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cover Letters</h1>
          <p className="mt-1 text-gray-500">
            Generate personalized cover letters with AI
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Sparkles className="h-4 w-4" />
          Generate New
        </button>
      </div>

      {coverLetters.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No cover letters yet"
          description="Generate your first AI-powered cover letter tailored to any job application."
          actionLabel="Generate Cover Letter"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-hover group"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{letter.title}</h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(letter.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  {letter.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                  {letter.position}
                </div>
              </div>

              <p className="mb-4 text-xs text-gray-500 line-clamp-3">
                {letter.content.substring(0, 150)}...
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPreview(letter)}
                  className="btn-ghost text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => handleCopy(letter.content)}
                  className="btn-ghost text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
                <button
                  onClick={() => handleDelete(letter.id)}
                  className="btn-ghost text-xs text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowCreateModal(true)}
            className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition-all hover:border-primary-300 hover:bg-primary-50/30"
          >
            <div className="mb-3 rounded-xl bg-gray-100 p-3">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">Generate New</p>
          </motion.button>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Generate Cover Letter"
        size="lg"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary-600" />
              <p className="text-sm text-primary-700">
                Our AI will generate a personalized cover letter based on your profile and the job details you provide.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Company Name</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Google"
                className="input"
              />
            </div>
            <div>
              <label className="label">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., Senior Developer"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Job Description (optional)</label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              placeholder="Paste the job description to get a more tailored letter..."
              className="textarea"
              rows={4}
            />
          </div>

          <div>
            <label className="label">Tone</label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              className="select"
            >
              <option value="professional">Professional</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="formal">Formal</option>
              <option value="conversational">Conversational</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!showPreview}
        onClose={() => setShowPreview(null)}
        title={showPreview?.title || 'Cover Letter'}
        size="lg"
      >
        {showPreview && (
          <div>
            <div className="mb-4 flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {showPreview.company}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> {showPreview.position}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {showPreview.content}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => handleCopy(showPreview.content)}
                className="btn-secondary"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
