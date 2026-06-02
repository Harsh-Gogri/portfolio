import CaseStudyImage from "@/components/case-study/CaseStudyImage";
import LinksSection from "@/components/case-study/LinksSection";
import StatGrid from "@/components/case-study/StatGrid";
import CalloutBox from "@/components/case-study/CalloutBox";
import QuoteCard from "@/components/case-study/QuoteCard";
import ComparisonTable from "@/components/case-study/ComparisonTable";
import ImageGallery from "@/components/case-study/ImageGallery";
import Accordion from "@/components/case-study/Accordion";

export function useMDXComponents(components) {
  return {
    CaseStudyImage,
    LinksSection,
    StatGrid,
    CalloutBox,
    QuoteCard,
    ComparisonTable,
    ImageGallery,
    Accordion,
    ...components,
  };
}
