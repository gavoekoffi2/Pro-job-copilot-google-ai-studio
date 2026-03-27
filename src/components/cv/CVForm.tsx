'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, Wrench, Globe, Award, FolderOpen,
  Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { CVData, CVExperience, CVEducation, CVSkillGroup, CVLanguage, CVCertification, CVProject } from '@/types/cv';
import { getDailyTip } from '@/lib/gemini';
import { generateId } from '@/lib/storage';

// ─── Helpers ─────────────────────────────────────────────────
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/60 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'input-glass w-full px-3 py-2 text-sm';
const textareaCls = 'input-glass w-full px-3 py-2 text-sm resize-none';

// ─── Section Accordion ────────────────────────────────────────
function Section({ title, icon: Icon, children, defaultOpen = false }: {
  title: string; icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/4 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────
interface CVFormProps {
  cv: CVData;
  onChange: (cv: CVData) => void;
}

export function CVForm({ cv, onChange }: CVFormProps) {
  const [aiLoading, setAiLoading] = useState(false);

  const update = (key: keyof CVData, value: unknown) =>
    onChange({ ...cv, [key]: value });

  // ── Experience ───────────────────────────────────────────────
  const addExp = () => {
    const exp: CVExperience = {
      id: generateId(), company: '', position: '', location: '',
      startDate: '', endDate: '', current: false, description: '', achievements: [],
    };
    update('experience', [...cv.experience, exp]);
  };
  const updateExp = (id: string, patch: Partial<CVExperience>) =>
    update('experience', cv.experience.map(e => e.id === id ? { ...e, ...patch } : e));
  const removeExp = (id: string) => update('experience', cv.experience.filter(e => e.id !== id));
  const addAchievement = (id: string) => {
    const exp = cv.experience.find(e => e.id === id);
    if (exp) updateExp(id, { achievements: [...exp.achievements, ''] });
  };
  const updateAchievement = (expId: string, idx: number, val: string) => {
    const exp = cv.experience.find(e => e.id === expId);
    if (!exp) return;
    const arr = [...exp.achievements];
    arr[idx] = val;
    updateExp(expId, { achievements: arr });
  };
  const removeAchievement = (expId: string, idx: number) => {
    const exp = cv.experience.find(e => e.id === expId);
    if (!exp) return;
    updateExp(expId, { achievements: exp.achievements.filter((_, i) => i !== idx) });
  };

  // ── Education ────────────────────────────────────────────────
  const addEdu = () => {
    const edu: CVEducation = {
      id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '',
    };
    update('education', [...cv.education, edu]);
  };
  const updateEdu = (id: string, patch: Partial<CVEducation>) =>
    update('education', cv.education.map(e => e.id === id ? { ...e, ...patch } : e));
  const removeEdu = (id: string) => update('education', cv.education.filter(e => e.id !== id));

  // ── Skills ───────────────────────────────────────────────────
  const addSkillGroup = () => {
    update('skills', [...cv.skills, { id: generateId(), category: '', items: [] }]);
  };
  const updateSkillGroup = (id: string, patch: Partial<CVSkillGroup>) =>
    update('skills', cv.skills.map(s => s.id === id ? { ...s, ...patch } : s));
  const removeSkillGroup = (id: string) => update('skills', cv.skills.filter(s => s.id !== id));

  // ── Languages ────────────────────────────────────────────────
  const addLanguage = () => update('languages', [...cv.languages, { language: '', level: 'Intermediate' as const }]);
  const updateLanguage = (i: number, patch: Partial<CVLanguage>) =>
    update('languages', cv.languages.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  const removeLanguage = (i: number) => update('languages', cv.languages.filter((_, idx) => idx !== i));

  // ── Certifications ───────────────────────────────────────────
  const addCert = () => update('certifications', [...cv.certifications, { id: generateId(), name: '', issuer: '', date: '' }]);
  const updateCert = (id: string, patch: Partial<CVCertification>) =>
    update('certifications', cv.certifications.map(c => c.id === id ? { ...c, ...patch } : c));
  const removeCert = (id: string) => update('certifications', cv.certifications.filter(c => c.id !== id));

  // ── Projects ─────────────────────────────────────────────────
  const addProject = () => update('projects', [...cv.projects, { id: generateId(), name: '', description: '', technologies: '' }]);
  const updateProject = (id: string, patch: Partial<CVProject>) =>
    update('projects', cv.projects.map(p => p.id === id ? { ...p, ...patch } : p));
  const removeProject = (id: string) => update('projects', cv.projects.filter(p => p.id !== id));

  // ── AI Summary helper ─────────────────────────────────────────
  const handleAISummary = async () => {
    if (!cv.title) { toast.error('Renseignez d\'abord votre titre professionnel'); return; }
    setAiLoading(true);
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const expText = cv.experience.slice(0, 2).map(e => `${e.position} chez ${e.company}`).join(', ');
      const skillText = cv.skills.flatMap(s => s.items).slice(0, 8).join(', ');
      const result = await model.generateContent(
        `Écris un résumé professionnel percutant de 2-3 phrases pour un CV.
         Titre: ${cv.title}. Expériences: ${expText || 'non spécifiées'}. Compétences clés: ${skillText || 'non spécifiées'}.
         Sois concis, impactant, à la 3ème personne ou neutre. Pas de guillemets.`
      );
      update('summary', result.response.text().trim());
      toast.success('Résumé généré par Gemini AI !');
    } catch {
      toast.error('Erreur lors de la génération');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Photo upload ─────────────────────────────────────────────
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Format image invalide'); return; }
    const reader = new FileReader();
    reader.onload = ev => update('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Personal Info */}
      <Section title="Informations personnelles" icon={User} defaultOpen>
        <div className="space-y-3">
          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center shrink-0">
              {cv.photo ? (
                <img src={cv.photo} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div className="flex-1">
              <label className="btn-primary inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                {cv.photo ? 'Changer la photo' : 'Ajouter une photo'}
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
              {cv.photo && (
                <button onClick={() => update('photo', '')} className="ml-2 text-xs text-red-400 hover:text-red-300">Supprimer</button>
              )}
              <p className="text-xs text-white/30 mt-1">JPG, PNG · Optionnel</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" required>
              <input value={cv.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Alexandra" className={inputCls} />
            </Field>
            <Field label="Nom" required>
              <input value={cv.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Martin" className={inputCls} />
            </Field>
          </div>
          <Field label="Titre professionnel" required>
            <input value={cv.title} onChange={e => update('title', e.target.value)} placeholder="Senior Product Manager" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input type="email" value={cv.email} onChange={e => update('email', e.target.value)} placeholder="alex@email.com" className={inputCls} />
            </Field>
            <Field label="Téléphone">
              <input value={cv.phone} onChange={e => update('phone', e.target.value)} placeholder="+33 6 00 00 00 00" className={inputCls} />
            </Field>
          </div>
          <Field label="Ville / Pays">
            <input value={cv.location} onChange={e => update('location', e.target.value)} placeholder="Paris, France" className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="LinkedIn">
              <input value={cv.linkedin ?? ''} onChange={e => update('linkedin', e.target.value)} placeholder="linkedin.com/in/..." className={inputCls} />
            </Field>
            <Field label="Site / GitHub">
              <input value={cv.website ?? ''} onChange={e => update('website', e.target.value)} placeholder="github.com/..." className={inputCls} />
            </Field>
          </div>
        </div>
      </Section>

      {/* Summary */}
      <Section title="Résumé professionnel" icon={Sparkles}>
        <div className="space-y-3">
          <textarea
            value={cv.summary}
            onChange={e => update('summary', e.target.value)}
            placeholder="Professionnel passionné avec X ans d'expérience dans..."
            rows={4}
            className={textareaCls}
          />
          <button
            onClick={handleAISummary}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-sm font-medium text-purple-300 hover:bg-purple-500/30 transition-all disabled:opacity-50"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Générer avec Gemini AI
          </button>
        </div>
      </Section>

      {/* Experience */}
      <Section title="Expériences professionnelles" icon={Briefcase}>
        <div className="space-y-4">
          {cv.experience.map((exp, idx) => (
            <div key={exp.id} className="bg-white/4 rounded-xl p-4 space-y-3 relative border border-white/6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white/50">Poste {idx + 1}</span>
                <button onClick={() => removeExp(exp.id)} className="text-red-400/70 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Intitulé du poste">
                  <input value={exp.position} onChange={e => updateExp(exp.id, { position: e.target.value })} placeholder="Product Manager" className={inputCls} />
                </Field>
                <Field label="Entreprise">
                  <input value={exp.company} onChange={e => updateExp(exp.id, { company: e.target.value })} placeholder="Google" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Ville">
                  <input value={exp.location} onChange={e => updateExp(exp.id, { location: e.target.value })} placeholder="Paris" className={inputCls} />
                </Field>
                <Field label="Date début">
                  <input type="month" value={exp.startDate} onChange={e => updateExp(exp.id, { startDate: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Date fin">
                  <div className="space-y-1.5">
                    <input type="month" value={exp.endDate} onChange={e => updateExp(exp.id, { endDate: e.target.value })} disabled={exp.current} className={`${inputCls} disabled:opacity-40`} />
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={e => updateExp(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })} className="accent-purple-500" />
                      <span className="text-xs text-white/50">En cours</span>
                    </label>
                  </div>
                </Field>
              </div>
              <Field label="Description">
                <textarea value={exp.description} onChange={e => updateExp(exp.id, { description: e.target.value })} placeholder="Décrivez vos responsabilités principales..." rows={2} className={textareaCls} />
              </Field>
              <div>
                <div className="text-xs font-medium text-white/60 mb-2">Réalisations clés</div>
                <div className="space-y-2">
                  {exp.achievements.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={a} onChange={e => updateAchievement(exp.id, i, e.target.value)} placeholder="Réalisé +X% de..." className={`${inputCls} flex-1`} />
                      <button onClick={() => removeAchievement(exp.id, i)} className="text-red-400/60 hover:text-red-400 transition-colors px-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addAchievement(exp.id)} className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Ajouter une réalisation
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addExp} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
            <Plus className="w-4 h-4" /> Ajouter une expérience
          </button>
        </div>
      </Section>

      {/* Education */}
      <Section title="Formation" icon={GraduationCap}>
        <div className="space-y-4">
          {cv.education.map((edu, idx) => (
            <div key={edu.id} className="bg-white/4 rounded-xl p-4 space-y-3 border border-white/6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/50">Formation {idx + 1}</span>
                <button onClick={() => removeEdu(edu.id)} className="text-red-400/70 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <Field label="Établissement">
                <input value={edu.institution} onChange={e => updateEdu(edu.id, { institution: e.target.value })} placeholder="HEC Paris" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Diplôme">
                  <input value={edu.degree} onChange={e => updateEdu(edu.id, { degree: e.target.value })} placeholder="Master" className={inputCls} />
                </Field>
                <Field label="Spécialité">
                  <input value={edu.field} onChange={e => updateEdu(edu.id, { field: e.target.value })} placeholder="Marketing Digital" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Début">
                  <input value={edu.startDate} onChange={e => updateEdu(edu.id, { startDate: e.target.value })} placeholder="2018" className={inputCls} />
                </Field>
                <Field label="Fin">
                  <input value={edu.endDate} onChange={e => updateEdu(edu.id, { endDate: e.target.value })} placeholder="2020" className={inputCls} />
                </Field>
                <Field label="Mention / GPA">
                  <input value={edu.gpa ?? ''} onChange={e => updateEdu(edu.id, { gpa: e.target.value })} placeholder="Bien / 16/20" className={inputCls} />
                </Field>
              </div>
            </div>
          ))}
          <button onClick={addEdu} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
            <Plus className="w-4 h-4" /> Ajouter une formation
          </button>
        </div>
      </Section>

      {/* Skills */}
      <Section title="Compétences" icon={Wrench}>
        <div className="space-y-4">
          {cv.skills.map(sg => (
            <div key={sg.id} className="bg-white/4 rounded-xl p-4 space-y-3 border border-white/6">
              <div className="flex gap-2">
                <input value={sg.category} onChange={e => updateSkillGroup(sg.id, { category: e.target.value })} placeholder="Catégorie (ex: Technologies)" className={`${inputCls} flex-1`} />
                <button onClick={() => removeSkillGroup(sg.id)} className="text-red-400/70 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <Field label="Compétences (séparées par des virgules)">
                <input
                  value={sg.items.join(', ')}
                  onChange={e => updateSkillGroup(sg.id, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="React, TypeScript, Node.js, AWS"
                  className={inputCls}
                />
              </Field>
            </div>
          ))}
          <button onClick={addSkillGroup} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
            <Plus className="w-4 h-4" /> Ajouter une catégorie
          </button>
        </div>
      </Section>

      {/* Languages */}
      <Section title="Langues" icon={Globe}>
        <div className="space-y-3">
          {cv.languages.map((l, i) => (
            <div key={i} className="flex gap-2">
              <input value={l.language} onChange={e => updateLanguage(i, { language: e.target.value })} placeholder="Anglais" className={`${inputCls} flex-1`} />
              <select value={l.level} onChange={e => updateLanguage(i, { level: e.target.value as CVLanguage['level'] })} className={`${inputCls} w-36`}>
                {['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'].map(lv => (
                  <option key={lv} value={lv}>{lv}</option>
                ))}
              </select>
              <button onClick={() => removeLanguage(i)} className="text-red-400/70 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
          <button onClick={addLanguage} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
            <Plus className="w-4 h-4" /> Ajouter une langue
          </button>
        </div>
      </Section>

      {/* Certifications */}
      <Section title="Certifications" icon={Award}>
        <div className="space-y-3">
          {cv.certifications.map(c => (
            <div key={c.id} className="grid grid-cols-3 gap-2">
              <input value={c.name} onChange={e => updateCert(c.id, { name: e.target.value })} placeholder="AWS Solutions Architect" className={inputCls} />
              <input value={c.issuer} onChange={e => updateCert(c.id, { issuer: e.target.value })} placeholder="Amazon" className={inputCls} />
              <div className="flex gap-2">
                <input value={c.date} onChange={e => updateCert(c.id, { date: e.target.value })} placeholder="2023" className={`${inputCls} flex-1`} />
                <button onClick={() => removeCert(c.id)} className="text-red-400/70 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button onClick={addCert} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
            <Plus className="w-4 h-4" /> Ajouter une certification
          </button>
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projets" icon={FolderOpen}>
        <div className="space-y-4">
          {cv.projects.map((p, idx) => (
            <div key={p.id} className="bg-white/4 rounded-xl p-4 space-y-3 border border-white/6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-white/50">Projet {idx + 1}</span>
                <button onClick={() => removeProject(p.id)} className="text-red-400/70 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nom du projet">
                  <input value={p.name} onChange={e => updateProject(p.id, { name: e.target.value })} placeholder="App mobile XYZ" className={inputCls} />
                </Field>
                <Field label="Technologies">
                  <input value={p.technologies} onChange={e => updateProject(p.id, { technologies: e.target.value })} placeholder="React Native, Firebase" className={inputCls} />
                </Field>
              </div>
              <Field label="Description">
                <textarea value={p.description} onChange={e => updateProject(p.id, { description: e.target.value })} placeholder="Brève description du projet..." rows={2} className={textareaCls} />
              </Field>
            </div>
          ))}
          <button onClick={addProject} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-purple-500/30 text-sm text-purple-400 hover:bg-purple-500/10 transition-all">
            <Plus className="w-4 h-4" /> Ajouter un projet
          </button>
        </div>
      </Section>
    </div>
  );
}
