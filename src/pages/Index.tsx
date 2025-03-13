
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CodeEditor from "@/components/CodeEditor";
import TechnicalInsights from "@/components/TechnicalInsights";
import Resources from "@/components/Resources";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <Features />
      <CodeEditor />
      <TechnicalInsights />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
