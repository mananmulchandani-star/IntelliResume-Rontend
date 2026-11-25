// src/constants/validationData.js

/**
 * Standard Country Codes Dictionary for Mobile Number Validation
 */
export const COUNTRY_CODES = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', minDigits: 10, maxDigits: 10, regex: /^[6-9]\d{9}$/, placeholder: '98765 43210' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10, regex: /^[2-9]\d{9}$/, placeholder: '(555) 019-2834' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10, regex: /^[2-9]\d{9}$/, placeholder: '(416) 555-0199' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 11, regex: /^7\d{9}$|^[1-9]\d{9,10}$/, placeholder: '7911 123456' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', minDigits: 9, maxDigits: 9, regex: /^5\d{8}$/, placeholder: '50 123 4567' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', minDigits: 8, maxDigits: 8, regex: /^[89]\d{7}$/, placeholder: '8123 4567' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', minDigits: 9, maxDigits: 9, regex: /^4\d{8}$/, placeholder: '412 345 678' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 11, regex: /^1[5-7]\d{8,9}$/, placeholder: '151 23456789' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9, regex: /^[67]\d{8}$/, placeholder: '6 12 34 56 78' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', minDigits: 9, maxDigits: 9, regex: /^5\d{8}$/, placeholder: '50 123 4567' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', minDigits: 10, maxDigits: 10, regex: /^[789]0\d{8}$/, placeholder: '90 1234 5678' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', minDigits: 11, maxDigits: 11, regex: /^1[3-9]\d{9}$/, placeholder: '138 0013 8000' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', minDigits: 10, maxDigits: 11, regex: /^[1-9]{2}9?\d{8}$/, placeholder: '11 98765-4321' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦', minDigits: 9, maxDigits: 9, regex: /^[6-8]\d{8}$/, placeholder: '71 234 5678' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', minDigits: 9, maxDigits: 9, regex: /^6\d{8}$/, placeholder: '6 12345678' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭', minDigits: 9, maxDigits: 9, regex: /^7[5-9]\d{7}$/, placeholder: '79 123 45 67' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪', minDigits: 9, maxDigits: 9, regex: /^7[02369]\d{7}$/, placeholder: '70 123 45 67' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪', minDigits: 9, maxDigits: 9, regex: /^8[35-9]\d{7}$/, placeholder: '85 123 4567' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', minDigits: 8, maxDigits: 10, regex: /^2\d{7,9}$/, placeholder: '21 123 4567' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', minDigits: 9, maxDigits: 10, regex: /^1[0-9]\d{7,8}$/, placeholder: '12 345 6789' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', minDigits: 10, maxDigits: 10, regex: /^9[78]\d{8}$/, placeholder: '9841 234567' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', minDigits: 10, maxDigits: 10, regex: /^1[3-9]\d{8}$/, placeholder: '1712 345678' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', minDigits: 10, maxDigits: 10, regex: /^3\d{9}$/, placeholder: '300 1234567' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', minDigits: 9, maxDigits: 9, regex: /^7\d{8}$/, placeholder: '71 234 5678' },
  { code: 'GLOBAL', name: 'International / Other', dialCode: '+', flag: '🌐', minDigits: 7, maxDigits: 15, regex: /^\d{7,15}$/, placeholder: '1234567890' },
];

/**
 * Accredited Academic Courses & Degree Options
 */
