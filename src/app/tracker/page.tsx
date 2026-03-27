'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  Kanban, Plus, X, ExternalLink, Calendar, MoreHorizontal,
  Building2, Briefcase, Trash2, Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GradientText } from '@/components/ui/GradientText';
import {
  getApplications, saveApplication, updateApplicationStatus,
  deleteApplication, generateId,
} from '@/lib/storage';
import type { JobApplication, ApplicationStatus } from '@/types';

const COLUMNS: { id: ApplicationStatus; label: string; color: string; bg: string }[] = [
  { id: 'wishlist',     label: 'Wishlist',      color: 'text-white/50',     bg: 'bg-white/5' },
  { id: 'applied',      label: 'Applied',       color: 'text-blue-400',     bg: 'bg-blue-500/10' },
  { id: 'phone_screen', label: 'Phone Screen',  color: 'text-amber-400',    bg: 'bg-amber-500/10' },
  { id: 'interview',    label: 'Interview',     color: 'text-purple-400',   bg: 'bg-purple-500/10' },
  { id: 'offer',        label: 'Offer',         color: 'text-green-400',    bg: 'bg-green-500/10' },
  { id: 'rejected',     label: 'Rejected',      color: 'text-red-400',      bg: 'bg-red-500/10' },
];

const statusBadge: Record<ApplicationStatus, 'default' | 'info' | 'warning' | 'primary' | 'success' | 'danger'> = {
  wishlist: 'default', applied: 'info', phone_screen: 'warning',
  interview: 'primary', offer: 'success', rejected: 'danger',
};

