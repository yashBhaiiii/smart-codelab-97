
import { ArrowRight, FileText, Github, BookOpen, Video, Download } from 'lucide-react';

const ResourceCard = ({ icon: Icon, title, description, link }: {
  icon: React.ElementType,
  title: string,
  description: string,
  link: string
}) => (
  <div className="border border-border rounded-lg p-6 hover:shadow-md transition-all bg-card">
    <div className="flex items-start">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
        <Icon className="text-primary" size={20} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-foreground/70 mb-4">{description}</p>
        <a 
          href={link} 
          className="flex items-center text-primary font-medium hover:underline"
        >
          Learn More <ArrowRight size={16} className="ml-2" />
        </a>
      </div>
    </div>
  </div>
);

const ResourceSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-12">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Resources = () => {
  return (
    <section id="resources" className="py-20 px-6 md:px-12 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Developer Tools
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Resources & Documentation</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Everything you need to make the most of Smart CodeLab's capabilities.
          </p>
        </div>
        
        <ResourceSection title="Documentation">
          <ResourceCard 
            icon={FileText}
            title="API Documentation" 
            description="Comprehensive API reference for integrating with Smart CodeLab."
            link="#"
          />
          <ResourceCard 
            icon={BookOpen}
            title="User Guides" 
            description="Step-by-step tutorials and usage examples for all features."
            link="#"
          />
        </ResourceSection>
        
        <ResourceSection title="Development Resources">
          <ResourceCard 
            icon={Github}
            title="GitHub Repository" 
            description="Explore the open-source components and contribute to development."
            link="#"
          />
          <ResourceCard 
            icon={Video}
            title="Video Tutorials" 
            description="Watch in-depth tutorials on advanced Smart CodeLab features."
            link="#"
          />
        </ResourceSection>
        
        <ResourceSection title="Downloads & Tools">
          <ResourceCard 
            icon={Download}
            title="CLI Tools" 
            description="Command-line utilities for integrating Smart CodeLab into your workflow."
            link="#"
          />
          <ResourceCard 
            icon={Download}
            title="Plugins & Extensions" 
            description="Extend your favorite IDE with Smart CodeLab capabilities."
            link="#"
          />
        </ResourceSection>
        
        <div className="mt-16 glass rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Join Our Developer Community</h3>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
            Connect with other developers, share projects, and get help from our team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="btn-primary">Join Discord</a>
            <a href="#" className="btn-secondary">Subscribe to Updates</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
