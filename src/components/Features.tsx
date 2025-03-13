
import { Check, Code, Globe, Zap, BrainCircuit, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="group relative p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300">
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
      <Icon className="text-primary" size={22} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-foreground/70">{description}</p>
  </div>
);

const LanguageIcon = ({ name, color }: { name: string, color: string }) => (
  <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-semibold ${color}`}>
    {name}
  </div>
);

const Features = () => {
  const languages = [
    { name: 'JS', color: 'bg-yellow-500' },
    { name: 'PY', color: 'bg-blue-500' },
    { name: 'TS', color: 'bg-blue-600' },
    { name: 'C++', color: 'bg-purple-500' },
    { name: 'RB', color: 'bg-red-500' },
    { name: 'GO', color: 'bg-cyan-500' },
    { name: 'RS', color: 'bg-orange-500' },
    { name: 'JV', color: 'bg-amber-700' },
  ];

  return (
    <section id="features" className="py-20 px-6 md:px-12 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Advanced Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Key Features of Smart CodeLab</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Explore the powerful features that make Smart CodeLab the ideal environment for modern development.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Globe} 
            title="Multi-Language Support" 
            description="Code in Python, JavaScript, TypeScript, C++, Java, Rust and many more languages all in one place."
          />
          <FeatureCard 
            icon={Zap} 
            title="Real-Time Execution" 
            description="Run your code instantly with our cloud-based compilation system, no setup required."
          />
          <FeatureCard 
            icon={BrainCircuit} 
            title="AI-Powered Suggestions" 
            description="Get intelligent code recommendations, bug fixes and optimizations as you type."
          />
          <FeatureCard 
            icon={Code} 
            title="Advanced Editor Features" 
            description="Enjoy syntax highlighting, autocomplete, linting and more powered by the Monaco editor."
          />
          <FeatureCard 
            icon={Users} 
            title="Collaboration Tools" 
            description="Code together in real-time with teammates, perfect for pair programming and reviews."
          />
          <FeatureCard 
            icon={Check} 
            title="Secure Environment" 
            description="All code executes in isolated containers for maximum security and reliability."
          />
        </div>
        
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-4">Supported Languages</h3>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Smart CodeLab supports a wide range of programming languages to meet all your development needs.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {languages.map((lang, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <LanguageIcon name={lang.name} color={lang.color} />
              </div>
            ))}
            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">+10</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
