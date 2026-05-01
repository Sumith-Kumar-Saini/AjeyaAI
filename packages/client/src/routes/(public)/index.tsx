import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/(public)/")({
  component: RouteComponent,
});

const features = [
  {
    title: "Upload Feedback",
    description: "Paste or upload CSV / TXT files in seconds.",
  },
  {
    title: "Ask AI Anything",
    description: "Single-turn Q&A to prioritize features.",
  },
  {
    title: "Structured Insights",
    description: "Feature ideas, UI/UX suggestions, engineering tasks.",
  },
];

const steps = [
  {
    title: "1. Upload",
    description: "Paste or upload your customer feedback.",
  },
  {
    title: "2. Ask AI",
    description: "Type your question and let the AI analyze.",
  },
  {
    title: "3. Decide",
    description: "Accept, reject, or stay neutral on AI suggestions.",
  },
];

const testimonials = [
  { name: "Maya, PM", text: "Ajeya_AI helped me plan our roadmap in minutes!" },
  { name: "Arjun, CTO", text: "Saved our engineering team hours every week." },
];

const faqs = [
  {
    q: "What file types are supported?",
    a: ".txt and .csv files, max 1MB each.",
  },
  {
    q: "Is AI multi-turn supported?",
    a: "Post-MVP only; hackathon MVP is single-turn.",
  },
  {
    q: "Can I track feedback?",
    a: "Yes! Accept/Reject/Neutral buttons persist in history.",
  },
];

function RouteComponent() {
  return (
    <div className="flex flex-col gap-24 px-6 md:px-16 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-6xl font-bold">
          Ajeya_AI — Your AI Product Co-Pilot
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Upload customer feedback, ask AI, get actionable feature ideas and
          roadmap suggestions.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Start for Free</Button>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { delay: i * 0.2 } },
            }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>{f.title}</CardHeader>
              <CardContent>{f.description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* How It Works / Steps */}
      <section className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex-1"
          >
            <Card className="p-6 text-center">
              <Badge className="mb-2">{s.title}</Badge>
              <p>{s.description}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Demo / Screenshot Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6">See Ajeya_AI in Action</h2>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <img
              src="/demo-placeholder.png"
              alt="AI Result Demo"
              className="rounded-md shadow-md"
            />
          </Card>
        </motion.div>
      </motion.section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <Card className="p-6">
                <p className="mb-2 text-gray-700">"{t.text}"</p>
                <span className="font-semibold">{t.name}</span>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing / CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
            <p className="text-gray-600 mb-4">
              Up to 5 projects, 10 AI queries/day
            </p>
            <Button>Sign Up Free</Button>
          </Card>
          <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2">Pro Plan</h3>
            <p className="text-gray-600 mb-4">
              Unlimited projects, AI queries, history & priority support
            </p>
            <Button variant="outline">Contact Sales</Button>
          </Card>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-12">
        © {new Date().getFullYear()} Ajeya_AI. All rights reserved.
      </footer>
    </div>
  );
}
