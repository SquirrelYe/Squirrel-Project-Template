# 使用 Node.js v18 的基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 将你的 package.json 和 package-lock.json 文件复制到工作目录
COPY package*.json ./

# 设置NPM的镜像源
RUN npm config set registry https://registry.npm.taobao.org 

# 使用 npm 安装依赖项
RUN npm i

# 将其他项目文件复制到工作目录
COPY . .

# 编译 TypeScript 代码
RUN npm run build

# 清理不必要的依赖项，并仅保留生产环境所需的依赖项
RUN npm prune --production

# 设置容器暴露的端口号（这应与你的应用程序监听的端口号相匹配）
EXPOSE 3001

# 启动你的服务器
CMD ["npm", "run", "start:prod"]