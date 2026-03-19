/**
 * Author: pengwenlei 330109371@qq.com
 * Date: 2026-01-29 15:07:00
 * LastEditors: pengwenlei 330109371@qq.com
 * LastEditTime: 2026-01-29 15:07:09
 */
module.exports = {
  apps: [
    {
      name: 'thewind-frontend',
      script: '.output/server/index.mjs',
      cwd: '/var/www/thewind-frontend/current',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        NITRO_PORT: 3000,
        NITRO_HOST: '127.0.0.1'
      },
      error_file: '/var/www/thewind-frontend/shared/logs/error.log',
      out_file: '/var/www/thewind-frontend/shared/logs/out.log'
    }
  ]
}