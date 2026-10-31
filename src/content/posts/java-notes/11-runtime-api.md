---
title: "Java 学习笔记 11：Runtime API"
published: 2026-11-01
description: "Runtime 对象、运行环境信息与 exec 方法。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 11
draft: false
lang: zh_CN
author: Player
---

## Runtime

`Runtime` 表示当前 Java 程序的运行环境，可以通过它获取 JVM 运行相关的信息等。

### 获取 Runtime 对象

```java
Runtime r = Runtime.getRuntime();
```

拆解：

```java
Runtime.getRuntime()
```

- `Runtime` 是类名。
- `getRuntime()` 是 `static` 方法。
- 因此可以通过 `类名.方法名()` 调用。
- `getRuntime()` 返回 `Runtime` 对象的引用。
- `r` 是 `Runtime` 类型的引用变量。

可以理解为：

```text
r ───→ Runtime 对象
```

不能简单理解成：

```java
Runtime r = new Runtime();
```

我们不是自己创建 `Runtime` 对象，而是通过：

```java
Runtime.getRuntime();
```

获取当前 Java 应用对应的 `Runtime` 对象。

多次调用：

```java
Runtime r1 = Runtime.getRuntime();
Runtime r2 = Runtime.getRuntime();
```

`r1` 和 `r2` 获取的是同一个当前运行环境对应的 `Runtime` 对象。

### Runtime 中的方法调用

获取对象后，可以通过 Runtime 对象调用实例方法：

```java
Runtime r = Runtime.getRuntime();

r.availableProcessors();
r.maxMemory();
r.totalMemory();
r.freeMemory();
```

注意两种调用方式：

```java
Runtime.getRuntime();
```

属于：

```text
类名.static方法()
```

而：

```java
r.maxMemory();
```

属于：

```text
对象.实例方法()
```

### exec() 方法

`exec` 可以理解为 `execute`，即“执行”。

它用于让 Java 程序启动一个外部进程。

例如看到方法声明：

```java
public Process exec(String command)
```

应该能够读懂：

```text
public          → 访问权限
Process         → 返回值类型
exec            → 方法名
String command  → 参数
```

因此：

- `exec()` 没有 `static`，需要通过 Runtime 对象调用。
- 需要传入一个 `String` 类型参数。
- 执行后返回 `Process` 类型的对象引用。

结构可以理解为：

```text
Runtime 对象
    ↓
调用 exec()
    ↓
启动外部进程
    ↓
得到 Process 对象
    ↓
返回其引用
```
