module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": ["eslint:recommended", "google"],
    "rules": {
        "arrow-parens": ["error", "as-needed", { "requireForBlockBody": true }],
        "comma-dangle": ["error", "never"],
        "max-len": ["error", { "ignoreStrings": true }],
        "no-console": "off",
        "require-jsdoc": "off",
        "strict": "error"
    }
};
