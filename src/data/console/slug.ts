export function toSlug(name: string) {
  return name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-');
}

export function fromSlug(slug: string, candidates: string[]) {
  return candidates.find((name) => toSlug(name) === slug);
}
