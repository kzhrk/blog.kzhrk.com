/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["!node_modules", "./**/*.{html,js,vue}"],
	theme: {
		extend: {
			colors: {
				white: "#fff",
			},
		},
	},
};
