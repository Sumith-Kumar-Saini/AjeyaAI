import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Feature13 } from "@/components/feature13";
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Database,
  History,
  Layers,
  Sparkles,
} from "lucide-react";
import { Testimonial10 } from "@/components/testimonial10";
import { Cta11 } from "@/components/cta11";
import LogoFull from "@/assets/images/logo-full.png";
import { Faq1 } from "@/components/faq1";
import { Footer2 } from "@/components/footer2";

export const Route = createFileRoute("/(public)/")({
  component: RouteComponent,
});

const features = [
  {
    icon: <Brain className="size-5" />,
    title: "AI-Powered Product Decisions",
    description:
      "Turn raw customer feedback into clear product direction. Ask a question and get structured, data-backed feature recommendations instantly.",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/1-16x9.jpg",
      alt: "AI product decision engine",
    },
    href: "#",
  },
  {
    icon: <Database className="size-5" />,
    title: "Unified Feedback Hub",
    description:
      "Upload interviews, support tickets, or CSVs into one place. Ajeya AI analyzes everything together—no more scattered insights.",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/2-16x9.jpg",
      alt: "Centralized feedback data",
    },
    href: "#",
  },
  {
    icon: <BarChart3 className="size-5" />,
    title: "Confidence Scored Insights",
    description:
      "Every recommendation comes with a confidence score, so you know what’s backed by strong signals vs weak patterns.",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/3-16x9.jpg",
      alt: "Confidence scoring",
    },
    href: "#",
  },
  {
    icon: <CheckCircle2 className="size-5" />,
    title: "Built-in Feedback Loop",
    description:
      "Accept or reject AI suggestions and shape future outputs. The system adapts to your product decisions over time.",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/4-16x9.jpg",
      alt: "Feedback loop system",
    },
    href: "#",
  },
  {
    icon: <Layers className="size-5" />,
    title: "Structured Output, Ready to Use",
    description:
      "Get feature ideas, justification, UI suggestions, and engineering tasks—organized and ready for your next sprint.",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/5-16x9.jpg",
      alt: "Structured AI output",
    },
    href: "#",
  },
  {
    icon: <History className="size-5" />,
    title: "Decisions You Can Revisit",
    description:
      "Track every AI analysis and your responses. Build a living history of product decisions and learn what works.",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/placeholder/images/6-16x9.jpg",
      alt: "Results history",
    },
    href: "#",
  },
];

const testimonial = {
  quote:
    "Ajeya AI completely changed how we prioritize features. Instead of debating opinions, we now rely on real signals from customer feedback, and the confidence scores make decision-making incredibly clear.",
  author: {
    name: "Arjun Mehta",
    role: "Head of Product, SaaS Startup",
    avatar: {
      src: "https://i.pravatar.cc/150?img=12",
      alt: "Arjun Mehta",
    },
  },
};

const cta = {
  heading: "Stop Guessing What to Build Next",
  description:
    "Turn real customer feedback into clear product decisions with AI-powered insights—so your team moves faster with confidence.",
  image: {
    src: LogoFull,
    alt: "Logo",
  },
  buttons: {
    primary: {
      text: "Get Started Free",
      url: "/sign-in",
    },
  },
  icon: <Sparkles className="size-4" strokeWidth={1.5} />,
};

const faq = {
  heading: "Frequently asked questions",
  items: [
    {
      id: "01",
      question: "How does Ajeya AI generate product recommendations?",
      answer:
        "It analyzes your uploaded customer feedback and identifies patterns to suggest features, complete with reasoning and structured outputs.",
    },
    {
      id: "02",
      question: "What kind of data can I upload?",
      answer:
        "You can upload interviews, support tickets, survey responses, or CSV files—anything that captures user feedback.",
    },
    {
      id: "03",
      question: "How accurate are the AI suggestions?",
      answer:
        "Each recommendation includes a confidence score so you can quickly judge how strong the underlying signals are.",
    },
    {
      id: "04",
      question: "Can I control or refine the AI output?",
      answer:
        "Yes, you can accept or reject suggestions, and the system learns from your decisions to improve future results.",
    },
    {
      id: "05",
      question: "Who is this product best suited for?",
      answer:
        "Ajeya AI is built for product managers, founders, and teams who want to make faster, data-backed product decisions.",
    },
    {
      id: "06",
      question: "How do I get started?",
      answer:
        "Simply create a project, upload your feedback data, and ask your first product question to get actionable insights.",
    },
  ],
};

const footerProps = {
  logo: {
    title: "Ajeya AI",
    alt: "Ajeya AI logo",
    url: "/",
    src: LogoFull,
  },
  description:
    "AI co-pilot for product decisions—analyze user feedback, uncover insights, and build smarter roadmaps with confidence.",
  sections: [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "AI Analysis", href: "/#ai-analysis" },
        { name: "Feedback Loop", href: "/#feedback-loop" },
        { name: "Roadmap Insights", href: "/#roadmap-insights" },
      ],
    },
    {
      title: "Platform",
      links: [
        { name: "Projects", href: "/projects" },
        { name: "Data Upload", href: "/data-upload" },
        { name: "AI Results", href: "/results" },
        { name: "History", href: "/history" },
        { name: "Admin Panel", href: "/admin" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/#docs" },
        { name: "API Reference", href: "/#api" },
        { name: "Guides", href: "/#guides" },
        { name: "Blog", href: "/#blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/#about" },
        { name: "Careers", href: "/#careers" },
        { name: "Contact", href: "/#contact" },
        { name: "Privacy Policy", href: "/#privacy" },
      ],
    },
  ],
  legal: [
    { name: "Terms of Service", href: "/#terms" },
    { name: "Privacy Policy", href: "/#privacy" },
  ],
  copyright: "© 2026 Ajeya AI. All rights reserved.",
};

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-24 px-6 md:px-16 py-12">
        {/* Hero Section */}
        <Hero />
        <Feature13
          features={features}
          heading="Build What Matters. Backed by Real Signals."
        />
        <div className="flex flex-col gap-24 max-w-7xl mx-auto">
          <Testimonial10 {...testimonial} />
          <Cta11 {...cta} />
          <Faq1 {...faq} />
        </div>
        <Footer2 {...footerProps} />
      </div>
    </>
  );
}
