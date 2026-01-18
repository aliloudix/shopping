export const getCategoryEmoji = (name) => {
  if (!name) return '📦';
  const normalized = name.toLowerCase();
  
  if (normalized.includes('homme') || normalized.includes('men')) return '👨';
  if (normalized.includes('femme') || normalized.includes('women') || normalized.includes('dame')) return '👩';
  if (normalized.includes('enfant') || normalized.includes('kids') || normalized.includes('fille') || normalized.includes('garçon') || normalized.includes('bebe') || normalized.includes('bébé')) return '👶';
  if (normalized.includes('sport') || normalized.includes('gym') || normalized.includes('fitness')) return '🏃';
  if (normalized.includes('accessoire') || normalized.includes('accessories') || normalized.includes('bijou') || normalized.includes('sac') || normalized.includes('lunette')) return '🧢';
  if (normalized.includes('chaussure') || normalized.includes('basket') || normalized.includes('botte')) return '👟';
  if (normalized.includes('vêtement') || normalized.includes('vetement') || normalized.includes('habit') || normalized.includes('pull') || normalized.includes('shirt') || normalized.includes('pantalon') || normalized.includes('robe') || normalized.includes('jupe')) return '👕';
  if (normalized.includes('été') || normalized.includes('ete') || normalized.includes('plage')) return '☀️';
  if (normalized.includes('hiver') || normalized.includes('froid')) return '❄️';
  if (normalized.includes('promo')) return '🏷️';
  if (normalized.includes('nouveau') || normalized.includes('nouvelle')) return '✨';
  if (normalized.includes('sac')) return '🎒';
  if (normalized.includes('montre')) return '⌚';
  
  return '📦'; 
};
