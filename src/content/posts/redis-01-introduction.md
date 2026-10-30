
---
title: Redis 入门：认识 Redis
published: 2026-10-30
description: Redis 基础概念与常见应用场景
tags: [Redis, Java后端, 数据库]
category: Redis
series: Redis 从零入门
seriesOrder: 1
draft: false
---

# Redis 入门：认识 Redis

## 1. 什么是 Redis？

Redis 是一种高性能的键值型 NoSQL 数据库，主要将数据存储在内存中。

## 2. Redis 有什么特点？

- 读写速度快
- 支持多种数据类型
- 支持数据持久化
- 常用于缓存、计数器和排行榜

## 3. Redis 与 MySQL 的区别

| 对比 | Redis | MySQL |
|---|---|---|
| 数据模型 | Key-Value 等 | 关系型 |
| 主要存储位置 | 内存 | 磁盘 |
| 常见用途 | 缓存、排行榜 | 业务数据持久化 |

## 4. 我的第一条 Redis 命令

```redis
SET name zhangsan
GET name
DEL name
```
