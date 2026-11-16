import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import { currentUser } from "@/lib/server/auth";
export const metadata = { title: "Choose a new password · UniSpot" };
export default async function Page() { return <Suspense><AuthForm mode="reset" canReset={!!(await currentUser())} /></Suspense>; }