export const DEGREE_OPTIONS = [
  { value: 'BCA', label: 'Bachelor of Computer Applications (BCA)', group: 'Undergraduate' },
  { value: 'B.Tech - CSE', label: 'B.Tech - Computer Science & Engineering', group: 'Undergraduate' },
  { value: 'B.Tech - IT', label: 'B.Tech - Information Technology', group: 'Undergraduate' },
  { value: 'B.Tech - AI & DS', label: 'B.Tech - Artificial Intelligence & Data Science', group: 'Undergraduate' },
  { value: 'B.Tech - Cyber Security', label: 'B.Tech - Cyber Security & Forensics', group: 'Undergraduate' },
  { value: 'B.Tech - ECE', label: 'B.Tech - Electronics & Communication Engineering', group: 'Undergraduate' },
  { value: 'B.Sc - Computer Science', label: 'B.Sc - Computer Science', group: 'Undergraduate' },
  { value: 'B.Sc - Information Technology', label: 'B.Sc - Information Technology', group: 'Undergraduate' },
  { value: 'B.Sc - Data Science', label: 'B.Sc - Data Science & Mathematics', group: 'Undergraduate' },
  { value: 'BBA - Analytics/IT', label: 'BBA - Information Systems & Business Analytics', group: 'Undergraduate' },
  { value: 'B.Des - UI/UX', label: 'B.Des - Interaction Design & UI/UX', group: 'Undergraduate' },

  { value: 'MCA', label: 'Master of Computer Applications (MCA)', group: 'Postgraduate' },
  { value: 'M.Tech - CSE', label: 'M.Tech - Computer Science & Engineering', group: 'Postgraduate' },
  { value: 'M.Tech - AI & ML', label: 'M.Tech - Artificial Intelligence & Machine Learning', group: 'Postgraduate' },
  { value: 'M.Sc - Computer Science', label: 'M.Sc - Computer Science', group: 'Postgraduate' },
  { value: 'M.Sc - Data Science', label: 'M.Sc - Data Science & Big Data Analytics', group: 'Postgraduate' },
  { value: 'MBA - Tech Management', label: 'MBA - Technology Management & Systems', group: 'Postgraduate' },

  { value: 'Integrated BCA-MCA', label: 'Integrated BCA-MCA (5 Years Dual Degree)', group: 'Integrated' },
  { value: 'Integrated B.Tech-M.Tech', label: 'Integrated B.Tech-M.Tech (Dual Degree)', group: 'Integrated' },
  { value: 'Diploma - CSE', label: 'Polytechnic Diploma in Computer Science & Engineering', group: 'Diploma' },
  { value: 'Diploma - IT', label: 'Polytechnic Diploma in Information Technology', group: 'Diploma' },
  { value: 'PGDCA', label: 'Post Graduate Diploma in Computer Applications (PGDCA)', group: 'Diploma' },
  { value: 'CUSTOM', label: 'Other Accredited Degree / Program...', group: 'Other' },
];

/**
 * Standard Academic Streams & Specializations
 */
export const STREAM_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Big Data Engineering',
  'Cyber Security & Digital Forensics',
  'Cloud Computing & DevOps',
  'Full Stack Software Development',
  'Electronics & Communication Engineering',
  'Human-Computer Interaction (HCI) & UI/UX',
  'Applied Mathematics & Computing',
  'Business Analytics & Information Systems',
  'General Computer Applications',
];

/**
 * Helper to parse a full phone number into { dialCode, nationalNumber }
 */
export function parsePhoneNumber(rawPhone, defaultCountryCode = '+91') {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { country: COUNTRY_CODES[0], nationalNumber: '' };
  }

  const clean = rawPhone.trim();
  // Check if starts with one of our dial codes
  for (const c of COUNTRY_CODES) {
    if (c.dialCode !== '+' && clean.startsWith(c.dialCode)) {
      const rest = clean.slice(c.dialCode.length).trim().replace(/[^\d]/g, '');
      return { country: c, nationalNumber: rest };
    }
  }

  // If starts with +, search best match
  if (clean.startsWith('+')) {
    const sorted = [...COUNTRY_CODES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (clean.startsWith(c.dialCode)) {
        const rest = clean.slice(c.dialCode.length).trim().replace(/[^\d]/g, '');
        return { country: c, nationalNumber: rest };
      }
    }
  }

  // Default fallback
  const fallbackCountry = COUNTRY_CODES.find((c) => c.dialCode === defaultCountryCode) || COUNTRY_CODES[0];
  const digitsOnly = clean.replace(/[^\d]/g, '');
  return { country: fallbackCountry, nationalNumber: digitsOnly };
}

/**
 * Alphabet-only regex (letters A-Z / a-z separated by spaces; no digits or symbols)
 */
