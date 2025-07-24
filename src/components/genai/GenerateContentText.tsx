import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GenerateContentTextProps {
  apiKey: string;
  vertexai: boolean;
}

const GenerateContentText = ({ apiKey, vertexai }: GenerateContentTextProps) => {
  const [prompt, setPrompt] = useState('');
  const [modelResponse, setModelResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google AI API key first",
        variant: "destructive"
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate content",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Note: This is a simplified example. In a real app, you'd use the Google GenAI SDK
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedResponse = `Generated response for: "${prompt}"\n\nThis is a simulated response. To use real Google AI, install @google/genai package and implement the actual API calls as shown in your original code.`;
      
      setModelResponse(simulatedResponse);
      
      toast({
        title: "Content Generated",
        description: "Your AI content has been generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Text Generation</h3>
        <p className="text-muted-foreground">
          Generate compelling text content with AI
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Your Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Write a creative story about..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] bg-background/50 border-primary/20 resize-none"
          />
        </div>

        <Button 
          onClick={handleSend} 
          disabled={loading}
          className="w-full"
          variant="hero"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>

        {modelResponse && (
          <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20">
            <CardContent className="pt-6">
              <Label className="text-sm font-medium text-foreground mb-3 block">
                AI Response:
              </Label>
              <div className="prose prose-sm max-w-none text-foreground">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {modelResponse}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GenerateContentText;