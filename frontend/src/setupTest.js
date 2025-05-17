import "@testing-library/jest-dom";

// Environment variables
global.import = {
  meta: {
    env: {
      VITE_API_URL: "http://localhost:9000",
      MODE: "test",
      DEV: true,
    },
  },
};
