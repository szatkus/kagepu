module.exports = {
  entry: './webgpu/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        use: 'tslint-loader',
        exclude: /node_modules/
      },
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
