import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, MessageSquare, Image, Upload, Video, Settings } from 'lucide-react';
import GenerateContentText from './genai/GenerateContentText';
import ImageUploadDemo from './genai/ImageUploadDemo';
import TextAndImageDemo from './genai/TextAndImageDemo';
import VideoGenerationDemo from './genai/VideoGenerationDemo';

interface GenAIDemoProps {
  sessionId: string | null;
}

const GenAIDemo = ({ sessionId }: GenAIDemoProps) => {
  const [apiKey, setApiKey] = useState('');
  const [vertexai, setVertexai] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to your AI Creative Studio
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {sessionId ? `Session ID: ${sessionId}` : 'No active session'}
        </p>
      </div>

      {/* Configuration */}
      <Card className="shadow-card bg-card/90 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration
          </CardTitle>
          <CardDescription>
            Set up your Google AI credentials to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apikey">Google AI API Key</Label>
            <div className="relative">
              <Input
                id="apikey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google AI API key"
                className="bg-background/50 border-primary/20 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Backend Configuration</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="false"
                  checked={!vertexai}
                  onChange={() => setVertexai(false)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Gemini Developer API</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="true"
                  checked={vertexai}
                  onChange={() => setVertexai(true)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Vertex AI API</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features */}
      <Card className="shadow-card bg-card/90 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle>AI Features</CardTitle>
          <CardDescription>
            Explore the power of Google's Gemini AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="multimodal" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Multimodal
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <GenerateContentText apiKey={apiKey} vertexai={vertexai} />
            </TabsContent>

            <TabsContent value="upload">
              <ImageUploadDemo apiKey={apiKey} vertexai={vertexai} />
            </TabsContent>

            <TabsContent value="multimodal">
              <TextAndImageDemo apiKey={apiKey} vertexai={vertexai} />
            </TabsContent>

            <TabsContent value="video">
              <VideoGenerationDemo apiKey={apiKey} vertexai={vertexai} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenAIDemo;