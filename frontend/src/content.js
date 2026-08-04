export const defaultProfile = {
  brandName: 'Shots by Pato',
  initials: 'SP',
  heroEyebrow: 'Portrait · Street · Life',
  heroTitle: 'Life,',
  heroAccent: 'in frame.',
  heroDescription: 'Honest portraits and restless city stories—photographed with warmth, instinct, and a love for the in-between.',
  locations: 'Kampala · Leeds · Everywhere',
  photographerName: 'Pato',
  aboutTitle: 'People as they are.',
  aboutAccent: 'Places as they feel.',
  bio: 'I’m Pato, a photographer drawn to character, connection, and the energy of everyday life. My work lives between documentary and portraiture—considered, but never over-polished.',
  testimonial1Quote: 'Pato made the whole experience feel effortless. The photographs are warm, honest, and completely us.',
  testimonial1Name: 'Amina & Joel',
  testimonial1Service: 'Couples portrait',
  testimonial2Quote: 'Every image carries the feeling of the night. Nothing looked forced, and every important moment was there.',
  testimonial2Name: 'Maya',
  testimonial2Service: 'Birthday celebration',
  testimonial3Quote: 'The final gallery felt like a story rather than a collection of poses. We will treasure it for years.',
  testimonial3Name: 'The Kato family',
  testimonial3Service: 'Family session',
  availability: 'Available for portraits, events & stories',
  contactTitle: 'Let’s make something',
  contactAccent: 'worth keeping.',
  email: 'hello@shotsbypato.com',
}

export const PROFILE_KEY = 'shots-by-pato-profile'

export function loadProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') }
  } catch {
    return defaultProfile
  }
}
