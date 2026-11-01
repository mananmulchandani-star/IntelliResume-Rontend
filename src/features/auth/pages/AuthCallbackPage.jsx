import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabase';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import { Spinner } from '../../../components/ui';
import { Sparkles, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function AuthCallbackPage() {
  const [error, setError] = useState(null);
  const { getDefaultRoute } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          if (mounted) {
            navigate(getDefaultRoute(), { replace: true });
          }
        } else {
          // Listen once for auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user && mounted) {
              subscription.unsubscribe();
              navigate(getDefaultRoute(), { replace: true });
            }
          });

          // Timeout fallback after 6 seconds
          setTimeout(() => {
            if (mounted) {
              subscription.unsubscribe();
              navigate(ROUTES.LOGIN, { replace: true });
            }
          }, 6000);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Authentication callback failed.');
        }
      }
    };

    handleCallback();

    return () => {
      mounted = false;
    };
  }, [navigate, getDefaultRoute]);

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-xl border border-neutral-200 shadow-sm text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">Authentication Failed</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">{error}</p>
          <Button variant="primary" size="sm" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white mx-auto shadow-sm animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-sm font-semibold text-neutral-900">Finalizing Authentication...</h2>
        <p className="text-xs text-neutral-400">Verifying session and redirecting to your workspace</p>
        <div className="pt-2 flex justify-center">
          <Spinner size="md" />
        </div>
      </div>
    </div>
  );
}
