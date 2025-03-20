/**
 * Lijst van avatar afbeeldingen in de public map
 */
const AVATAR_IMAGES = [
  '/images/avatars/avatar1.jpg',
  '/images/avatars/avatar2.jpg',
  '/images/avatars/avatar3.jpg',
  '/images/avatars/avatar4.jpg',
  '/images/avatars/avatar5.jpg',
  '/images/avatars/avatar6.jpg',
  '/images/avatars/avatar7.jpg',
  '/images/avatars/avatar8.jpg',
  '/images/avatars/avatar9.jpg'
];

/**
 * Fallback kleuren voor avatars als afbeeldingen niet beschikbaar zijn
 */
const AVATAR_COLORS = [
  '#3498db', // blauw
  '#e74c3c', // rood
  '#2ecc71', // groen
  '#f39c12', // oranje
  '#9b59b6', // paars
  '#1abc9c', // turquoise
  '#34495e', // donkerblauw
  '#7f8c8d', // grijs
  '#d35400', // donkeroranje
  '#27ae60', // donkergroen
  '#e67e22', // lichtoranje
  '#8e44ad'  // donkerpaars
];

/**
 * Genereert een avatar URL op basis van de naam
 * Consistent dezelfde avatar voor dezelfde naam
 */
export function getAvatarUrl(name: string): string {
  // Bereken een hash op basis van de naam
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Selecteer een avatar uit de lijst op basis van de hash
  const avatarIndex = Math.abs(hash) % AVATAR_IMAGES.length;
  return AVATAR_IMAGES[avatarIndex];
}

/**
 * Genereert een achtergrondkleur op basis van de naam
 * (Fallback voor als de avatar niet laadt)
 */
export function getAvatarColor(name: string): string {
  // Bereken een eenvoudige hash voor de kleur
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Selecteer een kleur uit de lijst
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex];
}

/**
 * Haal initialen uit een naam
 * (Fallback voor als de avatar niet laadt)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');
} 