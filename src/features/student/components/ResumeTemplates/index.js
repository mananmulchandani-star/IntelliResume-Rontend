// src/features/student/components/ResumeTemplates/index.js
import ProfessionalTemplate from './ProfessionalTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import IRMSpecialTemplate from './IRMSpecialTemplate';
import TwinGridTemplate from './TwinGridTemplate';

export {
  ProfessionalTemplate,
  ModernTemplate,
  CreativeTemplate,
  IRMSpecialTemplate,
  TwinGridTemplate,
};

export const RESUME_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, classical single-column layout with subtle blue accents. Ideal for traditional roles and ATS scanning.',
    component: ProfessionalTemplate,
    badge: 'Popular',
    accentColor: '#2563eb',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek, typography-forward design with clean borders and minimalist aesthetics. Perfect for tech & product roles.',
    component: ModernTemplate,
    badge: 'Tech',
    accentColor: '#0f172a',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant card-based portfolio styling with purple gradients. Tailored for designers, marketers, and frontend builders.',
    component: CreativeTemplate,
    badge: 'Creative',
    accentColor: '#7c3aed',
  },
  {
    id: 'irm-special',
    name: 'IRM Special',
    description: 'InsightResume signature layout featuring student photo support and verified skill credential badge.',
    component: IRMSpecialTemplate,
    badge: 'Certified',
    accentColor: '#4f46e5',
  },
  {
    id: 'twin-grid',
    name: 'Twin Grid',
    description: 'Structured two-column layout with quick-scan left sidebar and rich project right column.',
    component: TwinGridTemplate,
    badge: 'Compact',
    accentColor: '#334155',
  },
];

export function getTemplateComponent(templateNameOrId = 'Professional') {
  const normalized = String(templateNameOrId).toLowerCase().replace(/[\s-_]/g, '');

  if (normalized.includes('twingrid')) return TwinGridTemplate;
  if (normalized.includes('irm') || normalized.includes('special')) return IRMSpecialTemplate;
  if (normalized.includes('creative')) return CreativeTemplate;
  if (normalized.includes('modern')) return ModernTemplate;
  return ProfessionalTemplate;
}
