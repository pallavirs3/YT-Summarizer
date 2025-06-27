
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Summary {
  id: string;
  videoUrl: string;
  videoTitle: string;
  summary: string;
  language: string;
  model: string;
  createdAt: string;
}

interface SummaryCardProps {
  summary: Summary;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary.summary);
      toast({
        title: "Copied to clipboard",
        description: "Summary has been copied to your clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  const formatSummary = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a header (starts with ##, #, or **text**)
      if (paragraph.startsWith('## ') || paragraph.startsWith('# ')) {
        const headerText = paragraph.replace(/^#{1,2}\s/, '');
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-6 mb-3 first:mt-0">
            {headerText}
          </h3>
        );
      }
      
      // Check if it's a bold line
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const boldText = paragraph.slice(2, -2);
        return (
          <p key={index} className="font-semibold text-gray-800 mb-3">
            {boldText}
          </p>
        );
      }
      
      // Check if it contains bullet points
      if (paragraph.includes('• ') || paragraph.includes('- ')) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700">
                {item.replace(/^[•-]\s/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2">
              {summary.videoTitle}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">
                {summary.language}
              </Badge>
              <Badge variant="outline">
                {summary.model}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {new Date(summary.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-gray-50"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-gray max-w-none">
          {formatSummary(summary.summary)}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href={summary.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
          >
            Watch Original Video
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
