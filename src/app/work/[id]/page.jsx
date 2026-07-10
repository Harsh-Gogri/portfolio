import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectPage from "@/components/layout/ProjectPage";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Harsh Gogri`,
    description: project.description,
    alternates: {
      canonical: `https://www.harshgogri.com/work/${project.id}`,
    },
    openGraph: {
      title: `${project.title} — Harsh Gogri`,
      description: project.description,
      url: `https://www.harshgogri.com/work/${project.id}`,
      images: [
        {
          url: project.image,
          alt: `${project.title} by Harsh Gogri`,
        },
      ],
    },
    twitter: {
      title: `${project.title} — Harsh Gogri`,
      description: project.description,
      images: [project.image],
    },
  };
}

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
