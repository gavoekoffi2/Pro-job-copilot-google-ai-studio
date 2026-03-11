'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowUpDown,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import type { JobApplication } from '@/types';

const statusOptions: JobApplication['status'][] = [
  'saved',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'accepted',
];

const typeOptions: JobApplication['type'][] = ['remote', 'onsite', 'hybrid'];

export default function JobsPage() {
  const { applications, addApplication, updateApplication, deleteApplication } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    type: 'remote' as JobApplication['type'],
    status: 'saved' as JobApplication['status'],
    salary: '',
    url: '',
    notes: '',
    deadline: '',
    contactName: '',
    contactEmail: '',
  });

  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.position.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [applications, searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: applications.length };
    statusOptions.forEach((status) => {
      counts[status] = applications.filter((a) => a.status === status).length;
    });
    return counts;
  }, [applications]);

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      location: '',
      type: 'remote',
      status: 'saved',
      salary: '',
      url: '',
      notes: '',
      deadline: '',
      contactName: '',
      contactEmail: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.company || !formData.position) {
      toast.error('Company and position are required');
      return;
    }

    if (editingApp) {
      updateApplication(editingApp.id, formData);
      toast.success('Application updated!');
      setEditingApp(null);
    } else {
      addApplication(formData);
      toast.success('Application added!');
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (app: JobApplication) => {
    setFormData({
      company: app.company,
      position: app.position,
      location: app.location,
      type: app.type,
      status: app.status,
      salary: app.salary || '',
      url: app.url || '',
      notes: app.notes || '',
      deadline: app.deadline || '',
      contactName: app.contactName || '',
      contactEmail: app.contactEmail || '',
    });
    setEditingApp(app);
    setShowAddModal(true);
  };

  const handleStatusChange = (id: string, status: JobApplication['status']) => {
    updateApplication(id, { status });
    toast.success(`Status updated to ${getStatusLabel(status)}`);
  };

  const handleDelete = (id: string) => {
    deleteApplication(id);
    toast.success('Application deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <p className="mt-1 text-gray-500">
            Track and manage all your job applications
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingApp(null);
            setShowAddModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Pipeline view */}
      {applications.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilterStatus('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({statusCounts.all})
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getStatusLabel(status)} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Search & filters */}
      {applications.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company or position..."
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2.5 transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2.5 transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Applications */}
      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Start tracking your job applications to stay organized and never miss a deadline."
          actionLabel="Add Application"
          onAction={() => setShowAddModal(true)}
        />
      ) : filteredApps.length === 0 ? (
        <div className="py-12 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-500">No applications match your search</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-hover"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-600">
                    {app.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-900">{app.position}</h3>
                    <p className="truncate text-sm text-gray-500">{app.company}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3 space-y-1.5">
                {app.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {app.location}
                  </div>
                )}
                {app.salary && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="h-3.5 w-3.5" />
                    {app.salary}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(app.updatedAt)}
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className={`badge ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
                <span className="badge bg-gray-100 text-gray-600">{app.type}</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app.id, e.target.value as JobApplication['status'])
                  }
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleEdit(app)} className="btn-ghost p-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost p-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(app.id)}
                  className="btn-ghost p-1.5 text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-600">Position</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Company</th>
                <th className="hidden px-4 py-3 font-semibold text-gray-600 md:table-cell">Location</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="hidden px-4 py-3 font-semibold text-gray-600 sm:table-cell">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{app.position}</td>
                  <td className="px-4 py-3 text-gray-600">{app.company}</td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell">{app.location || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value as JobApplication['status'])
                      }
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(app.status)} border-0 cursor-pointer`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                    {formatDate(app.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(app)} className="btn-ghost p-1">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="btn-ghost p-1 text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingApp(null);
          resetForm();
        }}
        title={editingApp ? 'Edit Application' : 'Add Application'}
        size="lg"
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Google"
                className="input"
              />
            </div>
            <div>
              <label className="label">Position *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g., Senior Developer"
                className="input"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco"
                className="input"
              />
            </div>
            <div>
              <label className="label">Work Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as JobApplication['type'] })
                }
                className="select"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as JobApplication['status'],
                  })
                }
                className="select"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Salary Range</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g., $120K - $150K"
                className="input"
              />
            </div>
            <div>
              <label className="label">Application URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="input"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Contact Name</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="Recruiter name"
                className="input"
              />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="recruiter@company.com"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about this application..."
              className="textarea"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingApp(null);
                resetForm();
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              {editingApp ? 'Update' : 'Add'} Application
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
