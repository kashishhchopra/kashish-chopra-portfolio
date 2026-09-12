import Seo from "@/components/Seo";
import SectionHeader from "@/components/SectionHeader";
import FileExplorer from "@/components/FileExplorer";

export default function ExplorerPage() {
  return (
    <>
      <Seo
        title="File Explorer"
        description="Browse the portfolio as a filesystem — projects, skills, experience and contact as navigable files."
      />
      <SectionHeader eyebrow="/explorer" title="File Explorer">
        Every section of this portfolio, mounted as a directory tree. Arrow keys move, → expands, ⏎ opens.
      </SectionHeader>
      <FileExplorer />
    </>
  );
}
