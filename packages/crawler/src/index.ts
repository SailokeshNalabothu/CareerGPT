import { BaseAdapter } from './BaseAdapter.js';
import { GenericAdapter } from './adapters/GenericAdapter.js';
import { GoogleAdapter } from './adapters/GoogleAdapter.js';

export * from './BaseAdapter.js';
export * from './adapters/GenericAdapter.js';
export * from './adapters/GoogleAdapter.js';

/**
 * Adapter Factory mapping target career portals to custom scraping engines
 */
export function getAdapterForCompany(companyName: string, domain: string): BaseAdapter {
  const normalizedName = companyName.toLowerCase();
  const normalizedDomain = domain.toLowerCase();

  if (normalizedName === 'google' || normalizedDomain.includes('google.com') || normalizedDomain.includes('deepmind')) {
    return new GoogleAdapter();
  }

  // Fallback to standard HTTP Cheerio generic scraper
  return new GenericAdapter(companyName);
}
