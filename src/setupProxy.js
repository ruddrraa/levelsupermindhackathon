const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.langflow.astra.datastax.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
