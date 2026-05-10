/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Setup base tokens cho Design System của bạn ở đây
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Class: text-primary, bg-primary
          dark: '#2563eb',    // Class: text-primary-dark, bg-primary-dark
          light: '#93c5fd',   // Class: text-primary-light
        },
        danger: '#ef4444',    // Class: text-danger, bg-danger
        secondary: '#10b981',
      },
      // 2. FONT SIZE (Kích cỡ chữ)
      // Sinh ra class: text-*
      // Cú pháp: [kích_cỡ_chữ, chiều_cao_dòng (line-height)]
      fontSize: {
        'tiny': ['10px', '14px'],      // Class: text-tiny
        'body-base': ['15px', '22px'], // Class: text-body-base
        'huge': ['40px', '48px'],      // Class: text-huge
        'fluid': ['clamp(2rem, 5vw, 4rem)', '1.2'], // Text tự co giãn theo màn hình
      },

      // 3. FONT WEIGHT (Độ dày chữ)
      // Sinh ra class: font-*
      fontWeight: {
        'book': '450',        // Class: font-book (Đậm hơn normal 400 một chút)
        'weight-big': '700',
        'super-bold': '900',  // Class: font-super-bold
      }
    },
  },
  plugins: [],
}