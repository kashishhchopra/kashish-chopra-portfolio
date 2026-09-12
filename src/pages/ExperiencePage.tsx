import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import SystemLogTimeline from "@/components/SystemLogTimeline";

export default function ExperiencePage() {
  return (
    <>
      <Seo
        title="Experience"
        description="Career system log: AI & IT internships at HCL Tech and Indian Oil Corporation, university leadership roles, project deployments and education."
      />
      <SectionHeader eyebrow="/experience" title="Career System Log">
        Education, internships, leadership roles and project deployments as one chronological stream. Filter by
        source, or expand any entry for the detail.
      </SectionHeader>
      <SystemLogTimeline />
    </>
  );
}
