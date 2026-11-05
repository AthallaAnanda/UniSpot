import { BookOpen, BriefcaseBusiness, Globe2, GraduationCap, HeartHandshake, Lightbulb, Trophy, UsersRound } from "lucide-react";
import type { CategoryId } from "@/types/unispot";
const icons = { events: Lightbulb, scholarships: GraduationCap, workshops: BookOpen, competitions: Trophy, volunteering: HeartHandshake, career: BriefcaseBusiness, exchange: Globe2, communities: UsersRound };
export default function CategoryIcon({ category, size = 25 }: { category: CategoryId; size?: number }) {
  const Icon = icons[category];
  return <Icon size={size} strokeWidth={1.65} aria-hidden="true" />;
}
