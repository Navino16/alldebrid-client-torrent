module.exports = {
    extends: ['airbnb-base', 'airbnb-typescript/base', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    parserOptions: {
        project: './tsconfig.json'
    },
    rules: {
        'max-len': ['error', { 'code': 120, 'ignoreStrings': true }],
        'import/prefer-default-export': 'off',
    }
};
