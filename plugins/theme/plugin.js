/* AEL Engineering Academy — Theme Plugin v1.0 */

window.AELTheme = {
  version: '1.0.0',
  current: 'dark',

  themes: {
    dark: {
      name: 'AEL Dark',
      '--bg-primary': '#0B1220',
      '--bg-secondary': '#111827',
      '--bg-card': 'rgba(17, 24, 39, 0.8)',
      '--bg-glass': 'rgba(17, 24, 39, 0.6)',
      '--text-primary': '#E5E7EB',
      '--text-secondary': '#9CA3AF',
      '--border': 'rgba(255, 255, 255, 0.08)'
    },
    light: {
      name: 'AEL Light',
      '--bg-primary': '#F9FAFB',
      '--bg-secondary': '#FFFFFF',
      '--bg-card': 'rgba(255, 255, 255, 0.9)',
      '--bg-glass': 'rgba(255, 255, 255, 0.8)',
      '--text-primary': '#111827',
      '--text-secondary': '#6B7280',
      '--border': 'rgba(0, 0, 0, 0.08)'
    }
  },

  init() {
    const saved = localStorage.getItem('ael-academy-theme');
    if (saved && this.themes[saved]) {
      this.apply(saved);
    }
  },

  apply(themeName) {
    if (!this.themes[themeName]) return;
    const theme = this.themes[themeName];
    for (const [key, value] of Object.entries(theme)) {
      if (key !== 'name') {
        document.documentElement.style.setProperty(key, value);
      }
    }
    this.current = themeName;
    localStorage.setItem('ael-academy-theme', themeName);
  },

  toggle() {
    this.apply(this.current === 'dark' ? 'light' : 'dark');
  },

  get currentTheme() {
    return this.themes[this.current];
  }
};
