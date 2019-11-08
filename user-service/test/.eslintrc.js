module.exports = {
  env: {
    mocha: true,
  },
  rules: {
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'should|expect',
      },
    ],
    'node/no-unpublished-require': 'off',
  },
};
