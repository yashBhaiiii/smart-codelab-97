
import { useState, useEffect } from 'react';
import { Play, Save, Copy, RefreshCw, BrainCircuit } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState(`function calculateFibonacci(n) {
  // Simple implementation to calculate Fibonacci numbers
  if (n <= 1) return n;
  return calculateFibonacci(n-1) + calculateFibonacci(n-2);
}

// Call the function
const result = calculateFibonacci(10);
console.log(result);`);

  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);

  const runCode = () => {
    setIsProcessing(true);
    setOutput('');
    
    // Simulate code execution delay
    setTimeout(() => {
      try {
        // Create a safe environment to execute the user's code
        const originalConsoleLog = console.log;
        let logs = [];
        
        // Override console.log
        console.log = (...args) => {
          logs.push(args.map(arg => String(arg)).join(' '));
        };
        
        // If the code contains "fibonacci", simulate output for demonstration
        if (code.includes('calculateFibonacci')) {
          logs.push('55');
        } else {
          // For non-fibonacci code, try to evaluate safely
          // This is just a simple demo - a real implementation would use sandboxing
          const result = new Function(code)();
          if (result !== undefined) {
            logs.push(`Result: ${result}`);
          }
        }
        
        // Restore original console.log
        console.log = originalConsoleLog;
        
        setOutput(logs.join('\n'));
        
        // Show AI suggestion after a short delay
        setTimeout(() => {
          if (code.includes('calculateFibonacci')) {
            setAiSuggestion('The recursive Fibonacci implementation has O(2^n) time complexity. Consider using memoization or an iterative approach for better performance.');
            setShowSuggestion(true);
          } else {
            setShowSuggestion(false);
          }
        }, 1000);
        
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const getAiSuggestions = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      if (code.includes('calculateFibonacci')) {
        setCode(`function calculateFibonacci(n, memo = {}) {
  // Optimized implementation using memoization
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  // Store results in memo object to avoid redundant calculations
  memo[n] = calculateFibonacci(n-1, memo) + calculateFibonacci(n-2, memo);
  return memo[n];
}

// Call the function
const result = calculateFibonacci(10);
console.log(result);

// Now we can efficiently calculate much larger values
// const largeResult = calculateFibonacci(50);
// console.log(largeResult);`);
        
        setAiSuggestion('I've optimized your Fibonacci function using memoization to achieve O(n) time complexity instead of O(2^n). This prevents redundant calculations by storing previously computed values.');
        setShowSuggestion(true);
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <section id="demo" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Try Smart CodeLab</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Experience the power of AI-assisted coding with our interactive editor.
            Write, run, and optimize code directly in your browser.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-lg overflow-hidden border border-border shadow-lg">
            <div className="bg-codelab-dark p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-white text-sm opacity-70">script.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() => setCode(`function calculateFibonacci(n) {
  // Simple implementation to calculate Fibonacci numbers
  if (n <= 1) return n;
  return calculateFibonacci(n-1) + calculateFibonacci(n-2);
}

// Call the function
const result = calculateFibonacci(10);
console.log(result);`)}
                >
                  <RefreshCw size={16} />
                </button>
                <button className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity">
                  <Copy size={16} />
                </button>
                <button className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity">
                  <Save size={16} />
                </button>
              </div>
            </div>
            
            <div className="bg-[#1E1E1E] h-96 overflow-y-auto">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-white bg-transparent w-full h-full p-4 outline-none resize-none"
                spellCheck="false"
              />
            </div>
            
            <div className="bg-[#2D2D2D] p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  className="px-3 py-1.5 bg-accent text-white rounded flex items-center space-x-1 hover:bg-accent/90 transition-colors"
                  onClick={runCode}
                  disabled={isProcessing}
                >
                  {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                  <span>Run</span>
                </button>
                
                <button 
                  className="px-3 py-1.5 bg-primary text-white rounded flex items-center space-x-1 hover:bg-primary/90 transition-colors"
                  onClick={getAiSuggestions}
                  disabled={isProcessing}
                >
                  {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                  <span>AI Optimize</span>
                </button>
              </div>
              
              <div className="text-white text-xs opacity-70">JavaScript v18.x</div>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg flex-1">
              <div className="bg-codelab-dark p-3">
                <div className="text-white text-sm">Output</div>
              </div>
              
              <div className="bg-[#1E1E1E] p-4 font-mono text-sm text-white h-40 overflow-y-auto">
                {output ? (
                  output
                ) : (
                  <div className="text-gray-400 italic">
                    Run the code to see output here...
                  </div>
                )}
              </div>
            </div>
            
            <div className={`mt-6 rounded-lg border p-4 ${showSuggestion ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <BrainCircuit className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">AI Assistant</h4>
                  {showSuggestion ? (
                    <p className="text-foreground/80 mt-1">{aiSuggestion}</p>
                  ) : (
                    <p className="text-foreground/70 italic mt-1">
                      Run your code and I'll suggest optimizations and improvements.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeEditor;
