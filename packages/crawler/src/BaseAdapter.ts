export interface ScrapedJob {
  title: string;
  description: string;
  url: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'REMOTE' | 'HYBRID' | 'ONSITE';
  salaryRange?: string;
  experienceLevel?: string;
  skills: string[];
  companyName: string;
}

export abstract class BaseAdapter {
  abstract companyName: string;

  /**
   * Scrapes the target URL and returns a list of formatted ScrapedJob results.
   */
  abstract scrape(url: string): Promise<ScrapedJob[]>;
}
