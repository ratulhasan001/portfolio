import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ResearchSection } from "@/components/research-section";
import { ExperienceSection } from "@/components/experience-section";
import { EducationSection } from "@/components/education-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ReferencesSection } from "@/components/references-section";
import { NameOutro } from "@/components/name-outro";
import { ScrollProgress } from "@/components/scroll-progress";
import { MascotDirector } from "@/components/mascot";
import { homeJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      {/* `<` is escaped so no string in data.ts can close the script tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ScrollProgress />
      <Nav />
      <main className="flex-1">
        <Hero />
        <ResearchSection />
        <EducationSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ReferencesSection />
      </main>
      <NameOutro />
      <MascotDirector />
    </>
  );
}
