import { prisma } from './index.js';

// Simple helper to create slug
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records (Optional, delete lookups and jobs first due to relations)
  console.log('🧹 Cleaning database collections...');
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.jobRole.deleteMany();
  await prisma.country.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.crawlerLog.deleteMany();
  await prisma.workerLog.deleteMany();

  // 2. Create Master Lookups: Countries
  console.log('🌍 Seeding countries...');
  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'India', code: 'IN' },
    { name: 'Germany', code: 'DE' },
    { name: 'Japan', code: 'JP' },
    { name: 'United Kingdom', code: 'GB' },
  ];

  const seededCountries: any[] = [];
  for (const c of countries) {
    const item = await prisma.country.create({ data: c });
    seededCountries.push(item);
  }

  // 3. Create Master Lookups: Job Roles
  console.log('💼 Seeding job roles...');
  const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'AI Engineer',
    'Data Analyst',
    'DevOps Engineer',
    'Mobile Developer',
  ];

  const seededRoles: any[] = [];
  for (const r of roles) {
    const item = await prisma.jobRole.create({
      data: { name: r, slug: slugify(r) },
    });
    seededRoles.push(item);
  }

  // 4. Create Master Lookups: Skills
  console.log('🛠️ Seeding skills...');
  const skills = [
    'Python',
    'PyTorch',
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Rust',
    'Go',
    'SQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'LLMs',
    'GenAI',
  ];

  for (const s of skills) {
    await prisma.skill.create({
      data: { name: s, slug: slugify(s) },
    });
  }

  // 5. Create Companies
  console.log('🏢 Seeding companies...');
  const companies = [
    {
      name: 'Google',
      domain: 'google.com',
      logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&h=128&fit=crop',
      techStack: ['Python', 'Go', 'TypeScript', 'Kubernetes'],
      hiringTrends: ['Growing', 'AI/Cloud Focus'],
      hiringLocations: ['Munich, Germany', 'Mountain View, CA', 'Bangalore, India'],
      avgSalary: 145000,
      remotePercent: 20,
    },
    {
      name: 'Stripe',
      domain: 'stripe.com',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
      techStack: ['Ruby', 'Go', 'React', 'TypeScript'],
      hiringTrends: ['Stable', 'Remote First'],
      hiringLocations: ['San Francisco, CA', 'Dublin, Ireland', 'Remote'],
      avgSalary: 165000,
      remotePercent: 80,
    },
    {
      name: 'DeepMind',
      domain: 'deepmind.google',
      logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=128&h=128&fit=crop',
      techStack: ['Python', 'PyTorch', 'C++', 'Kubernetes'],
      hiringTrends: ['Aggressive', 'GenAI Research'],
      hiringLocations: ['London, UK', 'Paris, France', 'Mountain View, CA'],
      avgSalary: 195000,
      remotePercent: 10,
    },
    {
      name: 'Cloudflare',
      domain: 'cloudflare.com',
      logoUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=128&h=128&fit=crop',
      techStack: ['Rust', 'Go', 'TypeScript', 'Edge Computing'],
      hiringTrends: ['Growing', 'Wasm/Edge focus'],
      hiringLocations: ['Austin, TX', 'London, UK', 'Lisbon, Portugal'],
      avgSalary: 135000,
      remotePercent: 40,
    },
    {
      name: 'Vercel',
      domain: 'vercel.com',
      logoUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=128&h=128&fit=crop',
      techStack: ['TypeScript', 'Next.js', 'Redis', 'React'],
      hiringTrends: ['Growing', 'Frontend Cloud'],
      hiringLocations: ['New York, NY', 'Dublin, Ireland', 'Remote'],
      avgSalary: 155000,
      remotePercent: 95,
    },
  ];

  const seededCompanies: any[] = [];
  for (const c of companies) {
    const item = await prisma.company.create({ data: c });
    seededCompanies.push(item);
  }

  // Helper resolvers
  const getCompanyId = (name: string) => seededCompanies.find((co) => co.name === name)!.id;
  const getRoleId = (name: string) => seededRoles.find((ro) => ro.name === name)!.id;
  const getCountryId = (name: string) => seededCountries.find((co) => co.name === name)!.id;

  // 6. Create Jobs
  console.log('💼 Seeding jobs listings...');
  const jobsData = [
    {
      title: 'AI Research Engineer',
      description: 'Join the DeepMind AI research team. Work on the next generation of large language models, structured reasoning agents, and multimodal reasoning systems using Python and PyTorch.',
      url: 'https://deepmind.google/careers/ai-research-engineer',
      location: 'London, UK (Hybrid)',
      type: 'FULL_TIME',
      salaryRange: '$180,000 - $240,000',
      experienceLevel: 'Senior / PhD',
      skills: ['Python', 'PyTorch', 'LLMs', 'GenAI'],
      companyId: getCompanyId('DeepMind'),
      roleId: getRoleId('AI Engineer'),
      countryId: getCountryId('United Kingdom'),
      isVerified: true,
    },
    {
      title: 'Senior Full Stack Developer',
      description: 'Build premium payments dashboards and APIs at Stripe. Full-stack development with a strong focus on TypeScript, React components, Node.js endpoints, and transactional consistency.',
      url: 'https://stripe.com/jobs/senior-full-stack',
      location: 'San Francisco, CA (Remote)',
      type: 'REMOTE',
      salaryRange: '$160,000 - $210,000',
      experienceLevel: 'Senior',
      skills: ['React', 'TypeScript', 'Node.js', 'SQL'],
      companyId: getCompanyId('Stripe'),
      roleId: getRoleId('Full Stack Developer'),
      countryId: getCountryId('United States'),
      isVerified: true,
    },
    {
      title: 'Distributed Systems Engineer',
      description: 'Work on Cloudflare edge network infrastructure. Write fast and secure packet processors, routing proxies, and CDN caching systems using Rust, Go, and Linux systems programming.',
      url: 'https://cloudflare.com/careers/distributed-systems',
      location: 'Austin, TX (On-site)',
      type: 'ONSITE',
      salaryRange: '$140,000 - $185,000',
      experienceLevel: 'Mid-Senior',
      skills: ['Rust', 'Go', 'Docker', 'Kubernetes'],
      companyId: getCompanyId('Cloudflare'),
      roleId: getRoleId('Software Engineer'),
      countryId: getCountryId('United States'),
      isVerified: true,
    },
    {
      title: 'Backend Systems Lead',
      description: 'Lead backend performance optimizations at Vercel. Develop serverless, edge network proxies, caching configurations, and integrate real-time databases using Node.js, Redis, and Next.js routers.',
      url: 'https://vercel.com/jobs/backend-systems-lead',
      location: 'New York, NY (Remote)',
      type: 'HYBRID',
      salaryRange: '$175,000 - $220,000',
      experienceLevel: 'Lead',
      skills: ['TypeScript', 'Next.js', 'Redis', 'MongoDB'],
      companyId: getCompanyId('Vercel'),
      roleId: getRoleId('Backend Developer'),
      countryId: getCountryId('United States'),
      isVerified: true,
    },
    {
      title: 'Data Analyst (Career Intelligence)',
      description: 'Analyze worldwide hiring behaviors and trends. Query, clean, and analyze high-volume scraper payloads using Python, SQL, and database visualization patterns.',
      url: 'https://google.com/careers/data-analyst-career-intel',
      location: 'Munich, Germany (Hybrid)',
      type: 'HYBRID',
      salaryRange: '€95,000 - €120,000',
      experienceLevel: 'Mid-Level',
      skills: ['Python', 'SQL', 'MongoDB'],
      companyId: getCompanyId('Google'),
      roleId: getRoleId('Data Analyst'),
      countryId: getCountryId('Germany'),
      isVerified: true,
    },
  ];

  for (const j of jobsData) {
    await prisma.job.create({ data: j });
  }

  // Update open roles counts
  for (const co of seededCompanies) {
    const jobsCount = await prisma.job.count({ where: { companyId: co.id } });
    await prisma.company.update({
      where: { id: co.id },
      data: { openRolesCount: jobsCount },
    });
  }

  console.log('✅ Database successfully seeded with mock lookups and job listings!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
