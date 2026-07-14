// ============================================
// Scholar API - Google Scholar via SerpAPI
// ============================================

const SERPAPI_KEY = process.env.SERPAPI_KEY || "8fa820b9c4ec3e9cc4a67a5fde5509d54e1fab06f177ecd80c5003df8639caba";

// ← جديد: قائمة المواقع المحظورة (فيسبوك + تواصل اجتماعي + مدونات + ويكيبيديا)
const BLOCKED_DOMAINS = [
  'facebook.com', 'fb.com',
  'twitter.com', 'x.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'blogspot.com', 'wordpress.com',
  'medium.com',
  'quora.com',
  'reddit.com',
  'wikipedia.org',
  'slideshare.net',
  'researchgate.net',
];

export interface ScholarResult {
  title: string;
  authors: string;
  year: string;
  link: string;
  snippet: string;
  citedBy: number;
  pdfUrl?: string;
}

export async function searchGoogleScholar(query: string, numResults: number = 7): Promise<ScholarResult[]> {
  // ← جديد: نضيف as_ylo=2018 عشان يجيب مصادر من 2018 فما فوق
  const url = `https://serpapi.com/search.json?engine=google_scholar&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}&num=${numResults}&hl=en&as_ylo=2018`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`SerpAPI error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.organic_results || data.organic_results.length === 0) {
    return [];
  }

  // ← جديد: نفلتر النتائج ونستبعد المواقع المحظورة
  return data.organic_results
    .filter((r: any) => {
      const link = r.link || '';
      return !BLOCKED_DOMAINS.some(domain => link.includes(domain));
    })
    .map((r: any) => ({
      title: r.title,
      authors: r.publication_info?.authors?.map((a: any) => a.name).join(", ") || "Unknown",
      year: r.publication_info?.year || "N/A",
      link: r.link,
      snippet: r.snippet || "",
      citedBy: r.inline_links?.cited_by?.total || 0,
      pdfUrl: r.resources?.find((res: any) => res.file_format === "PDF")?.link,
    }));
}