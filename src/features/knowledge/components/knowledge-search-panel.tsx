"use client";

import { useState } from "react";
import { searchKnowledgeAction } from "../actions";
import { KnowledgeSearchResult } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Loader2, ChevronLeft } from "lucide-react";

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
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Results
            </Button>
          </div>
          <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
          <CardDescription>
            Category: {selectedArticle.category} | Version: {selectedArticle.version} | Last
            Updated: {new Date(selectedArticle.updated_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Search</CardTitle>
        <CardDescription>Search for policies, procedures, and SOPs.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="E.g. Lost child, medical emergency..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </form>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="space-y-4">
          {results.length === 0 && !loading && !error && (
            <div className="text-center text-gray-500 py-8">
              No results found. Enter a search term to begin.
            </div>
          )}

          {results.map((result) => (
            <div
              key={result.id}
              className="border rounded-lg p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all"
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
