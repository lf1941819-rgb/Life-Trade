/**
 * Brand Configuration
 * 
 * Centralized configuration for LIFE Trade branding assets and styles.
 * Update these paths when adding or changing brand assets.
 */

export const brandConfig = {
  // Logo
  logo: {
    // Path to the brand logo (SVG or PNG)
    // Expected location: src/assets/brand/logo.svg
    // Currently using TrendingUp icon as placeholder in Login component
    path: '/src/assets/brand/logo.svg',
    alt: 'LIFE Trade Logo',
  },

  // Icon references for PWA
  icon: {
    icon192: '/public/icon-192x192.png',
    icon512: '/public/icon-512x512.png',
  },

  // Brand colors
  colors: {
    primary: '#d4af37',
    background: '#0a0a0c',
    accent: '#1a1a1e',
  },

  // Brand text
  text: {
    fullName: 'LIFE Trade',
    shortName: 'LIFE',
    tagline: 'Premium Operational Suite',
    description: 'Sistema premium de gestão operacional para traders.',
  },
};

export default brandConfig;
