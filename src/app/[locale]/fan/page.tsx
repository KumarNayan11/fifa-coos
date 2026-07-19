import Link from "next/link";
import { MessageSquare, Map, Clock, HelpCircle } from "lucide-react";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { STADIUM } from "@/features/fan/data/stadium";

export default function FanLandingPage() {
  return (
    <Container className="py-8 pb-12 sm:py-12">
      <PageHeader
        title={`Welcome to ${STADIUM.name}`}
        description="Your intelligent stadium companion. Find your way, check wait times, and get real-time answers."
        actions={
          <Link
            href="/fan/copilot"
            className={buttonVariants({ size: "lg", className: "w-full gap-2 sm:w-auto" })}
          >
            <MessageSquare className="h-5 w-5" />
            Start Copilot Chat
          </Link>
        }
      />

      <Section id="features" title="How Copilot can help you" className="mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="mb-2 w-fit rounded-lg bg-primary/10 p-2 text-primary">
                <Map className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ask for directions to gates, restrooms, or your favorite food vendors. We&apos;ll show
              you the fastest route.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="mb-2 w-fit rounded-lg bg-primary/10 p-2 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Wait Times</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Check real-time wait times for concessions and merch stands to avoid missing the
              action on the pitch.
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="mb-2 w-fit rounded-lg bg-primary/10 p-2 text-primary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Instant Answers</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Lost? Need medical help? Want to know what you can bring inside? Just ask the Copilot.
            </CardContent>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
