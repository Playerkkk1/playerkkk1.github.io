---
title: "后端学习笔记 12：Linux 与 JavaWeb 部署基础"
published: 2026-11-01
description: "Linux 命令、网络、防火墙、Nginx 与 JavaWeb 部署实践记录。"
tags: ["Java","Spring Boot","后端开发"]
category: 后端开发
series: "后端学习笔记"
seriesOrder: 12
draft: false
lang: zh_CN
author: Player
---

> 学习日期：2026-10-28。

今日主题：Linux 基础操作与 JavaWeb 项目部署

## 一、今日完成内容

| 模块       | 学习与实践内容                                | 状态 |
| ---------- | --------------------------------------------- | ---- |
| 虚拟机配置 | VMware、CPU、内存、硬盘、NAT 网络             |      |
| Linux 登录 | root 登录、密码输入规则                       |      |
| 网络配置   | 启动 ens33 网卡，获取虚拟机 IP                |      |
| 远程连接   | 学习 SSH 连接方式及配置                       |      |
| Linux 命令 | 文件复制、打包、压缩和解压                    |      |
| MySQL      | 查找 MySQL、退出数据库、了解 Navicat 远程连接 |      |
| 防火墙     | 开放 8080、80 等端口                          |      |
| Nginx      | 排查端口问题，成功通过 Windows 浏览器访问     |      |

## 二、今天最重要的知识点

1. Linux 常用命令

```
ip addr                   # 查看 IP
cp a.txt /opt/            # 复制文件
tar -czvf a.tar.gz demo/  # 压缩
tar -xzvf a.tar.gz        # 解压
ps -ef | grep nginx       # 查看进程
ss -lntp                  # 查看监听端口
```

2. Linux 防火墙

```
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-ports
```

3. JavaWeb 部署核心原理

- Linux：提供项目运行环境。
- Nginx：提供前端页面及反向代理。
- Spring Boot：运行 Java 后端业务。
- MySQL：存储业务数据。
- IP + 端口：确定要访问的服务器与服务。

## 三、今日实际成果

今日总结： 从 VMware 虚拟机配置开始，掌握了 Linux 基础命令、网络配置、防火墙与 Nginx 访问，成功完成了本地 Linux 服务器的初步部署实践。当前还不能认定 Tlias 已完整部署成功，下一步重点是打通前后端与数据库。
