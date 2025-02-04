import { ExpensePageView } from "@/components/pages/ExpensePageView";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ExpensesPage() {
  const { user } = await getSession();

  if (!user) {
    redirect("/");
  }

  return <ExpensePageView user={user} />;
}
