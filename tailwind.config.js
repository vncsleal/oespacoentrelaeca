/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "selector",
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				fadeInUp: {
					"0%": { opacity: 0, transform: "translateY(20px)" },
					"100%": { opacity: 1, transform: "translateY(0)" },
				},
			},
			animation: {
				fadeInUp: "fadeInUp 0.5s ease-out forwards",
			},
		},
	},
	plugins: [],
};
