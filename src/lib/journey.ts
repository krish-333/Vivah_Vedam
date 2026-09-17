import { subMonths } from "date-fns";
import type { InsertTables } from "@/types";

type JourneyTemplate = {
  stepType: string;
  title: string;
  description: string;
  monthsBefore: number;
};

const journeyTemplates: JourneyTemplate[] = [
  {
    stepType: "venue",
    title: "Book your venue",
    description: "Secure the venue first so the rest of your planning can align with the date.",
    monthsBefore: 10,
  },
  {
    stepType: "catering",
    title: "Finalize catering",
    description: "Shortlist menus, schedule tastings, and lock catering details.",
    monthsBefore: 8,
  },
  {
    stepType: "photography",
    title: "Hire photo and video team",
    description: "Confirm your photographers and videographers for full-day coverage.",
    monthsBefore: 7,
  },
  {
    stepType: "decor",
    title: "Plan decor and styling",
    description: "Set your visual theme, floral plan, and ceremony styling direction.",
    monthsBefore: 6,
  },
  {
    stepType: "music",
    title: "Book entertainment",
    description: "Book your live performers and DJ for ceremony and reception sets.",
    monthsBefore: 4,
  },
  {
    stepType: "finalization",
    title: "Run final confirmations",
    description: "Confirm vendor schedules, arrival windows, and final guest counts.",
    monthsBefore: 1,
  },
];

export function buildJourneySteps(weddingId: string, weddingDate: string) {
  const baseDate = new Date(weddingDate);

  return journeyTemplates.map((template, index) => ({
    wedding_id: weddingId,
    step_type: template.stepType,
    title: template.title,
    description: template.description,
    status: index === 0 ? "active" : "upcoming",
    order_index: index,
    recommended_deadline: subMonths(baseDate, template.monthsBefore).toISOString().slice(0, 10),
  })) satisfies InsertTables<"journey_steps">[];
}
