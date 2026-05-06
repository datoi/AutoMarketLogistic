import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    50:  '#eef6fc',
                    100: '#d6e9f6',
                    200: '#aed3ec',
                    300: '#7fb8e0',
                    400: '#519cd3',
                    500: '#2a86c9',
                    600: '#1f6ca8',
                    700: '#185585',
                    800: '#123f63',
                    900: '#0d2c46',
                },
                ink: {
                    50:  '#f5f6f8',
                    100: '#e6e8ec',
                    200: '#c7ccd5',
                    300: '#9aa1ad',
                    400: '#6b7281',
                    500: '#474d5a',
                    600: '#343846',
                    700: '#2a2e3a',
                    800: '#232837',
                    900: '#161820',
                },
            },
            boxShadow: {
                card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.06)',
                'card-hover': '0 4px 8px rgba(15, 23, 42, 0.06), 0 12px 24px rgba(15, 23, 42, 0.10)',
            },
        },
    },

    plugins: [forms],
};
