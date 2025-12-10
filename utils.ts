export const formatMoney = (amount: number): string => {
  if (amount < 1000) return `$${amount.toFixed(2)}`;
  
  const suffixes = ["", "k", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "d"];
  const suffixNum = Math.floor(("" + Math.floor(amount)).length / 3);
  
  let shortValue = parseFloat((suffixNum !== 0 ? (amount / Math.pow(1000, suffixNum)) : amount).toPrecision(3));
  if (shortValue % 1 !== 0) {
      shortValue = parseFloat(shortValue.toFixed(2));
  }
  return `$${shortValue}${suffixes[suffixNum]}`;
};

export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  const suffixes = ["", "k", "M", "B", "T", "q", "Q"];
  const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
  let shortValue = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
  return `${shortValue}${suffixes[suffixNum]}`;
};

export const calculateCost = (baseCost: number, multiplier: number, currentLevel: number): number => {
  return baseCost * Math.pow(multiplier, currentLevel);
};
