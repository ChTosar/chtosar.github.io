export default {
    testEnvironment: 'jest-environment-jsdom',
    roots: ['<rootDir>/tests'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    presets: ['@babel/preset-env'],
    transform: {
        '^.+\\.js$': 'babel-jest', // Usa Babel para transformar archivos .js
    },
    moduleNameMapper: {
        "^music-metadata$": "<rootDir>/__mocks__/music-metadata.js", // Redirige a un mock
    },
};