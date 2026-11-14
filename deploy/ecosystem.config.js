// pm2 进程配置：在服务器上 `pm2 start deploy/ecosystem.config.js` 同时跑两个站点
// 两个站都把数据存在本地文件（nedb / 内存），所以 instances 必须是 1，不能开 cluster。
module.exports = {
  apps: [
    {
      name: 'ideal-galaxy', // 理想星系 project5
      cwd: './project5',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 6001,
        TRUST_PROXY: '1',
        COOKIE_SECURE: '1', // 上了 HTTPS 再开；只走 http 时改成 '0'，否则登录后会立刻掉登录
        SESSION_SECRET: 'change-me-on-the-server',
      },
    },
    {
      name: 'trpg-community', // 中式跑团 community
      cwd: './community',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5050,
      },
    },
  ],
};
