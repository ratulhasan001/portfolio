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
import { SectionConnector } from "@/components/section-connector";
import { MascotDirector } from "@/components/mascot";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main className="flex-1">
        <Hero />
        <SectionConnector />
        <ResearchSection />
        <SectionConnector />
        <EducationSection />
        <SectionConnector />
        <ExperienceSection />
        <SectionConnector />
        <SkillsSection />
        <SectionConnector />
        <ProjectsSection />
        <SectionConnector />
        <ReferencesSection />
      </main>
      <NameOutro />
      <MascotDirector />
    </>
  );
}
