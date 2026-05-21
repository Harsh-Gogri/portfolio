import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectPage from "@/components/layout/ProjectPage";

export default async function WorkPage({ params }) {
  const { id } = await params;

  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  // Dynamically import the correct MDX file based on project id
  let Content;
  try {
    Content = (await import(`@/content/projects/${id}.mdx`)).default;
  } catch (error) {
    Content = () => <p>Content coming soon...</p>;
  }

  return (
    <ProjectPage project={project}>
      <Content />
    </ProjectPage>
  );
}

export function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}
