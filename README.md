# 使用 pm2 自动化部署 Node 项目

> 2020-01-01 18:00:19



使用 pm2 deploy 来实现 Node 项目自动部署。

> 个人项目，加上是最低配的阿里云服务器，因此采用这个。公司项目可以上 K8S + Docker 。



## 零、如何启动项目

```bash
# 本地安装pm2
npm install -g pm2

git clone https://github.com/zhongxia245/pm2-depoly-node-demo.git

cd pm2-depoly-node-demo
# 复制 pm2 部署配置模板，并改成自己服务器信息
cp deploy.yaml.bak deploy.yaml

npm install 
npm start

# 如何部署
# 第一次部署
npm run server:setup

# 更新部署
npm run server:update
```



## 一、服务器前置条件

> 这里以 github 仓库为例, 云服务器系统为 CentOS 7 
>
> 如果不知道是什么系统，执行 `lsb_release -a`
>
> ```bash
> [xxxx@iz2zehejz8ufzy9vmvt9xlz ~]$ lsb_release -a
> LSB Version:	:core-4.1-amd64:core-4.1-noarch
> Distributor ID:	CentOS
> Description:	CentOS Linux release 7.5.1804 (Core)
> Release:	7.5.1804
> Codename:	Core
> ```



1. 安装 pm2 、git

   `pm2 deploy` 会在 服务器上自动去 `git fetch` 仓库代码，因此需要服务器安装 `git`

   ```bash
   npm install -g pm2
   
   yum -y install git
   ```

2. 生成密钥

   服务器下载 git 仓库的时候，会提示让你输入帐号密码，如何避免这个提示呢？使用 ssh 实现免密下载。

   ```bash
   ssh-keygen -t rsa -C "xxx@xxx.com"
   ```

   

3. 在 github 设置 ssh key

   登录到GitHub，点击右上方的头像，选择settings ，点击Add SSH key，把id_rsa.pub的内容复制到里面即可。

   ![image-20200101173601082](https://tva1.sinaimg.cn/large/006tNbRwly1gah73l7nj5j313i0jgwmk.jpg)





## 二、如何部署

`pm2 depoly` 原理是 登录 `deploy.yaml` 配置的服务器群，自动执行一些命令，来重新部署。

> 这里例子中，就是 拉取 git仓库的最新代码，然后重新启动 pm2

因此，每次部署前，都需要把本地的代码提交到 git 仓库。

```bash
# 第一次部署
npm run server:setup

# 更新部署
npm run server:update
```



## 三、常见问题

### 1、ssh 端口号不是22的，如何配置

`port` 字段必须为字符串，否则不生效。

```yaml
apps:
  - script: ./bin/www # 入口文件
    name: "pm2-depoly-node" # 程序名称
    env: # 环境变量
      COMMON_VARIABLE: true
    env_production:
      NODE_ENV: production

deploy: # 部署脚本
  production: # 生产环境
    user: xxxxx # 服务器的用户名
    host: www.xxxxx.com # 服务器的ip地址
    port: "1234" # ssh端口,必须为字符串，否则不生效
    ref: origin/master # 要拉取的git分支
    ssh_options: StrictHostKeyChecking=no # SSH 公钥检查
    repo: https://github.com/zhongxia245/pm2-depoly-node-demo.git # 远程仓库地址
    path: /home/zhongxia/pm2-deploy/pm2-deploy-node-demo # 拉取到服务器某个目录下
    pre-deploy: git fetch --all # 部署前执行
    post-deploy: cnpm install &&  pm2 reload deploy.yaml --env production # 部署后执行
    env:
      NODE_ENV: production
```



### 2、fatal: Could not read from remote repository

报这个错，就是服务器没有 `clone` 仓库的权限，遇到这个问题，按照上面**服务器前置条件**的操作，配置 ssh 即可。 





## 终、参考文章

> 主要是学习参考这个文章，然后实现这个一个 DEMO项目。

1. [使用 pm2 自动化部署 node 项目](https://juejin.im/post/5b823506e51d4538d517662f)
