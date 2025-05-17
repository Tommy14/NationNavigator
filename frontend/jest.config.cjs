module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest-setup.js'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTest.js'],  
    moduleNameMapper: {
    '^services/api$': '<rootDir>/__mocks__/services/api.js',
    '^services/auth$': '<rootDir>/__mocks__/services/auth.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^.+\\.(png|jpg|jpeg|svg|gif)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
    transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }]
    },
    transformIgnorePatterns: [
    '/node_modules/(?!(react-globe.gl|react-kapsule|topojson-client|jerrypick|d3-.*|globe\.gl)/)'
  ],
  };