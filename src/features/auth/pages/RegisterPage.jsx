import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import { ROLES, ROLE_DEFAULT_ROUTES } from '../../../constants/roles';
import { Button, Input, Card, CardContent, CardFooter, Select } from '../../../components/ui';
import { Sparkles, ArrowRight, Lock, Mail, User, Building2, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
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
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const metadata = {
        name: name.trim(),
        role: selectedRole,
        organization: organizationName.trim() || undefined,
        department: department.trim() || undefined,
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
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-neutral-900">
            Insight<span className="text-primary-600">Resume</span>
          </span>
        </Link>
        <h2 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Create your account
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Join thousands of candidates, placement cells, and recruiters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
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
              <Input
                label={selectedRole === ROLES.STUDENT ? 'Full Name' : 'Contact Person Name'}
                type="text"
                placeholder={selectedRole === ROLES.STUDENT ? 'Alex Morgan' : 'Dr. Sarah Jenkins'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-neutral-400" />}
                required
              />

              {/* Conditional role fields */}
              {selectedRole === ROLES.UNIVERSITY_ADMIN && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="University / Institution Name"
                    placeholder="e.g. Stanford University"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                  />
                  <Input
                    label="Department / Placement Cell"
                    placeholder="e.g. Training & Placement"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              )}

              {selectedRole === ROLES.COMPANY_RECRUITER && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Company / Employer Name"
                    placeholder="e.g. Stripe, Inc."
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                  />
                  <Input
                    label="Designation / Title"
                    placeholder="e.g. Technical Recruiter"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder={selectedRole === ROLES.STUDENT ? 'alex@university.edu' : 'recruiting@company.com'}
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

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-2"
              >
                Create Account
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
