import { getSession } from "@/lib/session";

export default async function Home() {
  const { user } = await getSession();

  if (!user) return null;

  return <div className="">{user.name}</div>;
}
