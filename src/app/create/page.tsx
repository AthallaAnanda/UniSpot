import CreateOpportunity from "@/components/CreateOpportunity";
import { requirePageUser } from "@/lib/server/auth";

export default async function Page() { await requirePageUser("/create"); return <CreateOpportunity />; }
