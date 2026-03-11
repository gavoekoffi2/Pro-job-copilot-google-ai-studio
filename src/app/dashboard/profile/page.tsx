'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Save,
  Linkedin,
  Globe,
  Edit3,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import toast from 'react-hot-toast';
import type { Experience, Education } from '@/types';

export default function ProfilePage() {
  const { user, updateProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    title: user?.title || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
    bio: user?.bio || '',
  });

  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>(user?.experience || []);
  const [educations, setEducations] = useState<Education[]>(user?.education || []);

  const profileCompletion = () => {
    let score = 0;
    const total = 10;
    if (user?.name) score++;
    if (user?.email) score++;
    if (user?.phone) score++;
    if (user?.location) score++;
    if (user?.title) score++;
    if (user?.bio) score++;
    if (user?.skills && user.skills.length > 0) score++;
    if (user?.experience && user.experience.length > 0) score++;
    if (user?.education && user.education.length > 0) score++;
    if (user?.linkedin || user?.portfolio) score++;
    return Math.round((score / total) * 100);
  };

  const handleSavePersonal = () => {
    updateProfile(personalInfo);
    setIsEditing(false);
    toast.success('Profile updated!');
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      updateProfile({ skills: updatedSkills });
      setNewSkill('');
      toast.success('Skill added!');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    updateProfile({ skills: updatedSkills });
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    setExperiences([newExp, ...experiences]);
  };

  const handleUpdateExperience = (id: string, data: Partial<Experience>) => {
    const updated = experiences.map((e) => (e.id === id ? { ...e, ...data } : e));
    setExperiences(updated);
  };

  const handleSaveExperiences = () => {
    updateProfile({ experience: experiences });
    toast.success('Experience updated!');
  };

  const handleDeleteExperience = (id: string) => {
    const updated = experiences.filter((e) => e.id !== id);
    setExperiences(updated);
    updateProfile({ experience: updated });
    toast.success('Experience removed');
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      current: false,
    };
    setEducations([newEdu, ...educations]);
  };

  const handleUpdateEducation = (id: string, data: Partial<Education>) => {
    const updated = educations.map((e) => (e.id === id ? { ...e, ...data } : e));
    setEducations(updated);
  };

  const handleSaveEducation = () => {
    updateProfile({ education: educations });
    toast.success('Education updated!');
  };

  const handleDeleteEducation = (id: string) => {
    const updated = educations.filter((e) => e.id !== id);
    setEducations(updated);
    updateProfile({ education: updated });
    toast.success('Education removed');
  };

  const tabs = [
    { id: 'personal' as const, label: 'Personal Info', icon: User },
    { id: 'experience' as const, label: 'Experience', icon: Briefcase },
    { id: 'education' as const, label: 'Education', icon: GraduationCap },
    { id: 'skills' as const, label: 'Skills', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-500">Manage your professional information</p>
      </div>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-primary-500/30">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Your Name'}</h2>
            <p className="text-gray-600">{user?.title || 'Add your job title'}</p>
            <p className="text-sm text-gray-500">{user?.location || 'Add your location'}</p>
          </div>
          <div className="w-full sm:w-48">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600">Profile Completion</span>
              <span className="font-semibold text-primary-600">{profileCompletion()}%</span>
            </div>
            <ProgressBar value={profileCompletion()} color="blue" />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-0 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'personal' && (
          <div className="card">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Job Title</label>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                    placeholder="e.g., Senior Developer"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Location</label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  placeholder="City, State/Country"
                  className="input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">LinkedIn URL</label>
                  <input
                    type="url"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Portfolio URL</label>
                  <input
                    type="url"
                    value={personalInfo.portfolio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                    placeholder="https://..."
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Professional Bio</label>
                <textarea
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  placeholder="Write a brief professional summary..."
                  className="textarea"
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <button onClick={handleSavePersonal} className="btn-primary">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleAddExperience} className="btn-secondary">
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            </div>

            {experiences.map((exp) => (
              <div key={exp.id} className="card">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {exp.position || 'New Position'}
                    </h3>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="btn-ghost p-1 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, { position: e.target.value })
                        }
                        className="input"
                        placeholder="e.g., Senior Developer"
                      />
                    </div>
                    <div>
                      <label className="label">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, { company: e.target.value })
                        }
                        className="input"
                        placeholder="e.g., Google"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="label">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, { startDate: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">End Date</label>
                      <input
                        type="month"
                        value={exp.endDate || ''}
                        onChange={(e) =>
                          handleUpdateExperience(exp.id, { endDate: e.target.value })
                        }
                        className="input"
                        disabled={exp.current}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 pb-3">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            handleUpdateExperience(exp.id, { current: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600"
                        />
                        <span className="text-sm text-gray-600">Current position</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, { description: e.target.value })
                      }
                      className="textarea"
                      rows={3}
                      placeholder="Describe your role and responsibilities..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {experiences.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleSaveExperiences} className="btn-primary">
                  <Save className="h-4 w-4" />
                  Save All
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleAddEducation} className="btn-secondary">
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            </div>

            {educations.map((edu) => (
              <div key={edu.id} className="card">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {edu.institution || 'New Education'}
                    </h3>
                    <button
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="btn-ghost p-1 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, { institution: e.target.value })
                        }
                        className="input"
                        placeholder="e.g., MIT"
                      />
                    </div>
                    <div>
                      <label className="label">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, { degree: e.target.value })
                        }
                        className="input"
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="label">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, { field: e.target.value })
                        }
                        className="input"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label className="label">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, { startDate: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">End Date</label>
                      <input
                        type="month"
                        value={edu.endDate || ''}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, { endDate: e.target.value })
                        }
                        className="input"
                        disabled={edu.current}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">GPA (optional)</label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, { gpa: e.target.value })
                      }
                      className="input"
                      placeholder="e.g., 3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            ))}

            {educations.length > 0 && (
              <div className="flex justify-end">
                <button onClick={handleSaveEducation} className="btn-primary">
                  <Save className="h-4 w-4" />
                  Save All
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="card">
            <div className="mb-6">
              <label className="label">Add a Skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Type a skill and press Enter"
                  className="input flex-1"
                />
                <button onClick={handleAddSkill} className="btn-primary">
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="rounded-full p-0.5 hover:bg-primary-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>

            {skills.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                No skills added yet. Start typing to add your skills.
              </p>
            )}

            {/* Suggested skills */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="mb-3 text-sm font-medium text-gray-700">Suggested Skills</p>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'AWS', 'Docker', 'Git', 'Agile']
                  .filter((s) => !skills.includes(s))
                  .map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        const updated = [...skills, skill];
                        setSkills(updated);
                        updateProfile({ skills: updated });
                        toast.success(`Added ${skill}`);
                      }}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
