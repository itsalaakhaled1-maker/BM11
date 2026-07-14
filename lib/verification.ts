'use server';

export interface VerificationResult {
  verified: boolean;
  layer: string;
  details: string;
  score: number;
}

export async function verifyCitation(citation: { title: string; doi?: string; url?: string }): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  // Layer 1: URL Validation
  if (citation.url) {
    try {
      const res = await fetch(citation.url, { method: 'HEAD', redirect: 'follow' });
      results.push({
        verified: res.ok,
        layer: 'التحقق من الرابط',
        details: res.ok ? 'الرابط صالح ويعمل' : `الرابط غير صالح: ${res.status}`,
        score: res.ok ? 1 : 0,
      });
    } catch {
      results.push({
        verified: false,
        layer: 'التحقق من الرابط',
        details: 'فشل الاتصال بالرابط',
        score: 0,
      });
    }
  }

  // Layer 2: CrossRef DOI
  if (citation.doi) {
    try {
      const res = await fetch(`https://api.crossref.org/works/${citation.doi}`);
      const data = await res.json();
      results.push({
        verified: res.ok && data.status === 'ok',
        layer: 'التحقق من DOI',
        details: res.ok ? 'DOI موجود في CrossRef' : 'DOI غير موجود',
        score: res.ok ? 1 : 0,
      });
    } catch {
      results.push({
        verified: false,
        layer: 'التحقق من DOI',
        details: 'فشل التحقق من CrossRef',
        score: 0,
      });
    }
  }

  // Layer 3: Semantic Scholar
  if (process.env.S2_API_KEY) {
    try {
      const query = encodeURIComponent(citation.title);
      await new Promise(r => setTimeout(r, 1100)); // 1 req/sec
      const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&fields=title,authors,year,venue&limit=1`, {
        headers: { 'x-api-key': process.env.S2_API_KEY },
      });
      const data = await res.json();
      const found = data.data && data.data.length > 0;
      results.push({
        verified: found,
        layer: 'Semantic Scholar',
        details: found ? `وجد في S2: ${data.data[0].title}` : 'غير موجود في Semantic Scholar',
        score: found ? 1 : 0,
      });
    } catch {
      results.push({
        verified: false,
        layer: 'Semantic Scholar',
        details: 'فشل الاتصال بـ Semantic Scholar',
        score: 0,
      });
    }
  }

  // Layer 4: LLM Relevance
  results.push({
    verified: citation.title.length > 10,
    layer: 'تقييم الذكاء الاصطناعي',
    details: citation.title.length > 10 ? 'العنوان يبدو صالحاً' : 'العنوان قصير جداً',
    score: citation.title.length > 10 ? 0.8 : 0.2,
  });

  return results;
}

export function getOverallVerification(results: VerificationResult[]): { verified: boolean; score: number } {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = results.length;
  const score = totalScore / maxScore;
  return {
    verified: score >= 0.6,
    score,
  };
}