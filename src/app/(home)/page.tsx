import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { HomePageProps } from "@/types";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: HomePageProps) {
  void trpc.categories.getMany.prefetch();
  const { categoryId } = await searchParams;
  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}
