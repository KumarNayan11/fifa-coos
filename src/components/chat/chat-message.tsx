/**
 * FIFACoOS — Shared Chat Message Component
 *
 * Renders a single generic chat message bubble.
 * Includes markdown parsing, avatar rendering, and a copy button.
 * Renders optional `footer` below the text.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bot, User, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatMessageData } from "./chat-types";

export interface ChatMessageProps {
  message: ChatMessageData;
}

/**
 * Basic markdown text parser supporting headings, bold, unordered lists, and ordered lists.
 */
function parseBasicMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];

  let currentList: { type: "ul" | "ol"; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type;
      result.push(
        <ListTag
          key={`list-${result.length}`}
          className={cn(
            "pl-5 my-2 space-y-1",
            currentList.type === "ul" ? "list-disc" : "list-decimal",
          )}
        >
          {currentList.items}
        </ListTag>,
      );
      currentList = null;
    }
  };

  const parseInline = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      result.push(<div key={`br-${i}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();
      result.push(
        <h3 key={`h3-${i}`} className="text-sm font-bold text-gray-900 mt-3 mb-1">
          {parseInline(trimmed.slice(4))}
        </h3>,
      );
      return;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      result.push(
        <h2 key={`h2-${i}`} className="text-base font-bold text-gray-900 mt-4 mb-2">
          {parseInline(trimmed.slice(3))}
        </h2>,
      );
      return;
    }
    if (trimmed.startsWith("# ")) {
      flushList();
      result.push(
        <h1 key={`h1-${i}`} className="text-lg font-bold text-gray-900 mt-5 mb-2">
          {parseInline(trimmed.slice(2))}
        </h1>,
      );
      return;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (currentList?.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(<li key={`li-${i}`}>{parseInline(trimmed.slice(2))}</li>);
      return;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (currentList?.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(<li key={`li-${i}`}>{parseInline(olMatch[2])}</li>);
      return;
    }

    flushList();
    result.push(
      <p key={`p-${i}`} className="my-1">
        {parseInline(line)}
      </p>,
    );
  });

  flushList();
  return result;
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <article
      className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}
      role="article"
      aria-label={`${isUser ? "You" : "Assistant"} said`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-1">
          <Bot className="h-5 w-5" />
        </div>
      )}

      <div
        className={cn(
          "flex w-full max-w-[85%] flex-col gap-2",
          isUser ? "items-end" : "items-start",
          "sm:max-w-[75%]",
        )}
      >
        <div className="relative group flex items-start gap-2">
          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white border border-gray-100 text-gray-700 shadow-sm",
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="whitespace-pre-wrap">{parseBasicMarkdown(message.content)}</div>
            )}

            <time
              className={cn(
                "mt-2 block text-[10px] uppercase font-medium tracking-wider",
                isUser ? "text-primary-foreground/70 text-right" : "text-gray-400",
              )}
              dateTime={message.timestamp.toISOString()}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>

          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0"
              onClick={handleCopy}
              aria-label="Copy response"
              title="Copy response"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          )}
        </div>

        {/* Generic Footer Rendering */}
        {message.footer && (
          <div className="mt-1 flex flex-col gap-2 w-full max-w-sm">{message.footer}</div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 mt-1">
          <User className="h-5 w-5" />
        </div>
      )}
    </article>
  );
}
