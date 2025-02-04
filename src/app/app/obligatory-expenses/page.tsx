import { ObligatoryExpensePageView } from "@/components/pages/ObligatoryExpensePageView";
import { getSession } from "@/lib/session";

export default async function ObligatoryExpensesPage() {
  const { user } = await getSession();

  if (!user) return null;

  return <ObligatoryExpensePageView user={user} />;
}
