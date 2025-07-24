import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, Sparkles, ArrowLeft } from 'lucide-react';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link"
      });
    }
    setLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isValidPhoneNumber(phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const phoneNumber = parsePhoneNumber(phone);
      const formattedPhone = phoneNumber?.formatInternational();

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone!,
      });

      if (error) throw error;

      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Check your phone for the verification code"
      });
    } catch (error: any) {
      toast({
        title: "Phone sign up failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const phoneNumber = parsePhoneNumber(phone);
      const formattedPhone = phoneNumber?.formatInternational();

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone!,
        token: verificationCode,
        type: 'sms'
      });

      if (error) throw error;

      navigate('/');
      toast({
        title: "Welcome!",
        description: "Successfully verified and signed in"
      });
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple' | 'twitter') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const continueAsGuest = () => {
    // Generate a session ID for guest users
    const guestSessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestSessionId', guestSessionId);
    
    toast({
      title: "Welcome!",
      description: "You're browsing as a guest"
    });
    
    navigate('/');
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <Card className="w-full max-w-md mx-4 shadow-card bg-card/90 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
            <CardDescription>
              Enter the verification code sent to {phone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-center text-lg tracking-widest bg-background/50 border-primary/20"
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="cosmic" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setShowVerification(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="w-full max-w-md mx-4 space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-cosmic rounded-2xl flex items-center justify-center mb-6 animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Supa Artistry</h1>
          <p className="text-muted-foreground">Your AI-powered creative companion</p>
        </div>

        <Card className="shadow-card bg-card/90 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Tabs defaultValue="signin" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background/50 border-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-background/50 border-primary/20"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background/50 border-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-background/50 border-primary/20"
                          required
                          minLength={6}
                        />
                      </div>
                      <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="phone">
                <form onSubmit={handlePhoneSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-background/50 border-primary/20"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your phone number with country code
                    </p>
                  </div>
                  <Button type="submit" className="w-full" variant="cosmic" disabled={loading}>
                    {loading ? 'Sending code...' : 'Send Verification Code'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border-gray-300"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('facebook')}
                className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>

              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('apple')}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white border-black"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 8.025.044 8.025.044 8.025.044 7.394.088 6.57.347c-.825.259-1.458.63-2.09 1.263C3.847 2.244 3.476 2.877 3.217 3.702c-.259.825-.303 1.456-.303 1.456s-.044.371-.044 4.992v8.699c0 4.621.044 4.992.044 4.992s.044.631.303 1.456c.259.825.63 1.458 1.263 2.09.632.632 1.265 1.004 2.09 1.263.825.259 1.456.303 1.456.303s.371.044 4.992.044h8.699c4.621 0 4.992-.044 4.992-.044s.631-.044 1.456-.303c.825-.259 1.458-.63 2.09-1.263.632-.632 1.004-1.265 1.263-2.09.259-.825.303-1.456.303-1.456s.044-.371.044-4.992V8.025c0-4.621-.044-4.992-.044-4.992s-.044-.631-.303-1.456c-.259-.825-.63-1.458-1.263-2.09C19.484.854 18.851.482 18.026.223 17.201-.036 16.57-.08 16.57-.08S16.199-.124 11.578-.124L12.017 0zm-.761 6.956c2.206 0 3.995 1.789 3.995 3.995S13.462 14.946 11.256 14.946 7.261 13.157 7.261 10.951s1.789-3.995 3.995-3.995zm0 6.593c1.433 0 2.598-1.165 2.598-2.598S12.689 8.353 11.256 8.353 8.658 9.518 8.658 10.951s1.165 2.598 2.598 2.598zm5.094-6.85c0 .515-.417.932-.932.932s-.932-.417-.932-.932.417-.932.932-.932.932.417.932.932z"/>
                </svg>
                Apple
              </Button>

              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn('twitter')}
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white border-black"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                𝕏
              </Button>
            </div>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-6" 
              onClick={continueAsGuest}
            >
              Continue as Guest
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;