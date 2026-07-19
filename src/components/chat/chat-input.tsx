"use client";

/**
 * FIFACoOS — Chat Input Component
 *
 * Text input with send button for the Fan Copilot.
 * Enforces character limit and provides keyboard accessibility.
 *
 * @see DEVELOPER_GUIDE.md §14 — Accessibility Guidelines
 */

import { useState, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAX_MESSAGE_LENGTH } from "@/config/constants";

export interface ChatInputProps {
  /** Called when the user submits a message */
  onSend: (message: string) => void;
  /** Whether the input should be disabled (e.g., during AI streaming) */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Chat input with send button.
 * Enter to send, Shift+Enter for newline.
 * Character limit enforced.
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask about the stadium...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_MESSAGE_LENGTH) {
      setValue(newValue);
    }

    // Auto-resize textarea
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  }, []);

  return (
    <div className="bg-white px-4 py-4 pb-6 sm:pb-8 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-20">
      <div className="mx-auto max-w-3xl relative flex items-end gap-2 bg-gray-50/50 rounded-2xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-inner">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          aria-label="Message input"
          className={cn(
            "flex-1 resize-none bg-transparent px-3 py-2 text-sm text-gray-900",
            "placeholder:text-gray-400",
            "focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          size="icon"
          aria-label="Send message"
          className="shrink-0 rounded-xl h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      {value.length > MAX_MESSAGE_LENGTH * 0.8 && (
        <p className="mt-2 text-center text-[10px] text-gray-400 font-medium">
          {value.length} / {MAX_MESSAGE_LENGTH} characters
        </p>
      )}
    </div>
  );
}
