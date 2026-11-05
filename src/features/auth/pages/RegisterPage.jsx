import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import { ROLES, ROLE_DEFAULT_ROUTES } from '../../../constants/roles';
import { Button, Input, Card, CardContent, CardFooter, Select } from '../../../components/ui';
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
  const [degree, setDegree] = useState('');
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
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!name.trim() || !email.trim() || !password) {
      setFormError('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    // Role-specific validation
    if (selectedRole === ROLES.STUDENT && (!college.trim() || !degree.trim())) {
      setFormError('Please provide your college name and degree program.');
      return;
    }

    if (
      (selectedRole === ROLES.UNIVERSITY_ADMIN || selectedRole === ROLES.COMPANY_RECRUITER) &&
      !organizationName.trim()
    ) {
      setFormError('Please provide your institution / company organization name.');
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
        degree: selectedRole === ROLES.STUDENT ? degree.trim() : undefined,
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
                  label={selectedRole === ROLES.STUDENT ? 'Full Name' : 'Contact Person Full Name'}
                  type="text"
                  placeholder={selectedRole === ROLES.STUDENT ? 'Alex Morgan' : 'Dr. Sarah Jenkins'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                  required
                />
                <Input
                  label="Contact Phone Number"
                  type="tel"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4 text-neutral-400" />}
                />
              </div>

              {/* Student Role Fields */}
              {selectedRole === ROLES.STUDENT && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="College / University Name"
                      placeholder="e.g. Stanford University"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      leftIcon={<Building2 className="w-4 h-4 text-neutral-400" />}
                      required
                    />
                    <Input
                      label="Degree & Branch"
                      placeholder="e.g. B.Tech Computer Science"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      leftIcon={<GraduationCap className="w-4 h-4 text-neutral-400" />}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Graduation Year"
                      placeholder="2026"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                    />
                    <Input
                      label="CGPA / GPA"
                      placeholder="3.85 or 8.9"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                    <Input
                      label="City, State"
                      placeholder="e.g. San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
                    />
                  </div>

                  <Input
                    label="Primary Career Interest / Target Role"
                    placeholder="e.g. Full Stack Software Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
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
                      onChange={(e) => setOrganizationName(e.target.value)}
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
                      onChange={(e) => setOrganizationName(e.target.value)}
                      leftIcon={<Building2 className="w-4 h-4 text-neutral-400" />}
                      required
                    />
                    <Input
                      label="Designation / Recruiter Title"
                      placeholder="e.g. Head of University Recruiting"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
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
                      ? 'alex@university.edu'
                      : selectedRole === ROLES.UNIVERSITY_ADMIN
                      ? 'placements@university.edu'
                      : 'recruiting@company.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
