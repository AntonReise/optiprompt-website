'use client';

import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import Tag from '@/components/ui/Tag';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Setup() {
  return (
    <MainLayout>
      
      {/* Hero Section */}
      <section className="pt-[103px] bg-gradient-to-b from-[#eaeefe] to-[#183ec2] h-[50vh] min-h-[400px] flex items-center">
        <div className="container mx-auto px-12">
          <div className="pt-0">
            <Tag className="mb-6 bg-white/80 border-[#22222219] text-black">
              Getting Started
            </Tag>
            
            <h1 className="text-[64px] font-bold text-black leading-[70px] max-w-[800px] mb-6">
              OptiPrompt Setup & Configuration
            </h1>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-12">
          <div className="max-w-4xl mx-auto prose prose-lg">
            
            {/* Development Banner */}
            {!isSupabaseConfigured() && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Development Preview:</strong> This setup guide is available for preview. Once authentication is configured, this page will remain publicly accessible as it contains installation instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Prerequisites */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">Prerequisites</h2>
              <p className="text-[18px] text-gray-700 mb-4">
                Before you begin, make sure you have the following installed and configured:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[18px] text-gray-700 mb-4 ml-4">
                <li>Node.js <strong>18+</strong></li>
                <li>Git (optional but recommended)</li>
                <li>An Anthropic API key <strong>(only if you wish to connect OptiPrompt with Claude Desktop)</strong></li>
                <li>A terminal (macOS, Linux, or Windows PowerShell)</li>
              </ul>
              <p className="text-[18px] text-gray-700">
                The OptiPrompt code lives in the public repository:{' '}
                <a 
                  href="https://github.com/AntonReise/OptiPrompt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline"
                >
                  https://github.com/AntonReise/OptiPrompt
                </a>
              </p>
            </div>

            {/* Installation */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">1. Download & Install OptiPrompt</h2>
              
              <div className="mb-8">
                <h3 className="text-[24px] font-semibold text-black mb-4">Step 1 – Clone the repository</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-white text-[14px] font-mono">
                    <code>{`git clone https://github.com/AntonReise/OptiPrompt.git
cd OptiPrompt`}</code>
                  </pre>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[24px] font-semibold text-black mb-4">Step 2 – Install dependencies</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-white text-[14px] font-mono">
                    <code>npm install</code>
                  </pre>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[24px] font-semibold text-black mb-4">Step 3 – Configure the Anthropic API key (Claude Desktop only)</h3>
                <p className="text-[18px] text-gray-700 mb-4">
                  <strong>Note:</strong> This step is only required if you plan to connect OptiPrompt with Claude Desktop. If you're only using Cursor, you can skip this step.
                </p>
                <p className="text-[18px] text-gray-700 mb-4">
                  Create a <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">.env</code> file in the project root with:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre className="text-white text-[14px] font-mono">
                    <code>ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE</code>
                  </pre>
                </div>
                <p className="text-[18px] text-gray-700 mb-2">
                  Replace <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">YOUR_ANTHROPIC_API_KEY_HERE</code> with the key from the Anthropic dashboard.
                </p>
                <p className="text-[18px] text-gray-700">
                  This variable is loaded via <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">dotenv.config()</code> in <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">src/index.ts</code>, and the MCP server will refuse to run without it when connecting to Claude Desktop.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-[24px] font-semibold text-black mb-4">Step 4 – Build the TypeScript project</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre className="text-white text-[14px] font-mono">
                    <code>npm run build</code>
                  </pre>
                </div>
                <p className="text-[18px] text-gray-700 mb-4">
                  This compiles <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">src/index.ts</code> to <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">build/index.js</code> as configured in <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">tsconfig.json</code>:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-white text-[14px] font-mono">
                    <code>{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`}</code>
                  </pre>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[24px] font-semibold text-black mb-4">Step 5 – Start the MCP server</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                  <pre className="text-white text-[14px] font-mono">
                    <code>node ./build/index.js</code>
                  </pre>
                </div>
                <p className="text-[18px] text-gray-700 mb-2">
                  This starts the OptiPrompt MCP server on stdio using the <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">McpServer</code> and <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">StdioServerTransport</code> from <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">@modelcontextprotocol/sdk</code>.
                </p>
                <p className="text-[18px] text-gray-700">
                  Optionally, because of the <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">bin</code> field in <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">package.json</code>, advanced users can install it globally (<code className="bg-gray-100 px-2 py-1 rounded text-[16px]">npm install -g .</code>) and then run <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">optiprompt</code> directly.
                </p>
              </div>
            </div>

            {/* What OptiPrompt provides */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">What OptiPrompt Provides</h2>
              <p className="text-[18px] text-gray-700 mb-4">
                The OptiPrompt MCP server exposes the following:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[18px] text-gray-700 mb-4 ml-4">
                <li><strong>MCP server name:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">"optiprompt"</code></li>
                <li><strong>Version:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">"1.0.0"</code></li>
                <li><strong>Single tool registered:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">"optimize-prompt"</code></li>
                <li><strong>Tool description:</strong> "Optimizes a user's prompt by refining it for clarity and effectiveness."</li>
                <li><strong>Input schema:</strong> one prompt string (validated with Zod)</li>
              </ul>
              <p className="text-[18px] text-gray-700">
                Under the hood, it calls <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">anthropic.messages.create</code> with model <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">claude-3-haiku-20240307</code> and a long system prompt (<code className="bg-gray-100 px-2 py-1 rounded text-[16px]">OPTIMIZATION_SYSTEM_PROMPT</code>) that combines five expert roles (Clarity, Code Quality, Security, Performance, Test Coverage) and returns a structured answer with sections like <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">## Clarity Refinement</code>, <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">## Final Optimized Prompt</code>, etc.
              </p>
            </div>

            {/* Connect to Claude Desktop */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">2. Connect OptiPrompt to Claude Desktop</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-[16px] text-blue-800">
                  <strong>Note:</strong> This section is for connecting OptiPrompt to Claude Desktop. If you're using Cursor, skip to the next section.
                </p>
              </div>
              <p className="text-[18px] text-gray-700 mb-4">
                Claude Desktop uses a <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">claude_desktop_config.json</code> file to register MCP servers. Create or edit this file and add the following snippet:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-white text-[14px] font-mono">
                  <code>{`{
  "mcpServers": {
    "optiprompt": {
      "command": "node",
      "args": ["ABSOLUTE_OR_RELATIVE_PATH_TO/OptiPrompt/build/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
      }
    }
  }
}`}</code>
                </pre>
              </div>
              <ul className="list-disc list-inside space-y-2 text-[18px] text-gray-700 mb-4 ml-4">
                <li>Replace <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">ABSOLUTE_OR_RELATIVE_PATH_TO/OptiPrompt/build/index.js</code> with the actual path on your machine (for example, <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">/Users/you/dev/OptiPrompt/build/index.js</code> on macOS/Linux or <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">C:\\Users\\you\\dev\\OptiPrompt\\build\\index.js</code> on Windows).</li>
                <li>Ensure the path points to the compiled file in <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">build/index.js</code>, not the TypeScript source.</li>
                <li>Either set the API key here in <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">env</code> or rely on the <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">.env</code> file and system environment variables (but do not hard-code real secrets in shared configs).</li>
              </ul>
              <p className="text-[18px] text-gray-700">
                After restarting Claude Desktop, there should be a tool/server named <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">optiprompt</code> available.
              </p>
            </div>

            {/* Visual Divider */}
            <div className="my-16 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-6">
                <span className="text-gray-500 text-[18px] font-medium">OR</span>
              </div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Connect to Cursor */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">3. Connect OptiPrompt to Cursor</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p className="text-[16px] text-green-800">
                  <strong>Note:</strong> This section is for connecting OptiPrompt to Cursor. The Anthropic API key is not required for Cursor integration.
                </p>
              </div>
              <p className="text-[18px] text-gray-700 mb-4">
                Cursor supports MCP servers via its config (for example <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">.cursor/config.json</code> in the workspace). Add the following snippet:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-white text-[14px] font-mono">
                  <code>{`{
  "mcpServers": {
    "optiprompt": {
      "command": "node",
      "args": ["../OptiPrompt/build/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE"
      }
    }
  }
}`}</code>
                </pre>
              </div>
              <ul className="list-disc list-inside space-y-2 text-[18px] text-gray-700 mb-4 ml-4">
                <li>The <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">"args"</code> path (<code className="bg-gray-100 px-2 py-1 rounded text-[16px]">../OptiPrompt/build/index.js</code>) is just an example assuming the user's project and the OptiPrompt repo are sibling folders. Adjust this according to your folder structure.</li>
                <li>The <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">ANTHROPIC_API_KEY</code> in the config is optional for Cursor. You can omit the <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">env</code> section entirely if you're only using Cursor.</li>
              </ul>
              <p className="text-[18px] text-gray-700">
                To verify in Cursor that the MCP server is detected, open the tools panel and look for <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">optiprompt</code> / <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">optimize-prompt</code>.
              </p>
            </div>

            {/* Global LLM Rule */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">4. Global LLM Rule (System Message)</h2>
              <p className="text-[18px] text-gray-700 mb-4">
                This is an optional but recommended text you can paste into the "system prompt" / "global instructions" area of Claude, Cursor, or other LLM tools:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-white text-[14px] font-mono whitespace-pre-wrap">
                  <code>{`When you need multi-step reasoning, complex planning, or careful prompt design, always call the MCP tool named "optimize-prompt" from the server "optiprompt" (also known as the Prompt Optimizer) before answering.

1. Send the user's raw request to "optimize-prompt".
2. Take the "Final Optimized Prompt" section from the tool's response.
3. Use that Final Optimized Prompt as your main instruction to complete the task.
4. Do not show the optimization internals to the user unless they explicitly ask.

Always follow this workflow whenever it would improve reasoning quality.`}</code>
                </pre>
              </div>
              <p className="text-[18px] text-gray-700">
                You can tweak the wording, but the idea is: use OptiPrompt first, then answer with the optimized prompt.
              </p>
            </div>

            {/* Example Workflow */}
            <div className="mb-16">
              <h2 className="text-[36px] font-bold text-black mb-6">5. Example: Using OptiPrompt in Practice</h2>
              <p className="text-[18px] text-gray-700 mb-4">
                Here's a simple workflow showing how OptiPrompt works:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-[18px] text-gray-700 mb-4 ml-4">
                <li>User types a messy prompt asking for a complex coding task.</li>
                <li>LLM calls the <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">optimize-prompt</code> tool of the <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">optiprompt</code> server.</li>
                <li>The tool returns the six structured sections, including <code className="bg-gray-100 px-2 py-1 rounded text-[16px]">## Final Optimized Prompt</code>.</li>
                <li>The LLM then uses that optimized prompt to produce the final answer.</li>
              </ol>
              <div className="bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-xl p-6 mt-6">
                <p className="text-[16px] text-[#010d3e] font-medium">
                  <strong>Note:</strong> This workflow happens automatically once OptiPrompt is configured. The LLM will use the optimized prompt behind the scenes to provide better responses.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 bg-gradient-to-br from-[#eaeefe] to-[#c1cefa] rounded-2xl p-10 text-center">
              <h2 className="text-[32px] font-bold text-black mb-4">Ready to Get Started?</h2>
              <p className="text-[18px] text-[#010d3e] mb-8 max-w-2xl mx-auto">
                Follow the steps above to set up OptiPrompt and start optimizing your prompts. If you run into any issues, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button 
                    variant="primary" 
                    className="rounded-[10px] bg-[#2563EB] hover:bg-[#1E40AF] transition-colors text-white px-8 py-3 h-[50px] text-[16px] font-medium"
                  >
                    Contact Support
                  </Button>
                </Link>
                <a 
                  href="https://github.com/AntonReise/OptiPrompt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="secondary" 
                    className="rounded-[10px] bg-white border border-gray-300 text-black hover:bg-gray-50 px-8 py-3 h-[50px] text-[16px] font-medium"
                  >
                    View on GitHub
                  </Button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}

