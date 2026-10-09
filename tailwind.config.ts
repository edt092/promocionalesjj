import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Paleta oficial Promocionales J&J (public/paleta_de_colores_web.png)
        navy: {
          DEFAULT: '#0A1A2F',
          50: '#EEF2F7',
          100: '#D6DFEA',
          400: '#3D5578',
          600: '#152945',
          900: '#0A1A2F',
          950: '#060F1C',
        },
        brand: {
          DEFAULT: '#1565FF',
          50: '#EAF1FF',
          100: '#D2E2FF',
          400: '#4A85FF',
          500: '#1565FF',
          600: '#0E4FD6',
          700: '#0A3DA8',
        },
        sky: {
          DEFAULT: '#00BFFF',
          50: '#E5FAFF',
          100: '#CCF4FF',
          300: '#66DBFF',
          400: '#33CDFF',
          500: '#00BFFF',
          600: '#009ED1',
        },
        danger: {
          DEFAULT: '#FF2D2D',
          50: '#FFECEC',
          400: '#FF6161',
          500: '#FF2D2D',
          600: '#E01414',
          700: '#BD0F0F',
        },
        ink: {
          DEFAULT: '#1E2229',
          700: '#1E2229',
        },
        slate: {
          50: '#F8F9FA',
          100: '#E5E7EB',
          200: '#DADEE3',
          400: '#9AA2AC',
          500: '#6B7280',
          700: '#3A414B',
          900: '#1E2229',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
      boxShadow: {
        'brand-glow': '0 0 40px -8px rgba(21, 101, 255, 0.45)',
        'sky-glow': '0 0 40px -8px rgba(0, 191, 255, 0.45)',
        'danger-glow': '0 0 40px -8px rgba(255, 45, 45, 0.45)',
        'lift': '0 20px 40px -12px rgba(10, 26, 47, 0.25)',
      },
      backgroundImage: {
        'gradiente-primario': 'linear-gradient(135deg, #0A1A2F 0%, #1565FF 100%)',
        'gradiente-secundario': 'linear-gradient(90deg, #1565FF 0%, #00BFFF 100%)',
        'gradiente-acento': 'linear-gradient(135deg, #1E2229 0%, #E01414 100%)',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
      },
    },
  },
  plugins: [],
};
export default config;
