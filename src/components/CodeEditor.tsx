
import { useState, useEffect } from 'react';
import { Play, Save, Copy, RefreshCw, BrainCircuit, Lightbulb, X } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState(`module MyToken {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct MyToken {}

    // Initialize the token
    public fun initialize(account: &signer) {
        coin::register<MyToken>(account);
    }

    // Mint tokens to the specified account
    public fun mint(account: &signer, amount: u64) {
        let sender = signer::address_of(account);
        coin::deposit(sender, coin::mint<MyToken>(amount, &capability));
    }
}`);

  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [realtimeSuggestions, setRealtimeSuggestions] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('move');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showRealtimePanel, setShowRealtimePanel] = useState(true);

  // Monitor code changes to provide real-time suggestions
  useEffect(() => {
    if (code && code.length > 5) {
      const timeoutId = setTimeout(() => {
        generateRealtimeSuggestions();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setRealtimeSuggestions([]);
    }
  }, [code, cursorPosition]);

  const generateRealtimeSuggestions = () => {
    // Real implementation would connect to an AI service
    // This is a simplified version for demonstration
    
    // Move-specific suggestions based on code content
    if (code.includes('module') && !code.includes('struct')) {
      setRealtimeSuggestions(["Consider adding a 'struct' definition to store your token's data"]);
    } else if (code.includes('struct') && !code.includes('resource')) {
      setRealtimeSuggestions(["Add '#[resource]' attribute to make your struct a resource type"]);
    } else if (code.includes('public fun') && !code.includes('acquires')) {
      setRealtimeSuggestions(["If your function needs to access resources, use 'acquires' keyword", 
      "Consider adding error handling with 'assert!'"]);
    } else if (code.includes('coin::mint') && !code.includes('capability')) {
      setRealtimeSuggestions(["The 'coin::mint' function requires a mint capability that needs to be properly defined", 
      "Initialize the mint capability in your module initialization function"]);
    } else if (code.includes('signer::address_of')) {
      setRealtimeSuggestions(["Make sure resources are properly moved or copied according to Move's ownership rules",
      "Consider adding access controls to sensitive functions"]);
    } else {
      // Default suggestions for Move development
      setRealtimeSuggestions([
        "Use '#[test]' attribute to mark test functions",
        "Consider adding detailed error codes with 'abort' statements",
        "Ensure resources are properly managed with 'move_to' and 'move_from'",
      ]);
    }
  };

  const applyRealtimeSuggestion = (suggestion: string) => {
    if (suggestion.includes("'#[resource]'")) {
      // Add #[resource] attribute before struct definition
      const newCode = code.replace(
        /struct\s+(\w+)/,
        '#[resource]\nstruct $1'
      );
      setCode(newCode);
    } else if (suggestion.includes("'acquires'")) {
      // Add acquires keyword to first function that doesn't have it
      const newCode = code.replace(
        /public fun\s+(\w+)([^{]+){/,
        'public fun $1$2 acquires MyToken {'
      );
      setCode(newCode);
    } else if (suggestion.includes("error handling")) {
      // Add sample error handling
      const newCode = code.replace(
        /public fun\s+mint[^{]+{/,
        `public fun mint(account: &signer, amount: u64) {
        assert!(amount > 0, 1000); // Error code 1000: amount must be positive`
      );
      setCode(newCode);
    }
    
    // After applying suggestion, regenerate new ones
    setTimeout(() => {
      generateRealtimeSuggestions();
    }, 500);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const runCode = () => {
    setIsProcessing(true);
    setOutput('');
    
    // Simulate code execution delay
    setTimeout(() => {
      try {
        // Move-specific code execution simulation
        if (selectedLanguage === 'move') {
          if (code.includes('module') && code.includes('struct')) {
            // Success path for Move code with proper structure
            setOutput(
`Compiling module 'MyToken'...
│ Checking struct definitions
│ Checking function bodies
│ Checking resource safety
│ Verifying global storage operations
│
└─ Success!

Module deployed to 0x1234...abcd
Gas used: 42 units`);
          } else if (code.includes('abort') || code.includes('assert!(')) {
            // Error triggered by assertion or abort
            setOutput(
`Error: Transaction aborted with code 1000
Location: main::MyToken::mint
Reason: amount must be positive

Execution failed!`);
          } else {
            // Generic error for incomplete or invalid Move code
            setOutput(
`Error! Could not compile module:
│
│ Missing required definition or invalid syntax
│ Expected struct definition after module declaration
│ 
└─ Move compilation failed!`);
          }
          
          // Show AI suggestion after a short delay
          setTimeout(() => {
            if (code.includes('struct') && !code.includes('#[resource]')) {
              setAiSuggestion('Your Move code could be improved by adding the #[resource] attribute to your struct. This indicates that the type holds valuable assets and should be handled according to Move\'s ownership rules.');
              setShowSuggestion(true);
            } else if (code.includes('coin::mint') && !code.includes('BurnCapability')) {
              setAiSuggestion('For coin operations in Move, you need to properly manage mint and burn capabilities. Consider adding proper capability handling to your module.');
              setShowSuggestion(true);
            } else if (code.length < 100) {
              setAiSuggestion('Your Move module appears to be minimal. Consider adding access control with signer checks and proper error handling using abort codes.');
              setShowSuggestion(true);
            } else {
              setShowSuggestion(false);
            }
          }, 1000);
        } else {
          // Non-Move language fallback handling
          const originalConsoleLog = console.log;
          let logs = [];
          
          console.log = (...args) => {
            logs.push(args.map(arg => String(arg)).join(' '));
          };
          
          try {
            const result = new Function(code)();
            if (result !== undefined) {
              logs.push(`Result: ${result}`);
            }
          } catch (execError) {
            logs.push(`Execution error: ${execError.message}`);
          }
          
          console.log = originalConsoleLog;
          setOutput(logs.join('\n') || 'Code executed with no output');
        }
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
      if (selectedLanguage === 'move') {
        let improved = '';
        
        if (code.includes('module') && !code.includes('#[resource]')) {
          // Add resource attribute and improve the token implementation
          improved = `module MyToken {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    
    #[resource]
    struct MyToken {}
    
    // Store mint capability in the module
    struct MintCapability has key {
        cap: coin::MintCapability<MyToken>
    }
    
    // Initialize the token with proper capability management
    public fun initialize(account: &signer) {
        let (burn_cap, freeze_cap, mint_cap) = 
            coin::initialize<MyToken>(
                account,
                "My Token",
                "MYT",
                8, // decimals
                true // monitor supply
            );
            
        // Store the mint capability    
        move_to(account, MintCapability { cap: mint_cap });
        
        // Burn and freeze capabilities can be handled similarly
    }
    
    // Mint tokens with proper capability handling
    public fun mint(
        admin: &signer, 
        amount: u64, 
        recipient_addr: address
    ) acquires MintCapability {
        // Verify admin has proper permissions
        let admin_addr = signer::address_of(admin);
        assert!(admin_addr == @MyTokenAdmin, 1000); // Only admin can mint
        assert!(amount > 0, 1001); // Amount must be positive
        
        // Get capability and mint tokens
        let mint_cap = &borrow_global<MintCapability>(admin_addr).cap;
        let tokens = coin::mint(amount, mint_cap);
        
        // Deposit to recipient
        coin::deposit(recipient_addr, tokens);
    }
}`;
        } else {
          // Default improvement if no specific pattern detected
          improved = `module MyToken {
    use std::signer;
    use aptos_framework::coin;
    
    #[resource]
    struct MyToken has key {}
    
    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1000;
    const E_INVALID_AMOUNT: u64 = 1001;
    
    // Token metadata
    struct TokenInfo has key {
        name: string::String,
        symbol: string::String,
        decimals: u8,
        supply: coin::Supply<MyToken>
    }
    
    // Initialize the token
    public fun initialize(account: &signer) {
        let admin_addr = signer::address_of(account);
        assert!(admin_addr == @TokenAdmin, E_NOT_AUTHORIZED);
        
        // Create the token with metadata
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<MyToken>(
            account,
            string::utf8(b"My Token"),
            string::utf8(b"MYT"),
            8, // decimals
            true // monitor supply
        );
        
        // Store capabilities properly
        move_to(account, TokenInfo {
            name: string::utf8(b"My Token"),
            symbol: string::utf8(b"MYT"),
            decimals: 8,
            supply: mint_cap
        });
    }
    
    // Additional token operations would be implemented here
}`;
        }
        
        setCode(improved);
        
        setAiSuggestion("I've optimized your Move code by adding proper resource attributes, implementing capability-based permission handling, and adding error codes. This follows Move best practices for secure token implementation on blockchain.");
        setShowSuggestion(true);
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  // Reset code to default example
  const resetCode = () => {
    setCode(`module MyToken {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct MyToken {}

    // Initialize the token
    public fun initialize(account: &signer) {
        coin::register<MyToken>(account);
    }

    // Mint tokens to the specified account
    public fun mint(account: &signer, amount: u64) {
        let sender = signer::address_of(account);
        coin::deposit(sender, coin::mint<MyToken>(amount, &capability));
    }
}`);
    setOutput('');
    setShowSuggestion(false);
  };

  return (
    <section id="demo" className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Interactive Move Lab
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Try Smart CodeLab for Move</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Experience the power of AI-assisted blockchain development with our interactive Move editor.
            Write, run, and optimize Move modules directly in your browser.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-lg overflow-hidden border border-border shadow-lg">
            <div className="bg-codelab-dark p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-white text-sm opacity-70">module.move</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                  onClick={resetCode}
                  title="Reset code"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                  title="Copy code"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  <Copy size={16} />
                </button>
                <button 
                  className="p-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                  title="Toggle realtime suggestions"
                  onClick={() => setShowRealtimePanel(!showRealtimePanel)}
                >
                  <Lightbulb size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex h-96">
              <div className="bg-[#1E1E1E] flex-grow overflow-y-auto">
                <textarea
                  value={code}
                  onChange={handleEditorChange}
                  onClick={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
                  onKeyUp={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
                  className="font-mono text-white bg-transparent w-full h-full p-4 outline-none resize-none"
                  spellCheck="false"
                />
              </div>
              
              {showRealtimePanel && realtimeSuggestions.length > 0 && (
                <div className="bg-[#252525] w-64 flex-shrink-0 border-l border-[#333] overflow-y-auto">
                  <div className="p-2 bg-[#333] text-white text-xs font-medium flex justify-between items-center">
                    <span>AI Suggestions</span>
                    <button 
                      className="text-white/70 hover:text-white/100 transition-colors"
                      onClick={() => setShowRealtimePanel(false)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-2">
                    {realtimeSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="mb-2 p-2 bg-[#2A2A2A] rounded text-xs text-white/80 hover:bg-[#3A3A3A] cursor-pointer transition-colors"
                        onClick={() => applyRealtimeSuggestion(suggestion)}
                      >
                        <div className="flex items-start space-x-1">
                          <Lightbulb className="text-yellow-500 mt-0.5 flex-shrink-0" size={12} />
                          <span>{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              
              <div className="text-white text-xs opacity-70">Move Language</div>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col">
            <div className="rounded-lg overflow-hidden border border-border shadow-lg flex-1">
              <div className="bg-codelab-dark p-3">
                <div className="text-white text-sm">Compilation Output</div>
              </div>
              
              <div className="bg-[#1E1E1E] p-4 font-mono text-sm text-white h-40 overflow-y-auto">
                {output ? (
                  output
                ) : (
                  <div className="text-gray-400 italic">
                    Run the code to see compilation results...
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
                  <h4 className="font-semibold text-lg">Move AI Assistant</h4>
                  {showSuggestion ? (
                    <p className="text-foreground/80 mt-1">{aiSuggestion}</p>
                  ) : (
                    <p className="text-foreground/70 italic mt-1">
                      Run your Move code and I'll suggest optimizations and improvements for blockchain best practices.
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
