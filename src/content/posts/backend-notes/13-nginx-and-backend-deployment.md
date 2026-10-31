---
title: "后端学习笔记 13：Nginx 与后端部署"
published: 2026-11-01
description: "Nginx 启停、Spring Boot JAR 部署、nohup 与后台进程管理。"
tags: ["Java","Spring Boot","后端开发"]
category: 后端开发
series: "后端学习笔记"
seriesOrder: 13
draft: false
lang: zh_CN
author: Player
---

> 学习日期：2026-10-29。

## 启动与停止nginx

**前提：**进入nginx的根目录

![启动与停止nginx（笔记配图）](./images/13-nginx-and-backend-deployment/01.png)

```bash
#启动nginx
sbin/nginc 

#停止
sbin/nginc -s quit

#重新加载
sbin/nginc -s reload
```

## 后端部署

![后端部署（笔记配图）](./images/13-nginx-and-backend-deployment/02.png)

### 1.准备 Linux 环境

确保 Linux 已安装 JDK、MySQL，并且网络正常

### 2.配置 MySQL

### 3.检查 JAR 中的配置文件

### 4.准备并上传 JAR 包

### 5.前台启动 Spring Boot

![5.前台启动 Spring Boot（笔记配图）](./images/13-nginx-and-backend-deployment/03.png)

检查 8080 端口：

```
ss -lntp | grep 8080
```

### nohup 后台运行（重点）

```
nohup java -jar tlias-web-management.jar > tlias-console.log 2>&1 &
```

**后台服务管理**

```
# 查看进程
ps -ef | grep '[t]lias-web-management.jar'

# 查看实时日志
tail -f tlias-console.log

# 查看端口
ss -lntp | grep 8080

# 停止进程
kill PID
```
