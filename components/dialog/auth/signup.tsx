// components/auth/RegisterDialog.tsx
'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

// Simulated auth functions - Replace with actual Firebase auth
const handleEmailSignup = async (email: string, password: string, name: string) => {
  console.log('Signup:', { email, password, name });
  // Add Firebase signup logic here
};

const handleGoogleAuth = async () => {
  console.log('Google Auth');
  // Add Google sign-in logic here
};

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginClick: () => void;
}

export function RegisterDialog({ open, onOpenChange, onLoginClick }: RegisterDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    setIsLoading(true);
    try {
      await handleEmailSignup(email, password, name);
      setSuccess(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setAgreeTerms(false);
        setSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold  text-center">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Join BiteLoop and start ordering delicious food
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Google Sign Up */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full gap-2 h-11"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="register-name" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-name"
                type="text"
                placeholder="John Doe"
                className="pl-9 h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="register-email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                className="pl-9 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="register-password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                className="pl-9 h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-2 pt-1">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              disabled={isLoading}
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground leading-tight cursor-pointer"
            >
              I agree to BiteLoop's{' '}
              <Link href="/terms" className="text-red-500 hover:underline">
                Terms of Service
              </Link>
              ,{' '}
              <Link href="/privacy" className="text-red-500 hover:underline">
                Privacy Policy
              </Link>
              {' '}and{' '}
              <Link href="/content-policy" className="text-red-500 hover:underline">
                Content Policies
              </Link>
            </label>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 text-green-700 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-sm">
                Account created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full h-11 bg-red-500" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              className="text-red-500 hover:underline font-medium"
              onClick={() => {
                onOpenChange(false);
                onLoginClick();
              }}
            >
              Login
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}