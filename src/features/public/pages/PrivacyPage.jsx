import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Badge, Card, Button } from '../../../components/ui';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  FileCheck2,
  Server,
  ArrowRight,
  ExternalLink,
  Mail,
} from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = 'October 2026';

  const highlights = [
    {
      icon: <EyeOff className="w-5 h-5 text-primary-600" />,
      title: 'Zero Public AI Model Training',
      desc: 'Your resume text, work history, and academic transcripts are never used to train public foundational AI models (such as OpenAI or Anthropic weights).',
    },
    {
      icon: <Lock className="w-5 h-5 text-primary-600" />,
      title: 'Never Sold or Monetized',
      desc: 'InsightResume does not sell, rent, or trade student or job-seeker data to advertising brokers, marketing networks, or third-party lead generators.',
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-primary-600" />,
      title: 'FERPA & Academic Integrity',
      desc: 'University registrar data, CGPAs, and backlog histories are protected in strict compliance with the Family Educational Rights and Privacy Act.',
    },
    {
      icon: <Server className="w-5 h-5 text-primary-600" />,
      title: 'Bank-Grade AES-256 Encryption',
      desc: 'All candidate data is encrypted in transit via TLS 1.3 and at rest with AES-256 encryption across multi-region SOC-2 certified cloud infrastructure.',
    },
  ];

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200 bg-neutral-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="sm" className="mb-4">
            Security & Governance
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Privacy Policy & Data Sovereignty
          </h1>
          <p className="mt-4 text-sm text-neutral-500 font-mono">
            Effective Date: {lastUpdated} • Version 2.4
          </p>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            At InsightResume, we believe your professional history and educational credentials belong to you. We hold ourselves to the highest standards of transparency and data protection.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Four Core Guarantees Banner
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, idx) => (
              <Card key={idx} className="p-6 bg-neutral-50/70 border-neutral-200 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  {h.icon}
                </div>
                <h3 className="font-bold text-sm text-neutral-900">{h.title}</h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{h.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Main Policy Body
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 shadow-xs space-y-10 text-neutral-700 text-sm leading-relaxed">
            {/* Section 1 */}
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                We only collect data necessary to provide resume optimization, deterministic ATS scoring, and campus placement coordination services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li><strong className="text-neutral-800">Account Credentials:</strong> Name, academic or corporate email address, and encrypted authentication tokens.</li>
                <li><strong className="text-neutral-800">Resume & Experience Data:</strong> Career histories, project descriptions, education credentials, skills, and portfolio links.</li>
                <li><strong className="text-neutral-800">Verified Academic Metrics:</strong> When registered through an accredited university, registrar-verified CGPA, roll numbers, department, and backlog status.</li>
                <li><strong className="text-neutral-800">Assessment Telemetry:</strong> Proctored quiz results, time-to-completion, and cryptographic verification badges.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We strictly process collected information to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li>Generate and format ATS-compatible resume documents in vector PDF format.</li>
                <li>Audit resumes against enterprise parsing heuristics and calculate deterministic ATS scores.</li>
                <li>Validate eligibility criteria for on-campus company recruitment drives when authorized by the student.</li>
                <li>Maintain system security, prevent bot fraud, and comply with legal audit requirements.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">3. AI Model Governance & Data Sovereignty</h2>
              <p className="mb-3">
                Our generative rewrite copilot utilizes isolated, stateless API integrations. We uphold a strict <strong className="text-neutral-900">Zero-Data-Retention</strong> policy with all AI infrastructure providers.
              </p>
              <p className="text-xs text-neutral-600 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <strong>Legal Guarantee:</strong> Your career descriptions, personal statements, and project bullets are discarded from AI inference buffers immediately following completion of the text generation call. They are never retained, logged for model fine-tuning, or used to train public machine learning weights.
              </p>
            </div>

            {/* Section 4 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">4. Higher Education Confidentiality (FERPA Compliance)</h2>
              <p className="mb-3">
                For university partner implementations, InsightResume acts as an official school service provider under the Family Educational Rights and Privacy Act (FERPA), 34 CFR § 99.31(a)(1)(i)(B).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li>Student educational records remain under the direct control of the partnering educational institution.</li>
                <li>Academic standing (e.g. CGPA, active backlogs) is disclosed to visiting enterprise employers ONLY when the student explicitly submits an application to that employer's specific placement drive.</li>
                <li>No student directory data is ever made publicly accessible on open search engines without verified authentication.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">5. Data Sharing & Third Parties</h2>
              <p className="mb-3">
                InsightResume does not disclose personal data to third parties except in the following explicitly defined circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li><strong className="text-neutral-800">Employer Applications:</strong> When you click "Apply" to a placement drive or job listing, your selected resume and verified quiz badges are transmitted to that specific employer.</li>
                <li><strong className="text-neutral-800">University Placement Officers:</strong> Authorized placement administrators at your enrolled institution have oversight of drive application statuses.</li>
                <li><strong className="text-neutral-800">Legal Requirements:</strong> If compelled by lawful subpoena, court order, or binding government regulatory request.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">6. Security & Encryption Infrastructure</h2>
              <p className="mb-3">
                We employ defense-in-depth technical and operational safeguards:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li>All data in transit is protected using TLS 1.3 cryptographic transport security with Perfect Forward Secrecy.</li>
                <li>All database records, file attachments, and backups are encrypted at rest with AES-256 keys managed via dedicated Hardware Security Modules (HSMs).</li>
                <li>Strict Role-Based Access Control (RBAC) isolates student, university, and company environments.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">7. Your Rights & Data Portability</h2>
              <p className="mb-3">
                Under applicable privacy frameworks (including GDPR, CCPA/CPRA, and relevant national data laws), you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
                <li><strong className="text-neutral-800">Access & Export:</strong> Download all personal resumes and quiz history in standardized JSON or PDF formats at any time.</li>
                <li><strong className="text-neutral-800">Correction:</strong> Update self-declared resume bullets, technical skills, and project descriptions.</li>
                <li><strong className="text-neutral-800">Permanent Deletion:</strong> Request the immediate erasure of your account and personal data from our active databases by emailing our privacy team.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div className="pt-6 border-t border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-3">8. Data Protection Officer Contact</h2>
              <p className="mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or your data sovereignty, please contact our Data Protection Officer:
              </p>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700 space-y-1">
                <p className="font-semibold text-neutral-900">InsightResume Data Governance Team</p>
                <p>Email: <a href="mailto:privacy@insightresume.ai" className="text-primary-600 hover:underline">privacy@insightresume.ai</a></p>
                <p>Address: 548 Market Street, Suite 48201, San Francisco, CA 94104</p>
                <p>Response SLA: Within 48 business hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
