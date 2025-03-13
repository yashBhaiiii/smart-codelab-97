import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Cpu, Database, Code, Lock, BrainCircuit } from 'lucide-react';

const TechnicalInsights = () => {
  const [activeTab, setActiveTab] = useState("frontend");
  
  const codeSnippets = {
    frontend: `// Smart CodeLab - Monaco Editor Integration
import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      // Initialize Monaco editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        tabSize: 2,
      });
      
      // Handle content changes
      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current.getValue());
      });
      
      // Configure intellisense and AI suggestions
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: async (model, position) => {
          const suggestions = await getAISuggestions(
            model.getValue(),
            position
          );
          
          return {
            suggestions: suggestions.map(mapToCompletionItems)
          };
        }
      });
    }
    
    return () => editorRef.current?.dispose();
  }, []);
  
  return <div ref={containerRef} className="h-full w-full" />;
};`,
    
    backend: `// Smart CodeLab - Code Execution Service
import express from 'express';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { createSandbox } from './sandbox.js';

const router = express.Router();

// Execute code in isolated environment
router.post('/execute', async (req, res) => {
  const { code, language } = req.body;
  const executionId = uuidv4();
  
  try {
    // Create isolated sandbox for execution
    const sandbox = await createSandbox({
      id: executionId,
      language,
      memoryLimit: '128m',
      cpuLimit: '2',
      timeout: 10000, // 10 seconds max execution time
    });
    
    // Write code to sandbox filesystem
    await sandbox.writeFile('program.' + getExtension(language), code);
    
    // Execute the code
    const result = await sandbox.execute();
    
    return res.json({
      executionId,
      output: result.stdout,
      error: result.stderr,
      executionTime: result.executionTime,
    });
  } catch (error) {
    console.error('Execution error:', error);
    return res.status(500).json({
      executionId,
      error: 'Execution failed: ' + error.message,
    });
  }
});

export default router;`,
    
    ai: `// Smart CodeLab - AI Code Analysis and Generation
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';

// Initialize LLM with OpenAI API
const llm = new OpenAI({
  temperature: 0.2,
  modelName: 'gpt-4', // or other suitable model
});

// Process code for improvements and suggestions
export async function analyzeCode(code, language) {
  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    bugs: "List of potential bugs in the code",
    optimizations: "List of performance optimizations",
    securityIssues: "List of security vulnerabilities",
    codeQuality: "Code quality suggestions",
    improvedCode: "Improved version of the code",
  });
  
  const prompt = new PromptTemplate({
    template: \`
      You are an expert programmer specializing in {language}.
      Analyze the following code for bugs, performance issues, and security vulnerabilities:
      
      \`\`\`{language}
      {code}
      \`\`\`
      
      {format_instructions}
    \`,
    inputVariables: ["language", "code"],
    partialVariables: {
      format_instructions: parser.getFormatInstructions(),
    },
  });
  
  const input = await prompt.format({
    language,
    code,
  });
  
  const result = await llm.call(input);
  
  try {
    return parser.parse(result);
  } catch (e) {
    console.error("Failed to parse LLM response:", e);
    return {
      bugs: [],
      optimizations: [],
      securityIssues: [],
      codeQuality: ["Unable to analyze code"],
      improvedCode: code,
    };
  }
}`,
    
    execution: `// Smart CodeLab - Secure Execution Environment
import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';

export class DockerizedExecutor {
  constructor() {
    this.docker = new Docker();
  }
  
  async executeCode(language, code, timeout = 10000) {
    // Create temporary directory for code execution
    const executionDir = await this.createExecutionDirectory();
    
    try {
      // Write code to file
      const filePath = path.join(
        executionDir,
        \`program.\${this.getFileExtension(language)}\`
      );
      await fs.writeFile(filePath, code);
      
      // Get container config for language
      const containerConfig = this.getContainerConfig(language, executionDir);
      
      // Create and start container with security limits
      const container = await this.docker.createContainer({
        Image: containerConfig.image,
        Cmd: containerConfig.cmd,
        HostConfig: {
          // Mount code directory as read-only
          Binds: [\`\${executionDir}:/code:ro\`],
          // Set resource limits
          Memory: 128 * 1024 * 1024, // 128MB
          MemorySwap: 128 * 1024 * 1024, // Disable swap
          CpuPeriod: 100000,
          CpuQuota: 50000, // 50% of CPU
          // Security restrictions
          SecurityOpt: ['no-new-privileges'],
          CapDrop: ['ALL'],
          NetworkMode: 'none' // No network access
        },
        WorkingDir: '/code',
        Tty: false,
      });
      
      // Execute with timeout
      const executionResult = await this.runContainerWithTimeout(
        container,
        timeout
      );
      
      return {
        stdout: executionResult.stdout,
        stderr: executionResult.stderr,
        exitCode: executionResult.exitCode,
      };
    } finally {
      // Clean up temporary directory
      await this.cleanupExecutionDirectory(executionDir);
    }
  }
  
  // Additional utility methods omitted for brevity
}`,
    
    database: `// Smart CodeLab - Project & Data Storage
import { MongoClient } from 'mongodb';
import { Redis } from 'ioredis';

// MongoDB connection for persistent storage
const mongoClient = new MongoClient(process.env.MONGODB_URI);
const db = mongoClient.db('smart-codelab');
const projects = db.collection('projects');
const executions = db.collection('executions');

// Redis client for caching and real-time data
const redis = new Redis(process.env.REDIS_URI);

// Store user project in database
export async function saveProject(userId, projectData) {
  const { name, language, code, lastModified } = projectData;
  
  // Update project if exists, create if not
  const result = await projects.updateOne(
    { userId, name },
    {
      $set: {
        language,
        code,
        lastModified
      }
    },
    { upsert: true }
  );
  
  // Invalidate cache
  await redis.del(\`project:\${userId}:\${name}\`);
  
  return result;
}

// Get user project with caching
export async function getProject(userId, projectName) {
  // Try to get from cache first
  const cachedProject = await redis.get(\`project:\${userId}:\${projectName}\`);
  
  if (cachedProject) {
    return JSON.parse(cachedProject);
  }
  
  // Get from database if not in cache
  const project = await projects.findOne({ userId, name: projectName });
  
  if (project) {
    // Cache for future requests (expire after 5 minutes)
    await redis.set(
      \`project:\${userId}:\${projectName}\`,
      JSON.stringify(project),
      'EX',
      300
    );
  }
  
  return project;
}`,
  };
  
  return (
    <section id="insights" className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Under The Hood
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Technical Insights</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Explore the advanced technology stack powering Smart CodeLab's capabilities.
          </p>
        </div>
        
        <Tabs defaultValue="frontend" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="frontend" className="flex flex-col items-center gap-1 py-3">
                <Code size={20} className={activeTab === "frontend" ? "text-primary" : "text-foreground/70"} />
                <span>Frontend</span>
              </TabsTrigger>
              <TabsTrigger value="backend" className="flex flex-col items-center gap-1 py-3">
                <Server size={20} className={activeTab === "backend" ? "text-primary" : "text-foreground/70"} />
                <span>Backend</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex flex-col items-center gap-1 py-3">
                <BrainCircuit size={20} className={activeTab === "ai" ? "text-primary" : "text-foreground/70"} />
                <span>AI Model</span>
              </TabsTrigger>
              <TabsTrigger value="execution" className="flex flex-col items-center gap-1 py-3">
                <Cpu size={20} className={activeTab === "execution" ? "text-primary" : "text-foreground/70"} />
                <span>Execution</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex flex-col items-center gap-1 py-3">
                <Database size={20} className={activeTab === "database" ? "text-primary" : "text-foreground/70"} />
                <span>Storage</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="border border-border rounded-lg shadow-sm overflow-hidden">
            <TabsContent value="frontend" className="m-0">
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Frontend Implementation</h3>
                <p className="text-foreground/70 mb-4">
                  Smart CodeLab's frontend is built using React and Vite for a lightning-fast, modern UI.
                  The editor interface uses Monaco Editor (the same engine powering VS Code) with custom AI integrations.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Technologies:</h4>
                    <ul className="space-y-1 list-disc pl-5 text-foreground/80">
                      <li>React + Vite for UI framework</li>
                      <li>Monaco Editor for code editing</li>
                      <li>TailwindCSS for responsive styling</li>
                      <li>ShadCN UI components for elegant UI</li>
                      <li>Axios for API requests</li>
                      <li>React Query for state management</li>
                    </ul>
                  </div>
                  <div className="rounded-md overflow-hidden bg-[#1E1E1E]">
                    <div className="bg-[#333] text-white text-sm p-2">Monaco Editor Integration</div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto text-white">
                      {codeSnippets.frontend}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="backend" className="m-0">
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Backend Implementation</h3>
                <p className="text-foreground/70 mb-4">
                  The backend is built on Node.js with Express, providing RESTful APIs for code execution, project management,
                  and AI integrations. It handles user authentication, code compilation, and execution in isolated environments.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Technologies:</h4>
                    <ul className="space-y-1 list-disc pl-5 text-foreground/80">
                      <li>Node.js + Express for API framework</li>
                      <li>JWT for secure authentication</li>
                      <li>Docker API for containerized execution</li>
                      <li>WebSockets for real-time collaboration</li>
                      <li>LangChain for AI integration</li>
                    </ul>
                  </div>
                  <div className="rounded-md overflow-hidden bg-[#1E1E1E]">
                    <div className="bg-[#333] text-white text-sm p-2">Code Execution Service</div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto text-white">
                      {codeSnippets.backend}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ai" className="m-0">
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">AI Model Integration</h3>
                <p className="text-foreground/70 mb-4">
                  Smart CodeLab incorporates advanced AI models to provide code suggestions, detect bugs,
                  optimize performance, and explain code. The system uses LangChain with various LLMs to deliver
                  context-aware assistance.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Technologies:</h4>
                    <ul className="space-y-1 list-disc pl-5 text-foreground/80">
                      <li>LangChain for LLM orchestration</li>
                      <li>OpenAI API for code generation</li>
                      <li>Vector embeddings for semantic search</li>
                      <li>Fine-tuned models for code analysis</li>
                      <li>Rate limiting and caching for performance</li>
                    </ul>
                  </div>
                  <div className="rounded-md overflow-hidden bg-[#1E1E1E]">
                    <div className="bg-[#333] text-white text-sm p-2">AI Code Analysis</div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto text-white">
                      {codeSnippets.ai}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="execution" className="m-0">
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Secure Execution Environment</h3>
                <p className="text-foreground/70 mb-4">
                  Code execution happens in isolated, containerized environments to ensure security and reliability.
                  Each execution is sandboxed with strict resource limits and security controls.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Technologies:</h4>
                    <ul className="space-y-1 list-disc pl-5 text-foreground/80">
                      <li>Docker containers for isolation</li>
                      <li>Firecracker MicroVMs for lightweight execution</li>
                      <li>Resource limits (CPU, memory, network)</li>
                      <li>Seccomp filters for system call restriction</li>
                      <li>Execution timeouts to prevent infinite loops</li>
                    </ul>
                  </div>
                  <div className="rounded-md overflow-hidden bg-[#1E1E1E]">
                    <div className="bg-[#333] text-white text-sm p-2">Secure Execution Environment</div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto text-white">
                      {codeSnippets.execution}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="database" className="m-0">
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Database & Storage</h3>
                <p className="text-foreground/70 mb-4">
                  Smart CodeLab uses a combination of databases and storage solutions to manage user projects,
                  execution history, and cached results efficiently.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Technologies:</h4>
                    <ul className="space-y-1 list-disc pl-5 text-foreground/80">
                      <li>MongoDB Atlas for project storage</li>
                      <li>Redis for caching and real-time data</li>
                      <li>S3-compatible storage for large files</li>
                      <li>In-memory caching for frequent operations</li>
                      <li>Database indexing for fast queries</li>
                    </ul>
                  </div>
                  <div className="rounded-md overflow-hidden bg-[#1E1E1E]">
                    <div className="bg-[#333] text-white text-sm p-2">Data Storage Implementation</div>
                    <pre className="p-4 text-sm font-mono overflow-x-auto text-white">
                      {codeSnippets.database}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
          
          <div className="mt-12 flex flex-col items-center">
            <div className="glass-dark p-6 rounded-xl max-w-2xl">
              <h3 className="text-xl font-semibold mb-2 text-center">System Architecture</h3>
              <p className="text-foreground/70 text-center mb-6">
                Smart CodeLab's components work together to provide a seamless, secure coding experience
              </p>
              <div className="grid grid-cols-3 gap-4 text-center mb-10">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Code className="mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">UI Layer</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Server className="mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">API Layer</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Lock className="mx-auto text-primary mb-2" />
                  <p className="text-sm font-medium">Security Layer</p>
                </div>
              </div>
              
              <div className="relative h-1 bg-gray-200 rounded-full mb-10">
                <div className="absolute top-0 left-0 h-1 bg-primary rounded-full w-3/4"></div>
                <div className="absolute -top-4 left-1/4 h-8 w-px bg-gray-300"></div>
                <div className="absolute -top-4 left-2/4 h-8 w-px bg-gray-300"></div>
                <div className="absolute -top-4 left-3/4 h-8 w-px bg-gray-300"></div>
                <div className="absolute -bottom-8 left-1/4 text-xs text-center w-16 -ml-8">Request</div>
                <div className="absolute -bottom-8 left-2/4 text-xs text-center w-16 -ml-8">Process</div>
                <div className="absolute -bottom-8 left-3/4 text-xs text-center w-16 -ml-8">Response</div>
              </div>
              
              <p className="text-center text-sm text-foreground/70">
                Each request flows through multiple secure layers before code execution and response
              </p>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default TechnicalInsights;
