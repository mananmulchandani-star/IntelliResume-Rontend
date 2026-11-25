import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import { ROLES, ROLE_DEFAULT_ROUTES } from '../../../constants/roles';
import { Button, Input, Card, CardContent, CardFooter, Select } from '../../../components/ui';
import PhoneInputWithCountry from '../../../components/ui/PhoneInputWithCountry';
import { DEGREE_OPTIONS, validators } from '../../../constants/validationData';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building2,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  FileBadge,
  Users as UsersIcon,
  Award,
} from 'lucide-react';
import clsx from 'clsx';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);

  // Common account fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Student specific profile
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('BCA');
  const [customDegree, setCustomDegree] = useState('');
  const [isCustomDegree, setIsCustomDegree] = useState(false);
  const [gradYear, setGradYear] = useState('2026');
  const [cgpa, setCgpa] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // University & Recruiter specific organization fields
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [taxId, setTaxId] = useState('');
  const [industry, setIndustry] = useState('Software, SaaS & Artificial Intelligence');
  const [companySize, setCompanySize] = useState('50-250');
  const [accreditationBoard, setAccreditationBoard] = useState('NAAC A++ / Tier-1 NIRF');
  const [batchCapacity, setBatchCapacity] = useState('1500');

  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, role, signUp, getDefaultRoute } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      const activeRole = role || (user.email === 'ceo@insight.in' ? ROLES.PLATFORM_ADMIN : ROLES.STUDENT);
      const targetRoute = ROLE_DEFAULT_ROUTES[activeRole] || getDefaultRoute();
      navigate(targetRoute, { replace: true });
    }
  }, [user, role, navigate, getDefaultRoute]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    setSuccessMessage('');

    const errors = {};

    // Validate Full Name
    const nameErr = validators.fullName(name, 'Full name');
    if (nameErr) errors.name = nameErr;

    // Validate Email
    const emailErr = validators.email(email);
    if (emailErr) errors.email = emailErr;

    // Validate Phone (optional at signup, validated against selected country if entered)
    if (phone) {
      const phoneErr = validators.phoneFull(phone, false);
      if (phoneErr) errors.phone = phoneErr;
    }

    // Validate Password
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    // Role-specific validation
    const effectiveDegree = isCustomDegree ? customDegree : degree;
    if (selectedRole === ROLES.STUDENT) {
      const degreeErr = validators.degree(effectiveDegree);
      if (degreeErr) errors.degree = degreeErr;

      const collegeErr = validators.institution(college);
      if (collegeErr) errors.college = collegeErr;

      if (targetRole) {
        const targetRoleErr = validators.role(targetRole, 'Target role', { required: false });
        if (targetRoleErr) errors.targetRole = targetRoleErr;
      }

      if (cgpa) {
        const gpaErr = validators.gpa(cgpa);
        if (gpaErr) errors.cgpa = gpaErr;
      }
      if (gradYear) {
        const yearErr = validators.year(gradYear);
        if (yearErr) errors.gradYear = yearErr;
      }
    }

    if (
      (selectedRole === ROLES.UNIVERSITY_ADMIN || selectedRole === ROLES.COMPANY_RECRUITER) &&
      (!organizationName || organizationName.trim().length < 3)
    ) {
      errors.organizationName = 'Please provide a valid institution / company organization name (min 3 chars).';
    }

    if (selectedRole === ROLES.COMPANY_RECRUITER && department) {
      const roleErr = validators.role(department, 'Designation / Recruiter Title', { required: false });
      if (roleErr) errors.department = roleErr;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('Please resolve the highlighted fields to ensure your account is verified and legit.');
      return;
    }

    try {
      setLoading(true);

      const metadata = {
        name: name.trim(),
        role: selectedRole,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,

        // Student details
        college: selectedRole === ROLES.STUDENT ? college.trim() : undefined,
        degree: selectedRole === ROLES.STUDENT ? effectiveDegree.trim() : undefined,
        gradYear: selectedRole === ROLES.STUDENT ? gradYear : undefined,
        grad_year: selectedRole === ROLES.STUDENT ? gradYear : undefined,
        cgpa: selectedRole === ROLES.STUDENT ? cgpa.trim() : undefined,
        targetRole: selectedRole === ROLES.STUDENT ? targetRole.trim() : undefined,
        target_role: selectedRole === ROLES.STUDENT ? targetRole.trim() : undefined,

        // University & Company details
        organization: organizationName.trim() || undefined,
        department: department.trim() || undefined,
        companyWebsite: companyWebsite.trim() || undefined,
        company_website: companyWebsite.trim() || undefined,
        taxId: selectedRole === ROLES.COMPANY_RECRUITER ? taxId.trim() : undefined,
        tax_id: selectedRole === ROLES.COMPANY_RECRUITER ? taxId.trim() : undefined,
        industry: selectedRole === ROLES.COMPANY_RECRUITER ? industry : undefined,
        companySize: selectedRole === ROLES.COMPANY_RECRUITER ? companySize : undefined,
        company_size: selectedRole === ROLES.COMPANY_RECRUITER ? companySize : undefined,
        accreditationBoard: selectedRole === ROLES.UNIVERSITY_ADMIN ? accreditationBoard : undefined,
        accreditation_board: selectedRole === ROLES.UNIVERSITY_ADMIN ? accreditationBoard : undefined,
        batchCapacity: selectedRole === ROLES.UNIVERSITY_ADMIN ? batchCapacity : undefined,
        batch_capacity: selectedRole === ROLES.UNIVERSITY_ADMIN ? batchCapacity : undefined,
      };

      await signUp(email.trim(), password, metadata);
      setSuccessMessage('Account created successfully! Redirecting to workspace...');
      setTimeout(() => {
        navigate(ROLE_DEFAULT_ROUTES[selectedRole] || ROUTES.STUDENT_DASHBOARD, { replace: true });
      }, 1000);
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-neutral-900">
            Insight<span className="text-primary-600">Resume</span>
          </span>
        </Link>
        <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Create your verified account
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Join thousands of candidates, placement cells, and recruiters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <Card className="shadow-md border-neutral-200">
          <CardContent className="pt-6">
            {/* Role Switcher Pill */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-neutral-700 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.STUDENT)}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-all',
                    selectedRole === ROLES.STUDENT
                      ? 'bg-white text-primary-700 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.UNIVERSITY_ADMIN)}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-all',
                    selectedRole === ROLES.UNIVERSITY_ADMIN
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>University</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(ROLES.COMPANY_RECRUITER)}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-md transition-all',
                    selectedRole === ROLES.COMPANY_RECRUITER
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  )}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>Recruiter</span>
                </button>
              </div>
            </div>

            {/* Status alerts */}
            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-slide-down">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Primary Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={selectedRole === ROLES.STUDENT ? 'Full Legal Name' : 'Contact Person Full Name'}
                  type="text"
                  placeholder={selectedRole === ROLES.STUDENT ? 'e.g. Manan Mulchandani' : 'e.g. Sarah Jenkins'}
                  helperText="Alphabets (A-Z) and spaces only."
                  value={name}
                  error={fieldErrors.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    setFieldErrors((prev) => ({
                      ...prev,
                      name: validators.fullName(val, 'Full name'),
                    }));
                  }}
                  leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                  required
                />
                <PhoneInputWithCountry
                  label="Contact Mobile Number"
                  value={phone}
                  error={fieldErrors.phone}
                  onChange={(val) => {
                    setPhone(val);
                    setFieldErrors((prev) => ({ ...prev, phone: null }));
                  }}
                />
              </div>

              {/* Student Role Fields */}
              {selectedRole === ROLES.STUDENT && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="College / University Name"
                      placeholder="e.g. Medi-Caps University, Indore"
                      value={college}
                      error={fieldErrors.college}
                      onChange={(e) => {
                        setCollege(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, college: null }));
                      }}
                      leftIcon={<Building2 className="w-4 h-4 text-neutral-400" />}
                      required
                    />
                    <div className="space-y-1.5">
                      <Select
                        label="Degree / Course Program"
                        value={isCustomDegree ? 'CUSTOM' : degree}
                        error={fieldErrors.degree}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'CUSTOM') {
                            setIsCustomDegree(true);
                          } else {
                            setIsCustomDegree(false);
                            setDegree(val);
                          }
                          setFieldErrors((prev) => ({ ...prev, degree: null }));
                        }}
                        options={DEGREE_OPTIONS.map((d) => ({
                          value: d.value,
                          label: `${d.label} (${d.group})`,
                        }))}
                      />
                      {isCustomDegree && (
                        <Input
                          placeholder="Enter custom accredited degree (e.g. BCA Cloud Computing)"
                          value={customDegree}
                          error={fieldErrors.degree}
                          onChange={(e) => {
                            setCustomDegree(e.target.value);
                            setFieldErrors((prev) => ({ ...prev, degree: null }));
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Graduation Year"
                      placeholder="2026"
                      value={gradYear}
                      error={fieldErrors.gradYear}
                      onChange={(e) => {
                        setGradYear(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, gradYear: null }));
                      }}
                    />
                    <Input
                      label="CGPA / GPA"
                      placeholder="8.85 or 85%"
                      value={cgpa}
                      error={fieldErrors.cgpa}
                      onChange={(e) => {
                        setCgpa(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, cgpa: null }));
                      }}
                    />
                    <Input
                      label="City, State"
                      placeholder="e.g. Indore, M.P."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
                    />
                  </div>

                  <Input
                    label="Primary Career Interest / Target Role"
                    placeholder="e.g. Full Stack Software Engineer"
                    helperText="Alphabets (A-Z) and spaces only."
                    value={targetRole}
                    error={fieldErrors.targetRole}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetRole(val);
                      setFieldErrors((prev) => ({
                        ...prev,
                        targetRole: validators.role(val, 'Target role', { required: false }),
                      }));
                    }}
                    leftIcon={<Briefcase className="w-4 h-4 text-neutral-400" />}
                  />
                </>
              )}

              {/* University Role Fields */}
              {selectedRole === ROLES.UNIVERSITY_ADMIN && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="University / Institution Name"
                      placeholder="e.g. State Institute of Technology"
                      value={organizationName}
                      error={fieldErrors.organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, organizationName: null }));
                      }}
                      leftIcon={<Building2 className="w-4 h-4 text-neutral-400" />}
                      required
                    />
                    <Input
                      label="Placement Cell / Department"
                      placeholder="e.g. Training & Placement Cell"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      leftIcon={<Briefcase className="w-4 h-4 text-neutral-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Official Campus Domain / Website"
                      placeholder="e.g. sit.edu or university.ac.in"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      leftIcon={<Globe className="w-4 h-4 text-neutral-400" />}
                    />
                    <Input
                      label="Campus Location (City, State)"
                      placeholder="e.g. Austin, TX"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Accreditation / Ranking Board
                      </label>
                      <Select
                        value={accreditationBoard}
                        onChange={(e) => setAccreditationBoard(e.target.value)}
                      >
                        <option value="NAAC A++ / Tier-1 NIRF">NAAC A++ / Tier-1 NIRF</option>
                        <option value="NBA Accredited Programs">NBA Accredited Programs</option>
                        <option value="UGC / AICTE Approved">UGC / AICTE Approved</option>
                        <option value="ABET / International Accredited">ABET / International Accredited</option>
                        <option value="Other / In Process">Other / In Process</option>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Annual Graduating Cohort Size
                      </label>
                      <Select
                        value={batchCapacity}
                        onChange={(e) => setBatchCapacity(e.target.value)}
                      >
                        <option value="500">500 Students</option>
                        <option value="1500">1,500 Students</option>
                        <option value="3500">3,500 Students</option>
                        <option value="6000">6,000+ Students</option>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Company Recruiter Role Fields */}
              {selectedRole === ROLES.COMPANY_RECRUITER && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Company / Enterprise Name"
                      placeholder="e.g. Stripe, Inc."
                      value={organizationName}
                      error={fieldErrors.organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                        setFieldErrors((prev) => ({ ...prev, organizationName: null }));
                      }}
                      leftIcon={<Building2 className="w-4 h-4 text-neutral-400" />}
                      required
                    />
                    <Input
                      label="Designation / Recruiter Title"
                      placeholder="e.g. Head of University Recruiting"
                      helperText="Alphabets (A-Z) and spaces only."
                      value={department}
                      error={fieldErrors.department}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDepartment(val);
                        setFieldErrors((prev) => ({
                          ...prev,
                          department: validators.role(val, 'Designation / Recruiter Title', { required: false }),
                        }));
                      }}
                      leftIcon={<Briefcase className="w-4 h-4 text-neutral-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Corporate Website / Domain"
                      placeholder="e.g. stripe.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      leftIcon={<Globe className="w-4 h-4 text-neutral-400" />}
                    />
                    <Input
                      label="Tax ID / CIN / Registration No."
                      placeholder="e.g. EIN / CIN-U72200MH..."
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      leftIcon={<FileBadge className="w-4 h-4 text-neutral-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Industry Sector
                      </label>
                      <Select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      >
                        <option value="Software, SaaS & Artificial Intelligence">Software & AI</option>
                        <option value="Banking, Fintech & Payments">Fintech & Payments</option>
                        <option value="E-commerce & Consumer Tech">E-commerce</option>
                        <option value="Consulting & Analytics">Consulting & Analytics</option>
                        <option value="Hardware & Core Engineering">Core Engineering</option>
                        <option value="Healthcare & Biotech">Healthcare</option>
                      </Select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Workforce Size
                      </label>
                      <Select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      >
                        <option value="1-50">1-50 (Startup)</option>
                        <option value="50-250">50-250 (Mid-Size)</option>
                        <option value="250-1000">250-1000 (Growth)</option>
                        <option value="1000+">1000+ (Enterprise)</option>
                      </Select>
                    </div>

                    <div className="sm:col-span-1">
                      <Input
                        label="Headquarters"
                        placeholder="e.g. San Francisco, CA"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Credentials */}
              <div className="border-t border-neutral-100 pt-3 space-y-3">
                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder={
                    selectedRole === ROLES.STUDENT
                      ? 'manan@medicaps.ac.in'
                      : selectedRole === ROLES.UNIVERSITY_ADMIN
                      ? 'placements@university.edu'
                      : 'recruiting@company.com'
                  }
                  value={email}
                  error={fieldErrors.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    setFieldErrors((prev) => ({ ...prev, email: validators.email(val) }));
                  }}
                  leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  error={fieldErrors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: null }));
                  }}
                  leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
                  helperText="Use at least 6 characters with a combination of letters and numbers."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-2"
              >
                Create Verified Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-neutral-100 bg-neutral-50/50 py-3.5">
            <p className="text-xs text-neutral-600">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
