/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070a',
          900: '#090c11',
          850: '#0d1117',
          800: '#121821',
          700: '#19212c',
        },
        line: {
          DEFAULT: '#1e2833',
          soft: '#161e27',
        },
        mist: '#8d9cab',
        frost: '#e7eef6',
        signal: {
          DEFAULT: '#22d3ee',
          deep: '#0e7490',
        },
        verdict: {
          true: '#3ddc97',
          false: '#ff6b6b',
          mislead: '#f5b950',
          unknown: '#8fa0b3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        lift: '0 18px 50px -24px rgba(0, 0, 0, 0.9)',
        glow: '0 0 0 1px rgba(34, 211, 238, 0.35), 0 0 34px -10px rgba(34, 211, 238, 0.45)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        sweep: 'sweep 1.6s linear infinite',
        breathe: 'breathe 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
