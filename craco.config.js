// CRACO (Create React App Configuration Override)
// Конфигурация для добавления crossorigin в bundle.js без eject

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {

      // Находим и модифицируем HtmlWebpackPlugin
      const htmlPluginIndex = webpackConfig.plugins.findIndex(
        plugin => plugin.constructor.name === 'HtmlWebpackPlugin'
      );
      
      if (htmlPluginIndex !== -1) {
        const htmlPlugin = webpackConfig.plugins[htmlPluginIndex];
        
        // Модифицируем существующий плагин
        htmlPlugin.options = {
          ...htmlPlugin.options,
          scriptLoading: 'defer',
          crossorigin: 'anonymous',
          inject: true,
        };
      }

      // Включаем source maps для лучшей отладки
      if (env === 'development') {
        webpackConfig.devtool = 'eval-source-map';
      } else {
        webpackConfig.devtool = 'source-map';
      }

      // Настройки output для crossorigin
      webpackConfig.output = {
        ...webpackConfig.output,
        crossOriginLoading: 'anonymous',
        publicPath: env === 'development' ? '/' : './',
      };

      return webpackConfig;
    },
  },
  devServer: {
    // Настройки dev сервера для лучшей работы с мобильными устройствами
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    allowedHosts: 'all', // Для работы с LocalTunnel
    client: {
      overlay: false, // Отключаем overlay для избежания ошибок на мобильных
      logging: 'warn', // Уменьшаем количество логов
    },
  },
};