const ALPHABET_SPACE_REGEX = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

/**
 * Comprehensive Validation Engine
 */
export const validators = {
  /**
   * Validate full legal name
   * Rules: Required, min 2 chars, max 70 chars, alphabets (A-Z) and spaces only
   */
  fullName: (value, fieldLabel = 'Full name') => {
    if (!value || !value.trim()) {
      return `${fieldLabel} is required.`;
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return `${fieldLabel} must be at least 2 characters.`;
    }
    if (trimmed.length > 70) {
      return `${fieldLabel} cannot exceed 70 characters.`;
    }
    if (!ALPHABET_SPACE_REGEX.test(trimmed)) {
      return `${fieldLabel} must contain alphabets (A-Z) and spaces only (no numbers or special characters).`;
    }
    return null;
  },

  /**
   * Validate target role / job title / position
   * Rules: Alphabets (A-Z) and spaces only, min 2 chars, max 80 chars
   */
  role: (value, fieldLabel = 'Target role', { required = true } = {}) => {
    if (!value || !value.trim()) {
      return required ? `${fieldLabel} is required.` : null;
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return `${fieldLabel} must be at least 2 characters.`;
    }
    if (trimmed.length > 80) {
      return `${fieldLabel} cannot exceed 80 characters.`;
    }
    if (!ALPHABET_SPACE_REGEX.test(trimmed)) {
      return `${fieldLabel} must contain alphabets (A-Z) and spaces only (no numbers or special characters).`;
    }
    return null;
  },

  /**
   * Validate a full phone string (including dial code prefix if present)
   */
  phoneFull: (rawPhone, required = true) => {
    if (!rawPhone || !rawPhone.trim()) {
      return required ? 'Mobile contact number is required.' : null;
    }
    const { country, nationalNumber } = parsePhoneNumber(rawPhone);
    return validators.phone(nationalNumber, country.dialCode);
  },

  /**
   * Strict RFC-5322 Compliant Email Validation
   */
  email: (value) => {
    if (!value || !value.trim()) {
      return 'Email address is required.';
    }
    const trimmed = value.trim();
    // RFC-5322 robust pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid, active email address (e.g., student@university.edu).';
    }
    if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) {
      return 'Email address contains invalid consecutive or edge dots.';
    }
    return null;
  },

  /**
   * Mobile Number validation against Country Code rules
   */
  phone: (nationalNumber, countryCode = '+91') => {
    if (!nationalNumber || !nationalNumber.trim()) {
      return 'Mobile contact number is required.';
    }
    const digits = nationalNumber.replace(/\D/g, '');
    const country = COUNTRY_CODES.find((c) => c.dialCode === countryCode) || COUNTRY_CODES[0];

    if (digits.length === 0) {
      return 'Please enter valid digits for your mobile number.';
    }

    if (country.code === 'IN') {
      if (digits.length !== 10) {
        return `Indian mobile numbers must be exactly 10 digits (currently ${digits.length}).`;
      }
      if (!/^[6-9]/.test(digits)) {
        return 'Indian mobile numbers must start with 6, 7, 8, or 9.';
      }
    } else if (country.code === 'US' || country.code === 'CA') {
      if (digits.length !== 10) {
        return `US/Canada numbers must be exactly 10 digits (currently ${digits.length}).`;
      }
    } else if (country.minDigits && country.maxDigits) {
      if (digits.length < country.minDigits || digits.length > country.maxDigits) {
        return `Phone number for ${country.name} must be between ${country.minDigits} and ${country.maxDigits} digits.`;
      }
    } else {
      if (digits.length < 7 || digits.length > 15) {
        return 'Mobile number must contain between 7 and 15 digits according to international standards.';
      }
    }

    return null;
  },

  /**
   * Validate Degree selection / input
   */
  degree: (degreeValue) => {
    if (!degreeValue || !degreeValue.trim()) {
      return 'Degree / Course program is required.';
    }
    const trimmed = degreeValue.trim();
    if (trimmed.length < 2) {
      return 'Degree name must be at least 2 characters.';
    }
    return null;
  },

  /**
   * Validate Academic Stream / Specialization
   */
  stream: (streamValue) => {
    if (!streamValue || !streamValue.trim()) {
      return 'Academic stream / branch is required.';
    }
    const trimmed = streamValue.trim();
    if (trimmed.length < 2) {
      return 'Academic stream must be at least 2 characters.';
    }
    return null;
  },

  /**
   * Validate College / Institution Name
   */
  institution: (instValue) => {
    if (!instValue || !instValue.trim()) {
      return 'College / University name is required.';
    }
    const trimmed = instValue.trim();
    if (trimmed.length < 3) {
      return 'College name must be at least 3 characters.';
    }
    return null;
  },

  /**
   * Validate CGPA or Score
   */
  gpa: (gpaValue) => {
    if (!gpaValue || !gpaValue.toString().trim()) {
      return null; // Optional unless required by workflow
    }
    const trimmed = gpaValue.toString().trim();
    const match = trimmed.match(/^(\d+(?:\.\d+)?)(?:\s*(?:\/\s*(?:10(?:\.0+)?|4(?:\.0+)?|100)|%|CGPA|GPA))?(?:\s+(?:CGPA|GPA))?(?:\s*\/\s*(?:CGPA|GPA))?$/i);
    if (!match) {
      return 'CGPA / Score must be a valid numerical value (e.g., 8.85, 8.85 / 10.0, or 85%).';
    }
    const num = parseFloat(match[1]);
    if (isNaN(num) || num < 0 || num > 100) {
      return 'CGPA must be between 0.0 and 10.0 (or percentage 0 to 100%).';
    }
    return null;
  },

  /**
   * Validate Year or Duration
   */
  year: (yearValue) => {
    if (!yearValue || !yearValue.toString().trim()) {
      return 'Graduation year or academic duration is required.';
    }
    const trimmed = yearValue.toString().trim();
    // E.g. 2026 or 2022 - 2026
    const yearPattern = /^(?:19|20)\d{2}(?:\s*-\s*(?:19|20)\d{2})?$/;
    if (!yearPattern.test(trimmed)) {
      return 'Please enter a valid 4-digit year (e.g. 2026) or range (e.g. 2022 - 2026).';
    }
    return null;
  },

  /**
   * Validate Skills Array or Comma Separated String
   */
  skills: (skillsData) => {
    let arr = [];
    if (Array.isArray(skillsData)) {
      arr = skillsData.map((s) => s.trim()).filter(Boolean);
    } else if (typeof skillsData === 'string') {
      arr = skillsData.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (arr.length < 3) {
      return `Please provide at least 3 core technical skills for ATS compliance (currently ${arr.length}).`;
    }
    const tooShort = arr.filter((s) => s.length < 2);
    if (tooShort.length > 0) {
      return `Each skill competency must be at least 2 characters long (invalid: "${tooShort[0]}").`;
    }
    return null;
  },

  /**
   * Validate Work Experience Entry
   */
  experienceEntry: (entry) => {
    const errors = {};
    if (!entry.company || !entry.company.trim()) {
      errors.company = 'Company / Organization name is required.';
    }
    const posErr = validators.role(entry.position || entry.jobTitle, 'Position / Role');
    if (posErr) {
      errors.position = posErr;
    }
    if (entry.description && entry.description.trim().length > 0 && entry.description.trim().length < 15) {
      errors.description = 'Experience bullet point should be at least 15 characters to explain your contribution.';
    }
    return errors;
  },

  /**
   * Validate Project Entry
   */
  projectEntry: (entry) => {
    const errors = {};
    if (!entry.title || !entry.title.trim()) {
      errors.title = 'Project title is required.';
    }
    if (!entry.description || entry.description.trim().length < 15) {
      errors.description = 'Project description must be at least 15 characters to satisfy ATS technical parsing.';
    }
    if (!entry.technologies || !entry.technologies.trim()) {
      errors.technologies = 'Please list at least one technology/tool used in this project.';
    }
    return errors;
  },
};
