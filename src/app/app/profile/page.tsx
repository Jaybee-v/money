import { UpdatePasswordCard } from "@/components/elements/UpdatePasswordCard";
import { UpdateProfileCard } from "@/components/elements/UpdateProfileCard";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { user } = await getSession();

  if (!user) redirect("/");

  return (
    <div>
      <h1>Mes paramètres</h1>
      <section className="flex gap-4">
        <UpdateProfileCard user={user} />
        <UpdatePasswordCard user={user} />
      </section>
    </div>
  );
}
