/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // if you are using EJS templates

    // if you have any JS files where you use Tailwind classes Then unComment below line 8

    // './public/javascripts/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
