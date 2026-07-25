import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ResearchSection } from "@/components/research-section";
import { ExperienceSection } from "@/components/experience-section";
import { EducationSection } from "@/components/education-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ContactSection } from "@/components/contact-section";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollRail } from "@/components/scroll-rail";
import { SectionConnector } from "@/components/section-connector";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <ScrollRail />
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
        <ContactSection />
      </main>
    </>
  );
}
