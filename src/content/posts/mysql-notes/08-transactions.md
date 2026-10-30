---
title: "MySQL 学习笔记 08：数据库事务"
published: 2026-10-30
description: "ACID、自动提交、提交回滚与事务隔离级别的学习记录。"
tags: [MySQL, SQL, 数据库]
category: MySQL
series: "MySQL 学习笔记"
seriesOrder: 8
draft: false
lang: zh_CN
author: Player
---

![数据库事务（笔记配图）](./images/image-20260630090347763.png)

> ACID特性
>
> 1.原子性
>
> 2.一致性
>
> 3.隔离性
>
> 4.持久性

```sql
#开启手动提交事务模式
set autocommit =false;或 set autocommit=0;

#恢复自动提交模式
set autocommit =true;或 set autocommit=1;

#查看是否是自动提交
show varibles like 'autocommit';

#提交和回滚
commit;
rollback;
```

## 开启独立事务

```sql
start transaction;
...
commit /rollback;
```

## 事务隔离

**一个事物内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰**

![事务隔离（笔记配图）](./images/image-20260702085731002.png)

```sql
#修改隔离级别
set transaction_isolation='隔离级别';

#查看隔离级别
select @@transaction_isolation;
```
