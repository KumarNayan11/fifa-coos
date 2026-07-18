"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, AlertCircle, FileText } from "lucide-react";
import { askVolunteerCopilotAction, AskVolunteerCopilotState } from "../actions";

const initialState: AskVolunteerCopilotState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-12 h-10 px-0">
      <Send className="w-4 h-4" />
      <span className="sr-only">Send</span>
    </Button>
  );
}

export function VolunteerCopilotPanel() {
  const [state, formAction] = useActionState(askVolunteerCopilotAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.data) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="flex flex-col h-full min-h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Volunteer Copilot
        </CardTitle>
        <CardDescription>Ask policy and operational questions</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {!state.success && !state.error && !state.data && (
          <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground h-full">
            <Bot className="w-12 h-12 mb-4 opacity-20" />
            <p>How can I help you today?</p>
            <p className="text-sm opacity-70 mt-2">
              Try asking about lost child procedures, ticket validation, or medical emergencies.
            </p>
          </div>
        )}

        {state.error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="text-sm">{state.error}</div>
          </div>
        )}

        {state.success && state.data && (
          <div className="flex flex-col gap-4">
            {/* The response */}
            <div className="flex gap-3 text-sm bg-muted/50 p-4 rounded-lg">
              <Bot className="w-6 h-6 text-primary shrink-0" />
              <div className="flex flex-col gap-3">
                <div className="whitespace-pre-wrap leading-relaxed">{state.data.answer}</div>

                {state.data.referencedArticles && state.data.referencedArticles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t">
                    <span className="text-xs text-muted-foreground flex items-center h-5">
                      Sources:
                    </span>
                    {state.data.referencedArticles.map((slug) => (
                      <Badge key={slug} variant="secondary" className="text-xs font-normal gap-1">
                        <FileText className="w-3 h-3" />
                        {slug}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <form ref={formRef} action={formAction} className="flex w-full items-center gap-2">
          <Input
            name="question"
            placeholder="Ask a question..."
            className="flex-1 h-10"
            required
            autoComplete="off"
          />
          <SubmitButton />
        </form>
      </CardFooter>
    </Card>
  );
}
