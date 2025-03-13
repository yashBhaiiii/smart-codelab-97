
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="text-2xl font-bold text-primary flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary text-white grid place-items-center font-mono">
              &lt;/&gt;
            </div>
            <span>Smart CodeLab</span>
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="nav-link">Features</a>
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#insights" className="nav-link">Insights</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#" className="btn-primary">Try Smart CodeLab</a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 p-6 flex flex-col transition-all duration-300 transform md:hidden",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex justify-end">
          <button 
            className="p-2 rounded-md text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col space-y-6 mt-16 items-center">
          <a 
            href="#features" 
            className="text-xl font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#demo" 
            className="text-xl font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Demo
          </a>
          <a 
            href="#insights" 
            className="text-xl font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Insights
          </a>
          <a 
            href="#resources" 
            className="text-xl font-medium" 
            onClick={() => setMobileMenuOpen(false)}
          >
            Resources
          </a>
          <a 
            href="#" 
            className="btn-primary w-full text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Try Smart CodeLab
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
