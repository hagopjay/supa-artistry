import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSession } from '@/hooks/useSession';
import GenAIDemo from '@/components/GenAIDemo';
import { LogOut, User, Sparkles } from 'lucide-react';

const Index = () => {
  const { user, loading, signOut, hasSession, isAuthenticated, getSessionId } = useSession();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-cosmic rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg text-muted-foreground">Loading your creative space...</div>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-cosmic rounded-3xl flex items-center justify-center mb-8 animate-float mx-auto">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-cosmic bg-clip-text text-transparent">
            Supa Artistry
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Experience the future of AI-powered creativity. Generate stunning content with Google's Gemini AI.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="hero" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-cosmic rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Supa Artistry</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{user?.email || user?.phone}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Guest User</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GenAIDemo sessionId={getSessionId()} />
      </main>
    </div>
  );
};

export default Index;
