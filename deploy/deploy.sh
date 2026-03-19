###
 # @Author: pengwenlei 330109371@qq.com
 # @Date: 2026-01-29 15:06:27
 # @LastEditors: pengwenlei 330109371@qq.com
 # @LastEditTime: 2026-01-29 15:20:46
### 
#!/usr/bin/env bash
set -e

# 切到项目根目录（deploy.sh 在 deploy/ 里）
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
############################
# 基础配置（必改）
############################
PROJECT_NAME="thewind-frontend"
SERVER_USER="root"
SERVER_HOST="152.136.55.216"
SERVER_BASE="/var/www/${PROJECT_NAME}"
SSH_KEY="$HOME/.ssh/id_rsa"

############################
# 内部变量（不用改）
############################
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE_NAME="${PROJECT_NAME}_${TIMESTAMP}.tar.gz"

echo "🚀 开始部署 ${PROJECT_NAME} @ ${TIMESTAMP}"

############################
# 本地构建
############################
echo "📦 安装依赖"
npm ci

echo "🏗️  构建 Nuxt3"
npm run build

if [ ! -f ".output/server/index.mjs" ]; then
  echo "❌ 构建失败：未找到 .output/server/index.mjs"
  exit 1
fi

############################
# 打包产物
############################
echo "📦 打包产物"
tar -czf ${PACKAGE_NAME} \
  .output \
  package.json \
  package-lock.json \
  deploy/ecosystem.config.js

############################
# 上传服务器
############################
echo "⬆️  上传到服务器"
scp -i "${SSH_KEY}" ${PACKAGE_NAME} \
  ${SERVER_USER}@${SERVER_HOST}:/tmp/

############################
# 远程部署
############################
echo "🖥️  远程部署"
ssh -i "${SSH_KEY}" ${SERVER_USER}@${SERVER_HOST} << EOF
set -e

BASE="${SERVER_BASE}"
RELEASE="\$BASE/releases/${TIMESTAMP}"

mkdir -p \$BASE/releases \$BASE/shared/logs
mkdir -p \$RELEASE
cd \$RELEASE

tar -xzf /tmp/${PACKAGE_NAME}
rm -f /tmp/${PACKAGE_NAME}

echo "📦 安装运行依赖"
npm install --omit=dev

echo "🔗 链接环境变量"
ln -sf \$BASE/shared/.env .env

echo "🔁 切换 current"
ln -sfn \$RELEASE \$BASE/current

echo "♻️  PM2 reload"
pm2 start .output/server/index.mjs \
  --name thewind-frontend \
  --interpreter node \
  --env production \
  --update-env || pm2 reload thewind-frontend
echo "🩺 健康检查"
sleep 2
curl -fs http://127.0.0.1:3000/ > /dev/null

echo "🧹 清理旧版本（保留 5 个）"
cd \$BASE/releases
ls -dt */ | tail -n +6 | xargs rm -rf || true

echo "✅ 部署成功：${TIMESTAMP}"
EOF

rm -f ${PACKAGE_NAME}
echo "🎉 Done"