import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import ContactTerminal from "@/components/ContactTerminal";

export default function ContactPage() {
  return (
    <>
      <Seo title="Contact" description="Contact Kashish Chopra by email, LinkedIn or GitHub, or send a message." />
      <SectionHeader eyebrow="/contact" title="Contact Terminal">
        Reach out via any channel below, or send a message directly.
      </SectionHeader>
      <ContactTerminal />
    </>
  );
}
