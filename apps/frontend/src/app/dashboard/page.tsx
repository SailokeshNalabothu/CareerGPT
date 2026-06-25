"use client";

import { useEffect, useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Plus, 
  LogOut, 
  Globe, 
  BookOpen, 
  Settings, 
  Filter, 
  DollarSign, 
  Tag, 
  Check, 
  User, 
  X,
  ExternalLink,
  ChevronLeft
} from "lucide-react";

// Types matching the Prisma/DB collections
interface Company {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  techStack: string[];
}

interface Job {
  id: string;
  title: string;
  description: string;
  url: string;
  location: string;
  type: string;
  salaryRange?: string;
  experienceLevel?: string;
  skills: string[];
  company: Company;
}

interface LookupItem {
  id: string;
  name: string;
  code?: string;
}

export default function Dashboard() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState({ name: "Demo Admin", role: "ADMIN" });
  
  // Data lists
  const [jobs, setJobs] = useState<Job[]>([]);
  const [countries, setCountries] = useState<LookupItem[]>([]);
  const [roles, setRoles] = useState<LookupItem[]>([]);
  const [skills, setSkills] = useState<LookupItem[]>([]);
  
  // Query Filters state
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  // UI states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Admin Job Creation Form state
  const [newJob, setNewJob] = useState({
    title: "",
    companyName: "",
    description: "",
    url: "",
    location: "",
    type: "FULL_TIME",
    salaryRange: "",
    experienceLevel: "",
    skillsInput: "",
    roleId: "",
    countryId: ""
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // Fetch data from API Gateway
  const fetchData = async () => {
    setLoading(true);
    try {
      // Build filter params
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (selectedCountry) {
        const matchingCountry = countries.find(c => c.id === selectedCountry);
        if (matchingCountry) queryParams.append("location", matchingCountry.name);
      }
      if (selectedType) queryParams.append("type", selectedType);

      const [jobsRes, countriesRes, rolesRes, skillsRes] = await Promise.all([
        fetch(`${API_BASE}/jobs?${queryParams.toString()}`),
        fetch(`${API_BASE}/countries`),
        fetch(`${API_BASE}/roles`),
        fetch(`${API_BASE}/skills`)
      ]);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }
      if (countriesRes.ok) {
        const cData = await countriesRes.json();
        setCountries(cData.countries || []);
      }
      if (rolesRes.ok) {
        const rData = await rolesRes.json();
        setRoles(rData.roles || []);
      }
      if (skillsRes.ok) {
        const sData = await skillsRes.json();
        setSkills(sData.skills || []);
      }
    } catch (err) {
      console.error("Failed to fetch data from API Gateway, utilizing local memory states.", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    fetchData();
  }, [search, selectedCountry, selectedType]);

  // Handle Admin Job Submission
  const handleAddJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newJob.title || !newJob.companyName || !newJob.description || !newJob.url || !newJob.location) {
      setFormError("All required fields must be filled out");
      return;
    }

    try {
      const skillsArray = newJob.skillsInput
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Map country and role names for creation validation
      const targetCountry = countries.find(c => c.id === newJob.countryId);
      const targetRole = roles.find(r => r.id === newJob.roleId);

      const payload = {
        title: newJob.title,
        companyName: newJob.companyName,
        description: newJob.description,
        url: newJob.url,
        location: newJob.location,
        type: newJob.type,
        salaryRange: newJob.salaryRange || undefined,
        experienceLevel: newJob.experienceLevel || undefined,
        skills: skillsArray,
        roleId: newJob.roleId || undefined,
        countryId: newJob.countryId || undefined
      };

      // In client testing, we simulate authorization token. In Phase 2 gateway, authenticate middleware checks cookies.
      const res = await fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess("Job listing added successfully!");
        setNewJob({
          title: "",
          companyName: "",
          description: "",
          url: "",
          location: "",
          type: "FULL_TIME",
          salaryRange: "",
          experienceLevel: "",
          skillsInput: "",
          roleId: "",
          countryId: ""
        });
        fetchData(); // reload jobs
        setTimeout(() => setIsAdminModalOpen(false), 1200);
      } else {
        if (data.errors) {
          const errorMsgs = Object.entries(data.errors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join(" | ");
          setFormError(errorMsgs);
        } else {
          setFormError(data.message || "Failed to add job listing");
        }
      }
    } catch (err) {
      console.error(err);
      setFormError("Connection error: Ensure backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 font-sans flex flex-col">
      {/* Header bar */}
      <header className="border-b border-zinc-800/80 bg-black/40 backdrop-blur-md h-16 flex items-center shrink-0">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Career<span className="text-indigo-400">GPT</span> Dashboard
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs">
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-medium text-gray-300">{currentUser.name}</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">
                {currentUser.role}
              </span>
            </div>
            <button className="text-xs hover:text-white text-gray-400 flex items-center gap-1.5 transition-colors">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main workspace layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex gap-8 overflow-hidden">
        {/* Left Filters Sidebar */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col gap-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-400" />
              Filter Opportunities
            </h3>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Keyword, company..." 
                  className="w-full bg-black border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors text-white"
                />
              </div>
            </div>

            {/* Country Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">All Countries</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Type selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Employment Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full-Time</option>
                <option value="PART_TIME">Part-Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-Site</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button 
              onClick={() => {
                setSearch("");
                setSelectedCountry("");
                setSelectedRole("");
                setSelectedType("");
              }}
              className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors py-2"
            >
              Reset Filters
            </button>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Trending Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span 
                  key={s.id} 
                  onClick={() => setSearch(s.name)}
                  className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded hover:border-indigo-500 cursor-pointer transition-colors text-gray-400"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right main feed */}
        <section className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[85vh] pr-2">
          {/* Feed Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Explore Openings</h2>
              <p className="text-xs text-gray-400">Showing {jobs.length} jobs in MongoDB sync</p>
            </div>

            {currentUser.role === "ADMIN" && (
              <button 
                onClick={() => setIsAdminModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/10"
              >
                <Plus className="h-4 w-4" />
                Add Job Listing
              </button>
            )}
          </div>

          {/* Job Feed Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-24">
              <span className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl p-5 cursor-pointer transition-all flex flex-col md:flex-row justify-between md:items-center gap-4 ${selectedJob?.id === job.id ? 'border-indigo-500 shadow-md shadow-indigo-500/5' : ''}`}
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span className="font-semibold text-indigo-400">{job.company.name}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-500" /> {job.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills.map(s => (
                        <span key={s} className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-gray-400">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                    <span className="text-xs font-semibold text-emerald-400 font-mono">{job.salaryRange || "Salary Not Disclosed"}</span>
                    <span className="text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-950/20 border border-zinc-900/60 rounded-xl py-24 text-center text-gray-500">
              <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No job opportunities found matching filters.</p>
            </div>
          )}

          {/* Job Details Drawer */}
          {selectedJob && (
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-xl p-6 space-y-4 animate-fade-in shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedJob.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-indigo-300 font-semibold mt-1">
                    <span>{selectedJob.company.name}</span>
                    <a href={`https://${selectedJob.company.domain}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300 inline-flex items-center gap-0.5">
                      {selectedJob.company.domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 border-y border-zinc-900 py-4 text-xs text-gray-400">
                <div className="space-y-1">
                  <span className="block text-gray-500 uppercase tracking-wider font-semibold">Location</span>
                  <span className="text-white flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-indigo-400" /> {selectedJob.location}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-gray-500 uppercase tracking-wider font-semibold">Job Type</span>
                  <span className="text-white flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-indigo-400" /> {selectedJob.type}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-gray-500 uppercase tracking-wider font-semibold">Salary Range</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {selectedJob.salaryRange || "Not Disclosed"}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-gray-500 uppercase tracking-wider font-semibold">Experience Level</span>
                  <span className="text-white flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-indigo-400" /> {selectedJob.experienceLevel || "Not Disclosed"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Description</h4>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.company.techStack.map(t => (
                    <span key={t} className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-gray-400">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a 
                  href={selectedJob.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  Apply Directly
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Admin Job Creation Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-500" />
                Create New Job listing
              </h3>
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddJobSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {formError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs">{formError}</div>}
              {formSuccess && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs">{formSuccess}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Job Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. AI Engineer" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.companyName}
                    onChange={(e) => setNewJob({...newJob, companyName: e.target.value})}
                    placeholder="e.g. Google" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Location *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    placeholder="e.g. Munich, Germany" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Job Type *</label>
                  <select 
                    value={newJob.type}
                    onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="PART_TIME">Part-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERN">Intern</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">On-Site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Country Relationship</label>
                  <select 
                    value={newJob.countryId}
                    onChange={(e) => setNewJob({...newJob, countryId: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">None / Global</option>
                    {countries.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Role Relationship</label>
                  <select 
                    value={newJob.roleId}
                    onChange={(e) => setNewJob({...newJob, roleId: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">None / Custom</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Salary Range</label>
                  <input 
                    type="text" 
                    value={newJob.salaryRange}
                    onChange={(e) => setNewJob({...newJob, salaryRange: e.target.value})}
                    placeholder="e.g. $100,000 - $120,000" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Experience Level</label>
                  <input 
                    type="text" 
                    value={newJob.experienceLevel}
                    onChange={(e) => setNewJob({...newJob, experienceLevel: e.target.value})}
                    placeholder="e.g. Senior" 
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Apply URL *</label>
                <input 
                  type="url" 
                  required
                  value={newJob.url}
                  onChange={(e) => setNewJob({...newJob, url: e.target.value})}
                  placeholder="https://careers.google.com/jobs/..." 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Skills (Comma separated) *</label>
                <input 
                  type="text" 
                  required
                  value={newJob.skillsInput}
                  onChange={(e) => setNewJob({...newJob, skillsInput: e.target.value})}
                  placeholder="Python, React, SQL" 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Job Description *</label>
                <textarea 
                  rows={4}
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Enter detailed job description here..." 
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-900">
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors"
                >
                  Create Listing
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-gray-300 border border-zinc-800 text-xs py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