// ─── Add Job Modal ────────────────────────────────────────────
function AddJobModal({ onClose, onAdd }: { onClose: () => void; onAdd: (job: JobApplication) => void }) {
  const [form, setForm] = useState({
    company: '', role: '', link: '', notes: '', salary: '', location: '',
    status: 'applied' as ApplicationStatus,
  });

  const update = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      toast.error('Company and role are required');
      return;
    }
    const now = new Date().toISOString();
    const job: JobApplication = {
      id: generateId(),
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status,
      dateAdded: now,
      dateUpdated: now,
      link: form.link || undefined,
      notes: form.notes || undefined,
      salary: form.salary || undefined,
      location: form.location || undefined,
    };
    onAdd(job);
    onClose();
    toast.success(`Added ${job.role} at ${job.company}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white text-lg">Add Job Application</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Company *</label>
              <input value={form.company} onChange={e => update('company', e.target.value)} placeholder="Google" className="input-glass w-full px-3 py-2.5 text-sm" required />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Role *</label>
              <input value={form.role} onChange={e => update('role', e.target.value)} placeholder="Software Engineer" className="input-glass w-full px-3 py-2.5 text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1">Location</label>
              <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="San Francisco" className="input-glass w-full px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Salary</label>
              <input value={form.salary} onChange={e => update('salary', e.target.value)} placeholder="$120K" className="input-glass w-full px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Status</label>
            <select value={form.status} onChange={e => update('status', e.target.value as ApplicationStatus)} className="input-glass w-full px-3 py-2.5 text-sm">
              {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Job URL</label>
            <input value={form.link} onChange={e => update('link', e.target.value)} placeholder="https://..." type="url" className="input-glass w-full px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Recruiter name, application notes..." rows={2} className="input-glass w-full px-3 py-2.5 text-sm resize-none" />
          </div>
          <Button type="submit" icon={<Plus className="w-4 h-4" />} className="w-full">
            Add Application
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────
function JobCard({ app, index, onDelete }: { app: JobApplication; index: number; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const date = new Date(app.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Draggable draggableId={app.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card p-3 mb-2 ${snapshot.isDragging ? 'rotate-2 shadow-glow-lg opacity-95 scale-105' : ''}`}
          style={{ ...provided.draggableProps.style, transition: snapshot.isDragging ? undefined : 'all 0.2s' }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm leading-tight truncate">{app.role}</p>
              <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3" /> {app.company}
              </p>
            </div>
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded text-white/30 hover:text-white/70 transition-colors"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute right-0 top-6 z-20 glass-strong rounded-xl p-1 min-w-[130px] border border-white/10"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {app.link && (
                      <a href={app.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> Open link
                      </a>
                    )}
                    <button
                      onClick={() => { onDelete(app.id); setMenuOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg w-full text-left transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-1 text-[10px] text-white/30">
              <Calendar className="w-3 h-3" /> {date}
            </div>
            {app.salary && (
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {app.salary}
              </span>
            )}
            {app.location && (
              <span className="text-[10px] text-white/30 truncate max-w-[80px]">{app.location}</span>
            )}
          </div>

          {app.notes && (
            <p className="mt-2 text-[11px] text-white/40 leading-relaxed line-clamp-2">{app.notes}</p>
          )}
        </div>
      )}
    </Draggable>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function TrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setApplications(getApplications());
    setLoaded(true);
  }, []);

  const handleAdd = (job: JobApplication) => {
    saveApplication(job);
    setApplications(getApplications());
  };

  const handleDelete = (id: string) => {
    deleteApplication(id);
    setApplications(getApplications());
    toast.success('Application removed');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as ApplicationStatus;

    updateApplicationStatus(draggableId, newStatus);
    setApplications(prev =>
      prev.map(a => a.id === draggableId ? { ...a, status: newStatus, dateUpdated: new Date().toISOString() } : a)
    );
  };

  const getColApps = (status: ApplicationStatus) =>
    applications.filter(a => a.status === status);

  const totalActive = applications.filter(a => a.status !== 'rejected').length;

  return (
    <div className="flex min-h-screen pt-16">
      <Sidebar />
      <div className="flex-1 min-w-0 p-6 lg:p-8 overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Kanban className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">
                    Application <GradientText variant="primary">Tracker</GradientText>
                  </h1>
                  <p className="text-white/50 text-sm">
                    {totalActive} active application{totalActive !== 1 ? 's' : ''} · drag cards to update status
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                icon={<Plus className="w-4 h-4" />}
                size="md"
              >
                Add Job
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {COLUMNS.map(col => {
                const count = getColApps(col.id).length;
                return (
                  <div key={col.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${col.bg} border border-white/6`}>
                    <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
                    <span className="text-xs font-black text-white">{count}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Kanban Board */}
          {loaded && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-6 gap-4">
                {COLUMNS.map((col, ci) => {
                  const colApps = getColApps(col.id);
                  return (
                    <motion.div
                      key={col.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: ci * 0.05 }}
                    >
                      {/* Column header */}
                      <div className={`flex items-center justify-between mb-3 px-1`}>
                        <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                          {col.label}
                        </span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${col.bg} ${col.color}`}>
                          {colApps.length}
                        </span>
                      </div>

                      {/* Droppable column */}
                      <Droppable droppableId={col.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`kanban-column p-2 min-h-[200px] transition-all ${
                              snapshot.isDraggingOver ? 'border-purple-500/40 bg-purple-500/8' : ''
                            }`}
                          >
                            {colApps.map((app, index) => (
                              <JobCard key={app.id} app={app} index={index} onDelete={handleDelete} />
                            ))}
                            {provided.placeholder}

                            {colApps.length === 0 && !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center h-20 text-white/15 text-center">
                                <Briefcase className="w-5 h-5 mb-1" />
                                <p className="text-xs">Drop here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </motion.div>
                  );
                })}
              </div>
            </DragDropContext>
          )}

          {applications.length === 0 && loaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Kanban className="w-10 h-10 text-orange-400/40" />
              </div>
              <h3 className="font-bold text-white/50 text-lg mb-1">No applications yet</h3>
              <p className="text-white/30 text-sm mb-6">Start tracking your job search journey</p>
              <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
                Add Your First Application
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && <AddJobModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </div>
  );
}
