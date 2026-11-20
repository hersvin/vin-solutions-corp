export const THEME = {
  colors: {
    peach: "#F4BAA3",
    cream: "#F4F0E2",
    lightBlue: "#A6C8E2",
    blue: "#619DC6",
  },
  primary: {
    main: "#619DC6",
    light: "#A6C8E2",
    contrast: "#F4F0E2",
    action: {
      lightBackground: "#315E79",
      lightText: "#F4F0E2",
      darkBackground: "#A6C8E2",
      darkText: "#20313B",
    },
  },
  status: {
    success: "#619DC6",
    warning: "#F4BAA3",
    error: "#F4BAA3",
    info: "#A6C8E2",
    neutral: "#F4F0E2",
  },
  scrollbar: {
    light: {
      thumb: "#619DC6",
      thumbHover: "#4E8EBB",
      track: "#E7EEF0",
    },
    dark: {
      thumb: "#A6C8E2",
      thumbHover: "#BDD8EA",
      track: "#3A5665",
    },
  },
} as const;
