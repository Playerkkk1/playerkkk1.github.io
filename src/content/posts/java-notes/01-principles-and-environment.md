---
title: "Java 学习笔记 01：运行原理与环境变量"
published: 2026-11-01
description: "Java 编译运行机制、内存概念及 Windows JDK 环境变量配置。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 1
draft: false
lang: zh_CN
author: Player
---

## java原理

### 1.运行机制

```java
.java-编译->.class -运行-> (JVM)虚拟机
```

### 2.内存

栈：方法

堆：new关键字

方法区：字节码文件

> 基本数据类型在内存中的特点：
>
> 记录的是真实的数据，传递的也是真实的数据
>
> 引用数据类型在内存的特点：
>
> 记录的是地址值，传递的也是地址值

## 环境变量

1.找到对应jdk的bin文件地址

2.系统和用户都可以分别新建一个变量JAVA_HOME

![环境变量（笔记配图）](./images/01-principles-and-environment/01.png)

3.用户变量里的path里面

![环境变量（笔记配图）](./images/01-principles-and-environment/02.png)

4.系统变量中的path

![环境变量（笔记配图）](./images/01-principles-and-environment/03.png)
