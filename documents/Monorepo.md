# Squirrel Project Template Monorepo Package Documentation

## 1. 相关内容

1. 使用pnpm进行依赖管理、monorepo项目管理；
2. 使用changeset进行依赖版本管理、Changelog生成；
3. 使用 microbundle / unbuild 进行npm多模块打包，便于多种环境下使用模块；
4. 使用Turborepo进行多线程打包，提高打包效率；
5. 使用husky进行代码检查、代码提交前检查；

## 2. 功能模块、依赖

1. pnpm -> 8.4.0
2. @changesets/cli -> ^2.22.0
3. microbundle -> ^0.15.0
4. turbo -> ^1.2.14
5. husky -> ^8.0.1
6. unbuild -> "^1.2.1"

## 3. 安装、配置、使用

- v8版本的pnpm安装使用需要node版本至少大于 v16.14.0 ，所以在安装之前首先需要检查下node版本。

```bash
  # pnpm install
  yarn global add pnpm
  npm install pnpm -g

  # @changesets/cli
  pnpm add @changesets/cli -Dw # -Dw为：安装到Monorepo项目根目录
  pnpx @changesets/cli init

  # microbundle
  pnpm add microbundle -Dw

  # turbo
  pnpm add turbo -Dw

  # husky
  # https://segmentfault.com/a/1190000040288130
  pnpm add husky -Dw
  # 以下命令需要在git项目的根目录执行，如果之前有安装过husky，需要在.git/hooks目录下清理husky*的文件
  pnpx husky install
```

## 4. Monorepo模块管理

### 1. 初始化NPM项目，创建Monorepo项目，并且添加依赖

- 初始化NPM项目：

```bash
  # 初始化NPM项目，创建Monorepo项目，并且添加依赖
  pnpm init
```

- 调整项目结构

```bash
app
├── packages
│   ├── common
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
│   ├── utils
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
│   ├── pkg3
│   │   ├── package.json
│   │   └── pnpm-lock.yaml
│   └── app
│       ├── package.json
│       └── pnpm-lock.yaml
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

- 配置PNPM Workspace
<https://juejin.cn/post/7084582387060834340#heading-2>

```yaml
# ./pnpm-workspace.yaml
packages:
  # root directory
  - "."
  # all packages in subdirs of packages/
  - "packages/**"
  # exclude packages that are inside test/ directories
  - "!**/test/**" # '!' means exclude
```

- 安装依赖
  
```bash
  # 安装依赖
  pnpm install
```

- 配置Changeset
<https://pnpm.io/zh/using-changesets>

```bash
  # 配置Changeset
  pnpm add @changesets/cli -Dw
  pnpx @changesets/cli init
```

得到Changeset配置文件，填写必要信息

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [["@squirreljs/*"]],
  "linked": [],
  "access": "restricted",
  "baseBranch": "master",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- 配置Turborepo多线程打包工具
<https://turborepo.org/>

Monorepo根目录创建turbo.json配置文件

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "baseBranch": "origin/main",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

### 2.发布NPM模块，提交到NPM 「当前项目为私有项目，不触发发布远程NPM仓库」

- 代码规范化
  
```bash
  # 代码规范化
  pnpm run lint
  pnpm run format
```

- 打包Monorepo项目

```bash
  # 打包Monorepo项目
  # 启动turbo多线程打包
  pnpm turbo run build
```

- 选择更新模块，编写Changelog信息

```bash
  # 选择更新模块，编写Changelog信息
  pnpm run changeset-add
```

- 更新版本号信息
  
```bash
  # 更新版本号信息
  pnpm run version-packages
```

- 推送到NPM

```bash
  # 推送到NPM
  pnpm run publish
```

## 5. 配置文件

1. pnpm-workspace.yaml
2. turbo.json
3. .changeset/config.json
4. .eslintrc.json
5. .eslintignore
6. .prettierrc.json
7. .prettierignore

## 6. 其他

1. tsconfig.json 配置参考：
[TypeScript配置文件](https://jkfhto.github.io/2020-04-07/TypeScript/TypeScript%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6/)
[了不起的 tsconfig.json 指南](https://segmentfault.com/a/1190000022809326)

2. pnpm monorepo参考：
[pnpm + workspace + changesets 构建你的 monorepo 工程](https://juejin.cn/post/7098609682519949325#heading-4)
[基于pnpm搭建monorepo项目](https://juejin.cn/post/7084582387060834340#heading-2)
[2021年管理Monorepo代码库的11种出色工具](https://juejin.cn/post/6913497232687759367#heading-4)
[All in one：项目级 monorepo 策略最佳实践](https://juejin.cn/post/6924854598268108807#heading-15)
[使用pnpm做monorepo](https://juejin.cn/post/7055281852789047304#heading-4)

3. 官方文档
[pnpm](https://pnpm.io/zh/installation)
[rush](https://rushjs.io/zh-cn/pages/intro/get_started/)
[turborepo](https://turborepo.org/docs/getting-started)
[changeset](https://github.com/changesets/changesets)
