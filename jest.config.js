export default {
    roots: ['transforms'],
    transform: {
        '\\.ts$': ['ts-jest'],
    },
    automock: false,
    testMatch: ['**/*.test.ts'],
};
