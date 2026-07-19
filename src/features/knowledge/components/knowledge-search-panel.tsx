"use client";

import { useState } from "react";
import { searchKnowledgeAction } from "../actions";
import { KnowledgeSearchResult } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function KnowledgeSearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KnowledgeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeSearchResult | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSelectedArticle(null);

    const response = await searchKnowledgeAction({ query });

    if (response.success && response.data) {
      setResults(response.data);
    } else {
      setError(response.error || "An error occurred");
    }

    setLoading(false);
  };

  if (selectedArticle) {
    return (
      <Card className="w-full h-full flex flex-col shadow-sm">
        <CardHeader className="pb-4 border-b shrink-0">
          <div className="flex items-center space-x-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
              <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              Back to Results
            </Button>
          </div>
          <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
          <CardDescription>
            Category: {selectedArticle.category} | Version: {selectedArticle.version} | Last
            Updated: {new Date(selectedArticle.updated_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded-md border">
              {selectedArticle.content_markdown}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col shadow-sm">
      <CardHeader className="shrink-0 border-b pb-4">
        <CardTitle>Knowledge Search</CardTitle>
        <CardDescription>Search for policies, procedures, and SOPs.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="E.g. Lost child, medical emergency..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" isLoading={loading}>
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </Button>
        </form>

        {error && (
          <div className="text-red-500 mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {results.length === 0 && !loading && !error && (
            <EmptyState
              icon={<Search className="h-12 w-12" aria-hidden="true" />}
              title="No knowledge articles found"
              description="Enter a search term to begin."
            />
          )}

          {results.map((result) => (
            <div
              key={result.id}
              className="border rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all bg-white"
              onClick={() => setSelectedArticle(result)}
            >
              <h3 className="font-semibold text-lg text-indigo-700">{result.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Category: {result.category}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
