import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import SkillsMatrix from "@/components/SkillsMatrix";

export default function SkillsPage() {
  return (
    <>
      <Seo title="Skills" description="Capability matrix: programming, AI/ML, generative AI & RAG, frameworks, databases and tools." />
      <SectionHeader eyebrow="/skills" title="Capability Matrix">
        Skills grouped by domain with honest proficiency labels — no inflated scores.
      </SectionHeader>
      <SkillsMatrix />
    </>
  );
}
