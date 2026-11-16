import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOpportunity, getOpportunityOrganization } from "@/lib/server/catalog-store";
import StandaloneEvent from "@/components/StandaloneEvent";
import { cache } from "react";

const findOpportunity = cache(getOpportunity);

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const opportunity = await findOpportunity(id);
  return { title: opportunity ? `${opportunity.title} · UniSpot` : "Opportunity not found · UniSpot", description: opportunity?.description };
}
export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = await findOpportunity(id);
  if (!opportunity) notFound();
  return <StandaloneEvent opportunity={opportunity} organization={await getOpportunityOrganization(opportunity)} />;
}
