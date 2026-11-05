export type CategoryId = "events" | "scholarships" | "workshops" | "competitions" | "volunteering" | "career" | "exchange" | "communities";
export interface Opportunity {
  id: string;
  title: string;
  category: CategoryId;
  organizationId: string;
  description: string;
  location: string;
  city: string;
  format: "In person" | "Online" | "Hybrid" | "International";
  schedule: string;
  date?: string;
  endDate?: string;
  deadline?: string;
  fee: string;
  eligibility: string;
  benefits: string[];
  source: string;
  sourceName: string;
  actionLabel: string;
  image: string;
  imageSource?: string;
  imageFit?: "cover" | "contain";
  color: string;
  calendarId?: string;
  publishedAt?: string;
}
export interface Organization {
  id: string;
  name: string;
  description: string;
  topic: string;
  url: string;
  logo: string;
  logoSource: string;
  calendarSlug?: string;
}

export interface CalendarSocialLinks {
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
}

export interface PartnerCalendar {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  cover?: string;
  color: string;
  website: string;
  socialLinks?: CalendarSocialLinks;
  organizationId: string;
  curated: boolean;
  createdAt: string;
  canManage?: boolean;
}

export interface CatalogData {
  opportunities: Opportunity[];
  organizations: Organization[];
  calendars: PartnerCalendar[];
}

export interface ManagedOpportunity extends Opportunity {
  status: "draft" | "published";
  updatedAt: string;
}
