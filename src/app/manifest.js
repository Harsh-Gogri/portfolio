export default function manifest() {
  return {
    name: 'Harsh Gogri | Product Manager',
    short_name: 'Harsh Gogri',
    description: 'Portfolio featuring product case studies, UX design, product strategy, and end-to-end product thinking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icons/profile-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/profile-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
