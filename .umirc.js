export default {
  treeShaking: true,
  hash: true,
  // base:'huibao',
  // publicPath: '/huibao/',
  // outputPath:'./dist/huibao',
  proxy:{
    '/api':{
      target:'http://127.0.0.1:8008',
      changeOrigin:true
    },
    '/api/services':{
      target:'http://127.0.0.1:9000',
      changeOrigin:true
    },
    '/cesium':{
      target:'http://127.0.0.1:8085',
      changeOrigin:true
    },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'supermap-study',
      dll: true,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}