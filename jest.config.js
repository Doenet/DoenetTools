module.exports = {
    // Your normal jest config settings
    testPathIgnorePatterns: ["<rootDir>/cypress/", "<rootDir>/.cache/"],
    testEnvironment: 'jsdom',
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    modulePaths: [
        "<rootDir>"
    ],
}
