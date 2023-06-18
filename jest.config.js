
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [
        '<rootDir>/test/mocks/domMock.js',
    ],
    moduleNameMapper: {
        '\\.(png|svg|world|css)$': '<rootDir>/test/mocks/fileMock.js',
    },
    roots: [
        './test',
    ],
};
