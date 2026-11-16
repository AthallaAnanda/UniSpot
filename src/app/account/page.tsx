import AccountPage from "@/components/AccountPage";
import { requirePageUser } from "@/lib/server/auth";

export default async function Page() { await requirePageUser("/account"); return <AccountPage />; }
