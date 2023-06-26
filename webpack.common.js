const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/js/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|jpg|png|gif|svg|webp|mp3)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'JustToDoIt',
      template: 'src/template.html',
    }),
  ],
};
