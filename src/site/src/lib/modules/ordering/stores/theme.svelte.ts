/**
 * Theme store — manages dark/light mode for the ordering experience.
 *
 * Dark ("Cosmic")  → starfield + nebula glows
 * Light ("Dragon") → SVG dragon + warm parchment tones
 */

export type ThemeMode = 'dark' | 'light';

export interface ThemeTokens {
    name: string;
    bg: string;
    bgSecondary: string;
    surface: string;
    surfaceHover: string;
    surfaceBorder: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    headerBg: string;
    navBg: string;
    accent: string;
    accentGlow: string;
    cardBg: string;
    sheetBg: string;
    basketBarBg: string;
    checkBg: string;
    checkBorder: string;
    progressBg: string;
    shadow: string;
    inputBg: string;
}

const THEME_TOKENS: Record<ThemeMode, ThemeTokens> = {
    dark: {
        name: 'Cosmic',
        bg: '#080a12',
        bgSecondary: '#0e1019',
        surface: 'rgba(255,255,255,0.035)',
        surfaceHover: 'rgba(255,255,255,0.06)',
        surfaceBorder: 'rgba(255,255,255,0.07)',
        text: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.55)',
        textTertiary: 'rgba(255,255,255,0.3)',
        headerBg: 'rgba(8, 10, 18, 0.82)',
        navBg: 'rgba(8, 10, 18, 0.88)',
        accent: '#C41E3A',
        accentGlow: 'rgba(196, 30, 58, 0.4)',
        cardBg: 'rgba(255,255,255,0.03)',
        sheetBg: 'linear-gradient(180deg, #141620 0%, #0c0e16 100%)',
        basketBarBg: 'rgba(8, 10, 18, 0.92)',
        checkBg: 'rgba(255,255,255,0.06)',
        checkBorder: 'rgba(255,255,255,0.15)',
        progressBg: 'rgba(255,255,255,0.06)',
        shadow: '0 8px 32px rgba(0,0,0,0.4)',
        inputBg: 'rgba(255,255,255,0.04)'
    },
    light: {
        name: 'Dragon',
        bg: '#faf8f5',
        bgSecondary: '#f2eeea',
        surface: 'rgba(0,0,0,0.03)',
        surfaceHover: 'rgba(0,0,0,0.05)',
        surfaceBorder: 'rgba(0,0,0,0.08)',
        text: '#1a1a1a',
        textSecondary: 'rgba(0,0,0,0.55)',
        textTertiary: 'rgba(0,0,0,0.3)',
        headerBg: 'rgba(250, 248, 245, 0.88)',
        navBg: 'rgba(250, 248, 245, 0.92)',
        accent: '#B91C2E',
        accentGlow: 'rgba(185, 28, 46, 0.15)',
        cardBg: '#ffffff',
        sheetBg: 'linear-gradient(180deg, #ffffff 0%, #f8f6f3 100%)',
        basketBarBg: 'rgba(250, 248, 245, 0.95)',
        checkBg: 'rgba(0,0,0,0.04)',
        checkBorder: 'rgba(0,0,0,0.12)',
        progressBg: 'rgba(0,0,0,0.06)',
        shadow: '0 8px 32px rgba(0,0,0,0.08)',
        inputBg: 'rgba(0,0,0,0.03)'
    }
};

function createThemeStore() {
    let mode = $state<ThemeMode>('dark');
    let tokens = $derived(THEME_TOKENS[mode]);
    let isDark = $derived(mode === 'dark');

    return {
        get mode() {
            return mode;
        },
        get tokens() {
            return tokens;
        },
        get isDark() {
            return isDark;
        },
        toggle() {
            mode = mode === 'dark' ? 'light' : 'dark';
        },
        set(newMode: ThemeMode) {
            mode = newMode;
        }
    };
}

export const themeStore = createThemeStore();
