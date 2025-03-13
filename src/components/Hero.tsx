
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 px-6 md:px-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Code lines background decoration */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="h-px w-full bg-foreground my-10"
            style={{ marginTop: `${i * 5}rem` }}
          ></div>
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8 md:pr-10">
            <div>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                AI-Powered Development
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in">
              Smart CodeLab: <br />
              <span className="text-primary">AI-Powered</span> Online IDE
            </h1>
            
            <p className="text-lg text-foreground/80 leading-relaxed animate-fade-in animation-delay-200">
              Write, run, and debug code with real-time AI assistance—anytime, anywhere. 
              Experience the future of coding with intelligent suggestions and automated optimizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in animation-delay-400">
              <a href="#demo" className="btn-primary flex items-center justify-center gap-2">
                Try Smart CodeLab Now
                <ArrowRight size={18} />
              </a>
              <a href="#features" className="btn-secondary flex items-center justify-center">
                Learn More About Features
              </a>
            </div>
          </div>
          
          {/* Code editor mockup */}
          <div className="relative animate-fade-in animation-delay-600">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <div className="bg-codelab-dark p-4 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-white text-sm opacity-70">main.js - Smart CodeLab</div>
              </div>
              
              <div className="bg-[#1E1E1E] p-4 font-mono text-sm text-white overflow-hidden">
                <pre className="leading-relaxed">
                  <span className="text-blue-400">function</span> <span className="text-yellow-300">analyzeCode</span><span className="text-white">(</span><span className="text-orange-300">codeInput</span><span className="text-white">) &#123;</span>
                  <br />  <span className="text-green-400">// AI-powered code analysis</span>
                  <br />  <span className="text-blue-400">const</span> <span className="text-purple-400">suggestions</span> <span className="text-white">= </span><span className="text-yellow-300">aiModel</span><span className="text-white">.analyze(codeInput);</span>
                  <br />
                  <br />  <span className="text-blue-400">if</span> <span className="text-white">(</span><span className="text-purple-400">suggestions</span><span className="text-white">.length > </span><span className="text-orange-300">0</span><span className="text-white">) &#123;</span>
                  <br />    <span className="text-blue-400">return</span> <span className="text-white">&#123;</span>
                  <br />      <span className="text-purple-400">optimized</span><span className="text-white">: </span><span className="text-yellow-300">applyOptimizations</span><span className="text-white">(codeInput, suggestions),</span>
                  <br />      <span className="text-purple-400">improvements</span><span className="text-white">: suggestions.map(</span><span className="text-orange-300">s</span> <span className="text-white">=> s.description)</span>
                  <br />    <span className="text-white">&#125;;</span>
                  <br />  <span className="text-white">&#125;</span>
                  <br />
                  <br />  <span className="text-blue-400">return</span> <span className="text-white">&#123;</span>
                  <br />    <span className="text-purple-400">optimized</span><span className="text-white">: codeInput,</span>
                  <br />    <span className="text-purple-400">improvements</span><span className="text-white">: []</span>
                  <br />  <span className="text-white">&#125;;</span>
                  <br /><span className="text-white">&#125;</span>
                </pre>
                
                {/* AI Suggestions popup */}
                <div className="mt-4 p-3 bg-blue-600/20 border border-blue-600/30 rounded-md">
                  <div className="flex items-start gap-2">
                    <div className="p-1 bg-blue-600 rounded-full">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                        <path d="M12 16V12M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-blue-100 text-xs">Smart AI suggestion:</p>
                      <p className="text-white text-sm mt-1">Consider adding error handling for invalid inputs with try/catch block</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated elements */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-accent/10 rounded-full filter blur-xl animate-pulse-slow"></div>
            <div className="absolute -top-6 -left-6 h-16 w-16 bg-primary/10 rounded-full filter blur-xl animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
