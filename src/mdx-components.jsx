import CaseStudyImage from "@/components/case-study/CaseStudyImage";
import LinksSection from "@/components/case-study/LinksSection";

export function useMDXComponents(components) {
  return {
    CaseStudyImage,
    LinksSection,
    ...components,
  };
}
