module.exports = require('@backstage/cli/config/eslint-factory')(__dirname, {
  rules: {
    // enforce sorted import declarations within modules
    'sort-imports': 'error',
  },
});
