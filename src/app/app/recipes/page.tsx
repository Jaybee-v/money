import { RecipePageView } from "@/components/pages/RecipePageView";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RecipesPage() {
  const { user } = await getSession();

  if (!user) {
    redirect("/");
  }

  return <RecipePageView userId={user.id} />;
}
