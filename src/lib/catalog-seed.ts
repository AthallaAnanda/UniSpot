import data from "@/data/unispot.json";
import type { CalendarSocialLinks, CatalogData, Opportunity, PartnerCalendar } from "@/types/unispot";

const slugs: Record<string, string> = { gdg: "google-developer-groups", lpdp: "lpdp-scholarships", itb: "itb-campus", indorelawan: "indorelawan", google: "grow-with-google", erasmus: "erasmus-plus", kaggle: "kaggle" };
const colors: Record<string, string> = { gdg: "#428565", lpdp: "#45639b", itb: "#3074ad", indorelawan: "#d25a59", google: "#c69b42", erasmus: "#576aa5", kaggle: "#45a6c7" };
// Public social links extracted from each organization's official website.
const socialLinks: Record<string, CalendarSocialLinks> = {
  gdg: { instagram: "https://www.instagram.com/googlefordevs/", linkedin: "https://www.linkedin.com/showcase/googledevelopers/" },
  lpdp: { instagram: "https://www.instagram.com/LPDP_RI", tiktok: "https://www.tiktok.com/@lpdp_ri", linkedin: "https://www.linkedin.com/company/lembaga-pengelola-dana-pendidikan/" },
  itb: { instagram: "https://www.instagram.com/itb1920/", tiktok: "https://www.tiktok.com/@itbofficial" },
  indorelawan: { instagram: "https://instagram.com/indorelawan", tiktok: "https://tiktok.com/@indorelawan" },
};
export const seedCatalog: CatalogData = {
  organizations: data.organizations.map(organization => ({ ...organization, calendarSlug: slugs[organization.id] })),
  opportunities: data.opportunities.map(opportunity => ({ ...opportunity, calendarId: slugs[opportunity.organizationId] ? opportunity.organizationId : undefined })) as Opportunity[],
  calendars: data.organizations.filter(organization => slugs[organization.id]).map(organization => ({ id: organization.id, slug: slugs[organization.id], name: organization.name, description: organization.description, logo: organization.logo, color: colors[organization.id], website: organization.url, socialLinks: socialLinks[organization.id], organizationId: organization.id, curated: true, createdAt: "2026-11-04T00:00:00.000Z" })) as PartnerCalendar[],
};

export function calendarOrganization(calendar: PartnerCalendar) {
  return { id: calendar.organizationId, name: calendar.name, description: calendar.description, topic: "Community calendar", url: calendar.website || `/calendars/${calendar.slug}`, logo: calendar.logo, logoSource: calendar.logo, calendarSlug: calendar.slug };
}
