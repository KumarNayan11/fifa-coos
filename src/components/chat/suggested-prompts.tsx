/**
 * FIFACoOS — Suggested Prompt Cards Component
 *
 * Pre-defined prompt suggestions displayed as polished cards.
 * Clicking sends the prompt directly to the chat.
 */

export interface PromptCard {
  title: string;
  description: string;
  prompt: string;
  icon: string | React.ReactNode;
}

export interface SuggestedPromptsProps {
  cards: readonly PromptCard[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

/**
 * Quick action buttons for common queries, displayed as premium cards.
 */
export function SuggestedPrompts({ cards, onSelect, disabled = false }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto text-left">
      {cards.map((card) => (
        <button
          key={card.title}
          type="button"
          onClick={() => onSelect(card.prompt)}
          disabled={disabled}
          className="flex flex-col items-start gap-1 rounded-xl border bg-white p-4 text-left transition-all hover:border-primary/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              {card.icon}
            </span>
            <span className="font-semibold text-gray-900">{card.title}</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">{card.description}</span>
        </button>
      ))}
    </div>
  );
}
