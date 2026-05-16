export async function fetchAITrivia() {
  const res = await fetch('/api/ai/trivia');
  if (!res.ok) throw new Error('AI Error');
  return res.json();
}

export async function fetchAIPersonalization(userData: any, matches: any[]) {
  const res = await fetch('/api/ai/personalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userData, matches })
  });
  if (!res.ok) throw new Error('AI Error');
  return res.json();
}

export async function fetchTacticalAnalysis(matchData: any) {
  const res = await fetch('/api/ai/analyze-tactics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchData })
  });
  if (!res.ok) throw new Error('AI Error');
  return res.json();
}
