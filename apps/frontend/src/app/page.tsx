"use client";

import { useState } from "react";
import { 
  Briefcase, 
  Cpu, 
  MapPin, 
  Search, 
  Terminal, 
  UploadCloud, 
  Layers, 
  Globe, 
  ShieldCheck, 
  CheckCircle,
  Database,
  ExternalLink,
  ChevronRight
} from "lucide-react";

// Mock Jobs data for the interactive live demo
const MOCK_JOBS = [
  { id: "1", title: "AI Research Engineer", company: "DeepMind", location: "London, UK (Hybrid)", type: "Full-Time", salary: "$180,000 - $240,000", skills: ["Python", "PyTorch", "LLMs", "GenAI"] },
  { id: "2", title: "Senior Full Stack Developer", company: "Stripe", location: "San Francisco, CA (Remote)", type: "Full-Time", salary: "$160,000 - $210,000", skills: ["React", "Node.js", "TypeScript", "PostgreSQL"] },
  { id: "3", title: "Distributed Systems Engineer", company: "Cloudflare", location: "Austin, TX (On-site)", type: "Contract", salary: "$140 - $180 / hr", skills: ["Rust", "Go", "Kubernetes", "Linux"] },
  { id: "4", title: "Data Analyst (Career Intelligence)", company: "Google", location: "Munich, Germany (Hybrid)", type: "Full-Time", salary: "€95,000 - €120,000", skills: ["Python", "SQL", "Tableau", "BigQuery"] },
  { id: "5", title: "Backend Systems Lead", company: "Vercel", location: "New York, NY (Remote)", type: "Full-Time", salary: "$175,000 - $220,000", skills: ["TypeScript", "Next.js", "Redis", "Edge Computing"] },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<typeof MOCK_JOBS[0] | null>(null);

  // Filter jobs based on interactive search
  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* Background Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />

      {/* Header / Nav */}
      <header className="border-b border-zinc-800/80 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Cpu className="h-5 w-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Career<span className="text-indigo-400">GPT</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#playground" className="hover:text-white transition-colors">API Playground</a>
            <a href="#setup" className="hover:text-white transition-colors">Setup Docs</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              API Gateway Online
            </div>
            <button className="text-sm font-medium hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-800">
              Sign In
            </button>
            <button className="text-sm font-medium bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 text-white">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 animate-fade-in">
          <Layers className="h-3.5 w-3.5" />
          Production-Grade Distributed System
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.15]">
          Global Career Intelligence <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Powered by Google Gemini
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          Automatically discover, parse, structure, and match job opportunities directly from company career pages with real-time health checks, skill extraction, and salary mapping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="#playground" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3.5 rounded-lg transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02]">
            Start Searching
            <ChevronRight className="h-4 w-4" />
          </a>
          <a href="#architecture" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-gray-200 font-medium px-6 py-3.5 rounded-lg transition-colors">
            <Terminal className="h-4 w-4 text-indigo-400" />
            Explore System Architecture
          </a>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="w-full max-w-5xl mx-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-1.5 backdrop-blur-sm shadow-2xl shadow-indigo-500/5">
          <div className="rounded-lg border border-zinc-900 bg-black/60 p-4 md:p-6 text-left">
            {/* Terminal mock header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500 font-mono ml-2">careergpt-crawler-logs</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                <span>Jobs Parsed: 12,450</span>
                <span className="hidden sm:inline">Active Queues: 3</span>
              </div>
            </div>

            {/* Simulated Live Scraper logs */}
            <div className="font-mono text-xs text-gray-400 space-y-2.5 overflow-hidden max-h-48 overflow-y-auto">
              <p className="text-gray-500">[2026-06-25 09:30:15] <span className="text-indigo-400">INFO:</span> Starting scheduled crawler worker execution...</p>
              <p className="text-gray-500">[2026-06-25 09:30:18] <span className="text-indigo-400">INFO:</span> Crawling careers.stripe.com using Cheerio fallback adapter...</p>
              <p className="text-emerald-400">[2026-06-25 09:30:20] SUCCESS: Found 12 job URLs. Enqueuing to parsing pipeline.</p>
              <p className="text-gray-500">[2026-06-25 09:30:21] <span className="text-indigo-400">INFO:</span> Dispatching job link to worker-ai queue: AI Parser...</p>
              <p className="text-purple-400">[2026-06-25 09:30:24] GEMINI-API: Structuring "Senior Developer" payload. Output Schema verified.</p>
              <p className="text-blue-400">[2026-06-25 09:30:25] DB: Inserted 1 new job into MongoDB Atlas collection.</p>
              <p className="text-emerald-400">[2026-06-25 09:30:27] SUCCESS: Verifying link health for deepmind.com/careers - Status 200 OK.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ingestion Engine & AI Capabilities</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Built from the ground up to solve the challenges of real-time data collection and semantic searching.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all group hover:bg-zinc-900/10">
            <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Crawler Adapter System</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Avoids complex "one-size-fits-all" crawlers. Individual adapters handle JavaScript-heavy rendering (Playwright) or static pipelines (Cheerio) per domain.
            </p>
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="bg-zinc-900 px-2 py-1 rounded">Playwright</span>
              <span className="bg-zinc-900 px-2 py-1 rounded">Cheerio</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all group hover:bg-zinc-900/10">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Job Parser</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Converts massive unstructured job descriptions into clean, formatted JSON payloads using Gemini API Structured Output Schemas.
            </p>
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="bg-zinc-900 px-2 py-1 rounded">Gemini-1.5</span>
              <span className="bg-zinc-900 px-2 py-1 rounded">JSON Schema</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all group hover:bg-zinc-900/10">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Semantic Resume Matching</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Generate embeddings from uploaded resumes and execute semantic vector searches directly within MongoDB Atlas to match users with roles.
            </p>
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="bg-zinc-900 px-2 py-1 rounded">Vector Search</span>
              <span className="bg-zinc-900 px-2 py-1 rounded">Embeddings</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all group hover:bg-zinc-900/10">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Link Health Monitor</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Background queue verify links every 24 hours. Flags redirects, marks expired jobs, updates active logs, and triggers auto-cleanup.
            </p>
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="bg-zinc-900 px-2 py-1 rounded">Cron Schedule</span>
              <span className="bg-zinc-900 px-2 py-1 rounded">Health Check</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all group hover:bg-zinc-900/10">
            <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Distributed Queues</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Built on BullMQ and Redis to isolate scrapers, verification, and AI processing, guaranteeing message delivery and rate limit safety.
            </p>
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="bg-zinc-900 px-2 py-1 rounded">BullMQ</span>
              <span className="bg-zinc-900 px-2 py-1 rounded">Redis Cache</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all group hover:bg-zinc-900/10">
            <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Salary & Trends</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              AI estimates salaries when omitted. Skill graph processes skills used over the last 30 days to highlight trending technologies.
            </p>
            <div className="flex gap-2 text-xs font-mono text-gray-500">
              <span className="bg-zinc-900 px-2 py-1 rounded">Trend Analytics</span>
              <span className="bg-zinc-900 px-2 py-1 rounded">Skill Mapping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Production Architecture Section */}
      <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Production Architecture</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              This platform isn&apos;t just a simple client-server application. It is designed as a distributed, decoupled monorepo composed of autonomous packages and applications communicating through secure APIs and background message queues.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mt-1 shrink-0">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span><strong>API Gateway</strong> serves as the auth router and client endpoints, built using Node.js & Express.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mt-1 shrink-0">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span><strong>Prisma ORM</strong> integrates with MongoDB Atlas Cluster, using schema verification at compile-time.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mt-1 shrink-0">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span><strong>Next.js App Router</strong> manages the frontend layout with server-side caching and dynamic client interactivity.</span>
              </li>
            </ul>
          </div>

          {/* Graphical Representation */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 font-mono text-xs text-gray-400 space-y-4">
            <h4 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" />
              Turborepo Package Topology
            </h4>
            <pre className="text-indigo-300 leading-relaxed">
{`apps/
  ├── frontend/         ---> [Next.js Web Interface]
  └── backend/          ---> [Express API Gateway]
                            |
                            V (Uses Shared Packages)
packages/
  ├── database/         ---> [Prisma ORM + MongoDB Client]
  ├── auth/             ---> [JWT Token Hashing & Signer]
  └── shared/           ---> [Zod Payload Validators]`}
            </pre>
            <div className="h-px bg-zinc-900 my-4" />
            <div className="flex justify-between items-center text-[10px] text-gray-500">
              <span>Status: Fully Configured</span>
              <span>Workspace: Turborepo / pnpm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Job Explorer Playground */}
      <section id="playground" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Interactive Platform Playground</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Try searching for jobs or skills. This simulates the vector-backed, live database endpoints we scaffolded in Phase 1.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Search column */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search skill (e.g. Python, React, Rust)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
              />
            </div>
            
            <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Skill Filters</h4>
              <div className="flex flex-wrap gap-2">
                {["Python", "React", "TypeScript", "Rust", "LLMs", "Redis"].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs bg-zinc-900 hover:bg-indigo-950/60 hover:text-indigo-300 border border-zinc-800 hover:border-indigo-900 px-3 py-1.5 rounded-full transition-all text-gray-300"
                  >
                    {tag}
                  </button>
                ))}
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Job listings column */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-1 overflow-hidden">
              {filteredJobs.length > 0 ? (
                <div className="divide-y divide-zinc-900">
                  {filteredJobs.map((job) => (
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJob(job)}
                      className={`p-4 hover:bg-zinc-900/30 transition-all cursor-pointer flex justify-between items-center group ${selectedJob?.id === job.id ? 'bg-indigo-950/20 border-l-2 border-indigo-500' : ''}`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="font-semibold text-gray-300">{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {job.skills.map((skill) => (
                            <span key={skill} className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-gray-400">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-400 font-mono block">{job.salary}</span>
                        <span className="inline-block text-[10px] uppercase font-bold px-2 py-0.5 bg-zinc-900 rounded text-gray-500 mt-2">{job.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No jobs found matching your query.</p>
                </div>
              )}
            </div>

            {/* Selected job details drawer */}
            {selectedJob && (
              <div className="bg-indigo-950/10 border border-indigo-900/40 rounded-xl p-5 space-y-4 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedJob.title}</h3>
                    <p className="text-sm text-indigo-300 font-semibold">{selectedJob.company}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">{selectedJob.salary}</span>
                </div>
                <div className="text-xs text-gray-400 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {selectedJob.type}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  This job has been scraped, verified, and parsed into CareerGPT. In production, this record includes full-text search indexing, direct application URL routing, and real-time status tracking updates.
                </p>
                <div className="flex gap-2">
                  <button className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    Apply Now
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  <button className="text-xs bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-zinc-800 px-4 py-2 rounded-lg transition-colors" onClick={() => setSelectedJob(null)}>
                    Close Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Setup / CLI helper instructions */}
      <section id="setup" className="py-24 px-6 max-w-7xl mx-auto border-t border-zinc-900 bg-black/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">Local Developer Setup</h2>
          <p className="text-gray-400 text-center mb-10">We have fully scaffolded the foundation code! Here is how to run the services on your machine:</p>

          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 font-mono text-xs space-y-6">
            <div>
              <p className="text-gray-400 mb-2"># 1. Start MongoDB replica set & Redis inside Docker (External Terminal)</p>
              <div className="bg-black p-3.5 rounded-lg border border-zinc-900 text-indigo-400">
                docker compose up -d
              </div>
            </div>

            <div>
              <p className="text-gray-400 mb-2"># 2. Install workspace dependencies from the root</p>
              <div className="bg-black p-3.5 rounded-lg border border-zinc-900 text-indigo-400">
                pnpm install
              </div>
            </div>

            <div>
              <p className="text-gray-400 mb-2"># 3. Synchronize your Prisma models with your MongoDB instance</p>
              <div className="bg-black p-3.5 rounded-lg border border-zinc-900 text-indigo-400">
                pnpm db:generate<br />
                pnpm db:push
              </div>
            </div>

            <div>
              <p className="text-gray-400 mb-2"># 4. Spin up Frontend (3000) & Backend API (5000) concurrently</p>
              <div className="bg-black p-3.5 rounded-lg border border-zinc-900 text-indigo-400">
                pnpm dev
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 bg-black/60 relative z-10 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-300">CareerGPT</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="https://github.com/SailokeshNalabothu/CareerGPT" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors inline-flex items-center gap-1">
              GitHub Repository
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
