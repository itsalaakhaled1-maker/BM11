// ============================================
// Search API - Google Search via Serper.dev
// ============================================

const SERPER_API_KEY = process.env.SERPER_API_KEY || "8b6cf94b58db1b9fb7b59be2887732f411e976ca";
const SERPER_API_URL = "https://google.serper.dev/search";

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

export async function searchGoogle(query: string, numResults: number = 7): Promise<SearchResult[]> {
  const response = await fetch(SERPER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": SERPER_API_KEY,
    },
    body: JSON.stringify({
      q: query,
      num: numResults,
      hl: "en",
      gl: "us",
    }),
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status}`);
  }

  const data = await response.json();
  const results: SearchResult[] = [];

  if (data.organic) {
    data.organic.forEach((item: any) => {
      results.push({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        source: new URL(item.link).hostname.replace('www.', ''),
      });
    });
  }

  return results.slice(0, numResults);
}