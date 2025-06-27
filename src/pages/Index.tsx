
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Youtube, Sparkles, History, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SummaryCard from "@/components/SummaryCard";
import HistoryPanel from "@/components/HistoryPanel";

interface Summary {
  id: string;
  videoUrl: string;
  videoTitle: string;
  summary: string;
  language: string;
  model: string;
  createdAt: string;
}

const Index = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('english');
  const [model, setModel] = useState('groq');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const { toast } = useToast();

  const validateYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return regex.test(url);
  };

  const generateSummary = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setCurrentSummary(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 800);

      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('summarize-video', {
        body: {
          videoUrl,
          language,
          model,
        },
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        throw new Error(error.message || 'Failed to generate summary');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentSummary(data);
      
      // Add to summaries list
      setSummaries(prev => [data, ...prev]);

      toast({
        title: "Summary generated successfully!",
        description: `Generated summary using Groq AI`,
      });

    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error generating summary",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Youtube className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              YouTube AI Summarizer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform any YouTube video into concise, intelligent summaries using Groq AI
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="max-w-4xl mx-auto mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Generate Summary
            </CardTitle>
            <CardDescription>
              Enter a YouTube URL and customize your summary preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">YouTube URL</label>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <Select value={model} onValueChange={setModel} disabled={isLoading}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groq">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Groq Llama
                        <Badge variant="secondary" className="text-xs">Lightning Fast</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {progress < 30 ? 'Extracting video transcript...' : 
                   progress < 70 ? 'Processing with Groq AI...' : 
                   'Finalizing summary...'} {Math.round(progress)}%
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={generateSummary}
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
                className="h-12 px-6"
              >
                <History className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Summary */}
        {currentSummary && (
          <div className="max-w-4xl mx-auto mb-8">
            <SummaryCard summary={currentSummary} />
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="max-w-4xl mx-auto">
            <HistoryPanel 
              summaries={summaries} 
              onSelectSummary={setCurrentSummary}
            />
          </div>
        )}

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 bg-white/50 border-0 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Youtube className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Real YouTube Integration</h3>
            <p className="text-sm text-gray-600">
              Automatically extracts video transcripts and processes them with AI
            </p>
          </Card>
          
          <Card className="text-center p-6 bg-white/50 border-0 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Groq AI Powered</h3>
            <p className="text-sm text-gray-600">
              Lightning-fast AI summaries using state-of-the-art Llama models
            </p>
          </Card>
          
          <Card className="text-center p-6 bg-white/50 border-0 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <History className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart History</h3>
            <p className="text-sm text-gray-600">
              Keep track of all your summaries with intelligent local storage
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
