
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Youtube, Trash2 } from "lucide-react";

interface Summary {
  id: string;
  videoUrl: string;
  videoTitle: string;
  summary: string;
  language: string;
  model: string;
  createdAt: string;
}

interface HistoryPanelProps {
  summaries: Summary[];
  onSelectSummary: (summary: Summary) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ summaries, onSelectSummary }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSummaries = summaries.filter(summary =>
    summary.videoTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    summary.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Summary History
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredSummaries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {summaries.length === 0 ? (
              <div>
                <Youtube className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No summaries yet</p>
                <p className="text-sm">Generate your first summary to see it here</p>
              </div>
            ) : (
              <div>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No summaries found</p>
                <p className="text-sm">Try adjusting your search query</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSummaries.map((summary) => (
              <div
                key={summary.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => onSelectSummary(summary)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {summary.videoTitle}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {summary.summary.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {summary.language}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {summary.model}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(summary.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete logic here
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
