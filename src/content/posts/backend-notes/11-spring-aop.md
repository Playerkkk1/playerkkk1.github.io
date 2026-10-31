---
title: "后端学习笔记 11：Spring AOP"
published: 2026-11-01
description: "AOP 基本概念、常用注解及 execution、@annotation 切入点表达式。"
tags: ["Java","Spring Boot","后端开发"]
category: 后端开发
series: "后端学习笔记"
seriesOrder: 11
draft: false
lang: zh_CN
author: Player
---

> 学习日期：2026-10-27。

## AOP知识点

AOP（面向切面编程）：在不修改原有业务代码的情况下，对指定方法进行功能增强。

常见用途：日志记录、事务管理、权限校验、性能监控。

| 概念                 | 含义                                          |
| -------------------- | --------------------------------------------- |
| 连接点（Join Point） | 可以被增强的位置，Spring AOP 中主要是方法执行 |
| 切入点（Pointcut）   | 筛选哪些方法需要增强的规则                    |
| 通知（Advice）       | 对目标方法添加的增强逻辑                      |
| 切面（Aspect）       | 切入点 + 通知                                 |
| 目标对象（Target）   | 原始业务对象                                  |
| 代理对象（Proxy）    | Spring 创建的代理对象，负责执行增强逻辑       |

核心原理：Spring AOP 主要通过动态代理实现方法增强。

## AOP 常用注解

| 注解              | 作用                           |
| ----------------- | ------------------------------ |
| `@Aspect`         | 声明切面类                     |
| `@Component`      | 将切面类交给 Spring 管理       |
| `@Pointcut`       | 定义可复用的切入点表达式       |
| `@Before`         | 目标方法执行前通知             |
| `@After`          | 目标方法结束后通知（包括异常） |
| `@AfterReturning` | 目标方法正常返回后通知         |
| `@AfterThrowing`  | 目标方法抛出异常后通知         |
| `@Around`         | 环绕通知，可在方法执行前后增强 |

## 切入点表达式

### 1. execution 表达式

用于根据方法签名匹配目标方法。

```
execution(* com.campustask.service.impl.*.*(..))
```

含义：

- 第一个 `*`：任意返回值类型
- `com.campustask.service.impl`：指定包
- 第二个 `*`：任意类
- 第三个 `*`：任意方法
- `(..)`：任意参数

### 2. @Pointcut 注解

用于统一定义切入点，避免重复编写表达式。

```
@Pointcut("execution(* com.campustask.service.impl.*.*(..))")
public void pt() {}
```

其他通知可以直接引用：

```
@Before("pt()")
public void before() {
    log.info("方法开始执行");
}

@After("pt()")
public void after() {
    log.info("方法执行结束");
}
```

注意：`pt()` 是切入点方法，用于命名和复用表达式，方法体通常为空。

### 3. @annotation 表达式

用于匹配带有指定注解的方法。

例如自定义 `@LogOperation` 注解后：

```
@Around("@annotation(com.campustask.annotation.LogOperation)")
```

只有标注了 `@LogOperation` 的方法才会被匹配。
