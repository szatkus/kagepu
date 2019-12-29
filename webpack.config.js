module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'kagepu.js',
    path: __dirname,
    library: 'kagepu',
    libraryTarget: 'var',
    libraryExport: 'default'
  }
}
