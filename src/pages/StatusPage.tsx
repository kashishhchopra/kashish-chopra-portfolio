import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import SystemStatus from "@/components/SystemStatus";

export default function StatusPage() {
  return (
    <>
      <Seo title="System Status" description="Live system dashboard: GitHub repositories, languages, activity and availability." />
      <SectionHeader eyebrow="/status" title="Live System Status">
        Real-time GitHub data and verified system metadata. No fabricated statistics.
      </SectionHeader>
      <SystemStatus />
    </>
  );
}
