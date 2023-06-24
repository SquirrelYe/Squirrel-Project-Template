/**
 * @description 代理配置文件
 * @author SquirrelYe <will@aesen.cc>
 * @time 2023.06.18 15:46:11
 */
const Proxy: Record<string, any> = {
  development: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
      logLevel: 'info',
      secure: true,
      onProxyReq: function onProxyReq(_proxyReq: any, req: any) {
        const headers = req.headers;
        console.log('[antd] proxy request:', req.originalUrl, '--->', headers.host);
      }
    }
  },
  test: {
    '/api/': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: { '^': '' }
    }
  }
};

export { Proxy };
