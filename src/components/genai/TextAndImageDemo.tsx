import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, Send, ImageIcon, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TextAndImageDemoProps {
  apiKey: string;
  vertexai: boolean;
}

const TextAndImageDemo = ({ apiKey, vertexai }: TextAndImageDemoProps) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
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
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Image Required",
        description: "Please select an image to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate multimodal generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const simulatedResponse = `Multimodal Analysis:\n\nPrompt: "${prompt}"\nImage: ${selectedFile.name}\n\nBased on the image and your prompt, here's what I can tell you:\n\nThis is a simulated response that would combine the visual understanding of your uploaded image with the text prompt you provided. In a real implementation with Google's Gemini AI, this would provide sophisticated analysis combining both visual and textual understanding.\n\nThe AI would be able to:\n• Describe what's in the image\n• Answer questions about the image\n• Generate content based on both the image and text prompt\n• Create creative responses combining visual and textual context`;
      
      setResponse(simulatedResponse);
      
      toast({
        title: "Content Generated",
        description: "Multimodal content generated successfully!"
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
        <div className="w-12 h-12 bg-gradient-cosmic rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Multimodal Generation</h3>
        <p className="text-muted-foreground">
          Combine text and images for rich AI responses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Text Input */}
        <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="multimodal-prompt">Your Prompt</Label>
              <Textarea
                id="multimodal-prompt"
                placeholder="Describe what you see in this image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-background/50 border-primary/20 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {!selectedFile ? (
                <>
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium mb-2">Upload Image</p>
                    <p className="text-sm text-muted-foreground">
                      Select an image to analyze
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    {previewUrl && (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-primary/20"
                      />
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={clearFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={loading}
        className="w-full"
        variant="cosmic"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Generate Response
          </>
        )}
      </Button>

      {response && (
        <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20">
          <CardContent className="pt-6">
            <Label className="text-sm font-medium text-foreground mb-3 block">
              AI Response:
            </Label>
            <div className="prose prose-sm max-w-none text-foreground">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {response}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextAndImageDemo;