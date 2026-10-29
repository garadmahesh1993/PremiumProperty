import { notFound } from "next/navigation";
import { ExploreExperience, type SearchMode } from "../../components/ExploreExperience";
const modes = new Set<SearchMode>(["buy", "rent", "commercial", "pg", "plots"]);
export default async function ModeExplorePage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = await params;
  if (!modes.has(mode as SearchMode)) notFound();
  return <ExploreExperience initialMode={mode as SearchMode}/>;
}