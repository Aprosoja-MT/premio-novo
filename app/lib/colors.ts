export const colors = {
  dark: {
    primary: '#0B4B49',
    darker: '#023B39',
  },
  light: {
    primary: '#ADD9C5',
    lighter: '#B3E3D0',
  },
  neutral: {
    offWhite: '#F0F0ED',
  },
} as const;

export const colorClasses = {
  dark: {
    primary: 'bg-premio-dark text-premio-offwhite',
    darker: 'bg-premio-darker text-premio-offwhite',
    text: 'text-premio-dark',
  },
  light: {
    primary: 'bg-premio-light text-premio-darker',
    lighter: 'bg-premio-lighter text-premio-darker',
    text: 'text-premio-light',
  },
  neutral: {
    background: 'bg-premio-offwhite text-premio-dark',
    text: 'text-premio-offwhite',
  },
} as const;
