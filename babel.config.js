module.exports = (api) => {
  if (api.env('testing')) {
    return {
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current',
          },
        }],
      ],
    };
  }
  return {
    presets: [
      ['@vue/app'],
    ],
  };
};
