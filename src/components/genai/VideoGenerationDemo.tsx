import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Play, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoGenerationDemoProps {
  apiKey: string;
  vertexai: boolean;
}

const VideoGenerationDemo = ({ apiKey, vertexai }: VideoGenerationDemoProps) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

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
        description: "Please enter a video prompt",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError('');
    setVideoUrl('');
    
    try {
      // Simulate video generation (this would take much longer in reality)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // For demo purposes, we'll show a placeholder message
      setError('');
      toast({
        title: "Video Generation Simulated",
        description: "This is a demo - real video generation requires Veo API access and significant processing time"
      });
      
      // In a real implementation, you would get a video URL here
      // setVideoUrl(actualVideoUrl);
      
    } catch (error: any) {
      setError(error.message || 'Video generation failed');
      toast({
        title: "Generation Failed",
        description: "Failed to generate video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-cosmic rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Video Generation (Veo)</h3>
        <p className="text-muted-foreground">
          Generate videos from text descriptions using Google's Veo model
        </p>
      </div>

      <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video-prompt">Video Description</Label>
            <Textarea
              id="video-prompt"
              placeholder="A serene sunset over a calm ocean with gentle waves..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-background/50 border-primary/20 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Describe the video you want to generate in detail
            </p>
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
                Generating Video... (This can take several minutes)
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Video
              </>
            )}
          </Button>

          {loading && (
            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Video generation in progress... This is a demo simulation.
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full animate-pulse w-1/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {videoUrl && (
            <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20">
              <CardContent className="pt-6">
                <Label className="text-sm font-medium text-foreground mb-3 block">
                  Generated Video:
                </Label>
                <video 
                  controls 
                  className="w-full rounded-lg border border-primary/20"
                  src={videoUrl}
                >
                  Your browser doesn't support video playback.
                </video>
              </CardContent>
            </Card>
          )}

          {!loading && !videoUrl && !error && (
            <Card className="bg-muted/30 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-cosmic rounded-full flex items-center justify-center mx-auto opacity-60">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Ready for Video Generation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Note: This is a demo interface. Real video generation with Google's Veo requires:
                    </p>
                    <ul className="text-xs text-muted-foreground text-left max-w-md mx-auto space-y-1">
                      <li>• Access to Google's Veo-2 model</li>
                      <li>• Significant processing time (minutes)</li>
                      <li>• Proper API integration</li>
                      <li>• Higher resource requirements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">Error: {error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoGenerationDemo;