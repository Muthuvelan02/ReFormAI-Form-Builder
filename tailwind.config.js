/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		colors: {
		  background: 'hsl(var(--background, 0 0% 100%))', // Fallback to white
		  foreground: 'hsl(var(--foreground, 0 0% 0%))', // Fallback to black
		  card: {
			DEFAULT: 'hsl(var(--card, 0 0% 100%))',
			foreground: 'hsl(var(--card-foreground, 0 0% 0%))'
		  },
		  popover: {
			DEFAULT: 'hsl(var(--popover, 0 0% 100%))',
			foreground: 'hsl(var(--popover-foreground, 0 0% 0%))'
		  },
		  primary: {
			DEFAULT: '#006FE6',
			foreground: 'hsl(var(--primary-foreground, 0 0% 100%))'
		  },
		  secondary: {
			DEFAULT: 'hsl(var(--secondary, 220 10% 50%))',
			foreground: 'hsl(var(--secondary-foreground, 0 0% 100%))'
		  },
		  muted: {
			DEFAULT: 'hsl(var(--muted, 220 10% 90%))',
			foreground: 'hsl(var(--muted-foreground, 220 10% 20%))'
		  },
		  accent: {
			DEFAULT: 'hsl(var(--accent, 220 10% 60%))',
			foreground: 'hsl(var(--accent-foreground, 0 0% 100%))'
		  },
		  destructive: {
			DEFAULT: 'hsl(var(--destructive, 0 84% 60%))',
			foreground: 'hsl(var(--destructive-foreground, 0 0% 100%))'
		  },
		  border: 'hsl(var(--border, 220 10% 70%))',
		  input: 'hsl(var(--input, 220 10% 80%))',
		  ring: 'hsl(var(--ring, 220 10% 60%))',
		  chart: {
			'1': 'hsl(var(--chart-1, 210 70% 50%))',
			'2': 'hsl(var(--chart-2, 150 70% 50%))',
			'3': 'hsl(var(--chart-3, 60 70% 50%))',
			'4': 'hsl(var(--chart-4, 30 70% 50%))',
			'5': 'hsl(var(--chart-5, 0 70% 50%))'
		  }
		},
		borderRadius: {
		  lg: 'var(--radius, 8px)',
		  md: 'calc(var(--radius, 8px) - 2px)',
		  sm: 'calc(var(--radius, 8px) - 4px)'
		}
	  }
	},
	daisyui: {
	  themes: [
		"light",
		"dark",
		"cupcake",
		"bumblebee",
		"emerald",
		"corporate",
		"synthwave",
		"retro",
		"cyberpunk",
		"valentine",
		"halloween",
		"garden",
		"forest",
		"aqua",
		"lofi",
		"pastel",
		"fantasy",
		"wireframe",
		"black",
		"luxury",
		"dracula",
		"cmyk",
		"autumn",
		"business",
		"acid",
		"lemonade",
		"night",
		"coffee",
		"winter",
		"dim",
		"nord",
		"sunset",
	  ],
	},
	plugins: [
	  require("tailwindcss-animate"),
	  require('daisyui'),
	],
  };
  