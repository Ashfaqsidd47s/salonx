export const countries = [
  { cca2: "US", name: { common: "United States" } },
  { cca2: "CA", name: { common: "Canada" } },
  { cca2: "GB", name: { common: "United Kingdom" } },
  { cca2: "AU", name: { common: "Australia" } },
  { cca2: "IN", name: { common: "India" } },
  { cca2: "FR", name: { common: "France" } },
  { cca2: "DE", name: { common: "Germany" } },
  { cca2: "JP", name: { common: "Japan" } },
  { cca2: "CN", name: { common: "China" } },
  { cca2: "BR", name: { common: "Brazil" } },
  // Add more countries as needed
].sort((a, b) => a.name.common.localeCompare(b.name.common));