import CreateCalendar from "@/components/CreateCalendar";
import { requirePageUser } from "@/lib/server/auth";

export const metadata = { title: "Create a Hub · UniSpot" };
export default async function Page() { await requirePageUser("/hubs/new"); return <CreateCalendar />; }
