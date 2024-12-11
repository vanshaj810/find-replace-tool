export interface ThemeConfig {
  name: string;
  properties: {
    '--bg-primary': string;
    '--bg-secondary': string;
    '--text-primary': string;
    '--text-secondary': string;
    '--border-color': string;
    '--hover-bg': string;
    '--accent-color': string;
    '--error-color': string;
    '--success-color': string;
    '--shadow-color': string;
    '--kbd-bg': string;
    '--code-bg': string;
  };
}
