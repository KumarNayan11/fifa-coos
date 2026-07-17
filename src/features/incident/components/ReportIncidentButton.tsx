"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateIncidentModal } from "./CreateIncidentModal";

export function ReportIncidentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Report Incident</Button>
      <CreateIncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
