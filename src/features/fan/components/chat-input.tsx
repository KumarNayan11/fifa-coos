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
import { Send } from "lucide-react";

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
    <div className="border-t bg-background p-3 sm:p-4">
      <div className="flex items-end gap-2">
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
            "flex-1 resize-none rounded-xl border bg-muted/50 px-4 py-3 text-sm",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          size="icon"
          aria-label="Send message"
          className="shrink-0 rounded-xl"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      {value.length > MAX_MESSAGE_LENGTH * 0.8 && (
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {value.length}/{MAX_MESSAGE_LENGTH}
        </p>
      )}
    </div>
  );
}
