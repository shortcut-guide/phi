module.exports = {
  presets: [
    '@babel/preset-env', // Transforms modern JS
    ['@babel/preset-react', { pragma: 'h' }] // Transforms JSX for Preact
  ]
};