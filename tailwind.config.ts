import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',
          gold: '#d4af37',
          ivory: '#f8f5f1',
          success: '#16a34a',
          warning: '#f59e0b',
          danger: '#dc2626',
          slate: '#475569',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
