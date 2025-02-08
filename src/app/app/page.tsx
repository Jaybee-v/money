import { ExpenseYearlyChart } from "@/components/charts/ExpenseYearlyChart";
import { UpcomingObligatoryExpenses } from "@/components/elements/UpcomingObligatoryExpenses";
import { getSession } from "@/lib/session";
import { CircleUserRound } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MainPage() {
  const { user } = await getSession();

  if (!user) redirect("/");

  return (
    <div className="space-y-4">
      <section className="p-6">
        <h1 className="flex items-baseline gap-2 text-lg">
          <CircleUserRound />
          <span className="flex gap-2 text-gray-700">Bonjour</span>
          <span className="font-semibold">{user.name}</span>
        </h1>
      </section>

      <section className="md:p-6">
        <UpcomingObligatoryExpenses user={user} />
      </section>
      <ExpenseYearlyChart user={user} />
    </div>
  );
}
