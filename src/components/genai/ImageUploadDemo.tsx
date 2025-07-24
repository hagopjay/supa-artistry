import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, FileImage, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadDemoProps {
  apiKey: string;
  vertexai: boolean;
}

const ImageUploadDemo = ({ apiKey, vertexai }: ImageUploadDemoProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      setAnalysis('');
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google AI API key first",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to analyze",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      // Simulate image analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const simulatedAnalysis = `Image Analysis for "${selectedFile.name}":\n\n• Image dimensions: Detected automatically\n• Content: This appears to be a ${selectedFile.type.includes('jpeg') ? 'JPEG' : 'PNG'} image\n• File size: ${(selectedFile.size / 1024).toFixed(1)} KB\n\nThis is a simulated analysis. To use real Google AI vision capabilities, implement the actual Google GenAI vision API calls.`;
      
      setAnalysis(simulatedAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: "Image has been analyzed successfully!"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <FileImage className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Image Analysis</h3>
        <p className="text-muted-foreground">
          Upload and analyze images with AI
        </p>
      </div>

      <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {!selectedFile ? (
              <>
                <div className="w-16 h-16 bg-gradient-cosmic rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-medium mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG, and other image formats
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
                <div className="relative max-w-md mx-auto">
                  {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border border-primary/20"
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
                <div>
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={analyzing}
                  variant="cosmic"
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileImage className="w-4 h-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="shadow-card bg-background/50 backdrop-blur-sm border-primary/20">
          <CardContent className="pt-6">
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Analysis Results:
            </Label>
            <div className="prose prose-sm max-w-none text-foreground">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {analysis}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploadDemo;