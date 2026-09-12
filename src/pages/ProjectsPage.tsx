import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import ProjectDatabase from "@/components/ProjectDatabase";
import { portfolio } from "@/data/portfolio";

export default function ProjectsPage() {
  return (
    <>
      <Seo title="Projects" description={`${portfolio.projects.length} projects by ${portfolio.identity.realName} across AI/ML, generative AI, computer vision and web development.`} />
      <SectionHeader eyebrow="/projects" title="Project Mission Database">
        {portfolio.projects.length} projects across AI/ML, generative AI, computer vision and web development.
        Every one has a full case study with an interactive architecture diagram and the engineering decisions
        behind it — filter by category below.
      </SectionHeader>
      <ProjectDatabase />
    </>
  );
}
