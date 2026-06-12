export function normalize(input: string) {
  return input.trim().toLowerCase();
}

export function tokenize(input: string) {
  return normalize(input)
    .split(/\s+/)
    .filter(Boolean);
}

export function matchItems<T extends { label: string; keywords?: string[] }>(items: T[], query: string) {
  const q = normalize(query);
  if (!q) return items;
  const terms = tokenize(q);

  const scored = items
    .map((item) => {
      const hay = normalize([item.label, ...(item.keywords ?? [])].join(' '));
      let score = 0;
      if (hay.includes(q)) score += 10;
      for (const t of terms) {
        if (hay.includes(t)) score += 2;
      }
      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.item);
}

