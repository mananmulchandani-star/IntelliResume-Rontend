import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import { ROLE_DEFAULT_ROUTES } from '../../../constants/roles';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const { login, loginWithGoogle, getDefaultRoute, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const authRes = await login(cleanEmail, password);
      const targetRoute = (authRes?.role && ROLE_DEFAULT_ROUTES[authRes.role]) || redirectTarget || getDefaultRoute();
      navigate(targetRoute, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError('');
    try {
      setOauthLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setFormError(err.message || 'Google authentication failed.');
      setOauthLoading(false);
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
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Access your student workspace, applications, and AI career tools.
        </p>
      </div>

      {/* Auth Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="shadow-md border-neutral-200">
          <CardContent className="pt-6">
            {formError && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={handleGoogleLogin}
              loading={oauthLoading}
              className="flex items-center justify-center gap-2 mb-5 font-medium"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-3 text-neutral-400 font-semibold tracking-wider">
                  or sign in with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-neutral-400" />}
                required
              />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-700">Password</label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-neutral-400" />}
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
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-neutral-100 bg-neutral-50/50 py-3.5">
            <p className="text-xs text-neutral-600">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-primary-600 hover:text-primary-700 font-semibold">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Security badge note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <Shield className="w-3.5 h-3.5 text-neutral-400" />
          <span>Encrypted authentication powered by Supabase & OAuth 2.0</span>
        </div>
      </div>
    </div>
  );
}
