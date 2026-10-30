---
title: "MySQL 学习笔记 09：用户与权限管理"
published: 2026-10-30
description: "用户创建、授权、权限回收、查询与删除相关笔记。"
tags: [MySQL, SQL, 数据库]
category: MySQL
series: "MySQL 学习笔记"
seriesOrder: 9
draft: false
lang: zh_CN
author: Player
---

## 基本权限类型

![基本权限类型（笔记配图）](./images/image-20260704182610736.png)

## 创建用户语法

```sql
create user 'username'@'localhost'identified by 'password';
#‘username表示要创建的用户的用户名’
#‘localhost’表示用户可以通过连接到MySQL服务器的本地主机，其中‘%’表示允许来自任何主机的连接
-- create user 'username'@'%'identified by 'password';

#'password'表示要创建的用户的用户名
```

## 赋予权限语法

![赋予权限语法（笔记配图）](./images/image-20260704184012611.png)

## 回收权限语法

![回收权限语法（笔记配图）](./images/image-20260704184146564.png)

## 查看语法权限

![查看语法权限（笔记配图）](./images/image-20260704184200781-1783161721257-1.png)

## 删除用户语法

![删除用户语法（笔记配图）](./images/image-20260704184214085.png)
