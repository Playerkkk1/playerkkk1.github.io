---
title: "MySQL 学习笔记 01：启动与基础概念"
published: 2026-10-30
description: "连接 MySQL、数据库定义语句与 SQL 命名规范。"
tags: [MySQL, SQL, 数据库]
category: MySQL
series: "MySQL 学习笔记"
seriesOrder: 1
draft: false
lang: zh_CN
author: Player
---

1. cmd命令窗口
2. 连接MySQL服务命令

```bash
mysql -uroot -proot

mysql -uroot -p
```

> u后接的是用户名
>
> p后接的是密码
>
> sql语句以;号结束
>
> sql注释 #
>
> select version() ,查看MySQL版本号



**创建库**– –>**定字段**– –>**创建表**– –>**插数据**

## 数据库定义语句

![数据库定义语句（笔记配图）](./images/image-20260513094321532.png)

## SQL命名规定和规范

![SQL命名规定和规范（笔记配图）](./images/image-20260513094528133.png)

![SQL命名规定和规范（笔记配图）](./images/image-20260513095306200.png)
