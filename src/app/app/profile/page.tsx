import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { user } = await getSession();

  if (!user) redirect("/");

  return <div>ProfilePage</div>;
}
