import { ObligatoryRecipesPageView } from "@/components/pages/ObligatoryRecipesPageView";
import { getSession } from "@/lib/session";

export default async function ObligatoryRecipes() {
  const { user } = await getSession();

  if (!user) return null;
  return <ObligatoryRecipesPageView user={user} />;
}
