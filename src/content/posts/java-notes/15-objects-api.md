---
title: "Java 学习笔记 15：Objects 工具类"
published: 2026-11-01
description: "Objects.equals、空值判断与 requireNonNull。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 15
draft: false
lang: zh_CN
author: Player
---

`Objects` 是 Java 提供的对象工具类。

需要导包：

```java
import java.util.Objects;
```

它和 `Object` 不是一个类：

```text
Object
→ 所有类的父类
→ equals()、toString()、clone() 等

Objects
→ 对象工具类
→ 提供大量 static 工具方法
```

因此通常通过：

```java
Objects.方法名(...)
```

直接调用。

## Objects.equals()

```java
Objects.equals(a, b);
```

用于安全地判断两个对象是否相等。

例如：

```java
String s1 = null;
String s2 = "abc";

System.out.println(Objects.equals(s1, s2));
```

结果：

```text
false
```

相比：

```java
s1.equals(s2);
```

`Objects.equals()` 可以安全处理 `null`。

可以简单理解其判断逻辑：

```text
两个都是 null
→ true

只有一个是 null
→ false

两个都不是 null
→ 调用 equals() 判断
```

所以 `Objects.equals()` 并没有改变 `equals()` 的比较规则，而是：

> 在调用 `equals()` 的基础上增加了对 `null` 的安全处理。

## Objects.isNull()

判断对象是否为 `null`：

```java
Objects.isNull(obj);
```

可以理解为：

```java
obj == null
```

返回：

```text
boolean
```

例如：

```java
String s = null;

System.out.println(Objects.isNull(s));
```

结果：

```text
true
```

## Objects.nonNull()

判断对象是否不为 `null`：

```java
Objects.nonNull(obj);
```

可以理解为：

```java
obj != null
```

例如：

```java
String s = "abc";

System.out.println(Objects.nonNull(s));
```

结果：

```text
true
```

## Objects.requireNonNull()

```java
Objects.requireNonNull(obj);
```

作用：

> 要求这个对象不能是 `null`。

如果对象不是 `null`，正常返回该对象。

如果对象是：

```java
null
```

则会抛出：

```text
NullPointerException
```

例如：

```java
String name = null;

Objects.requireNonNull(name);
```

会出现 `NullPointerException`。

还可以提供提示信息：

```java
Objects.requireNonNull(name, "name不能为null");
```

如果 `name == null`，异常信息中就会带上：

```text
name不能为null
```

它经常用于提前检查参数是否合法。

## Object.equals() 与 Objects.equals()

容易混淆：

```java
a.equals(b);
```

属于：

```text
Object / 对象自己的 equals() 方法
```

而：

```java
Objects.equals(a, b);
```

属于：

```text
Objects 工具类的 static 方法
```

核心区别：

```text
a.equals(b)
→ 需要 a 本身不是 null

Objects.equals(a, b)
→ 可以安全处理 null
```

但是最终两个非 `null` 对象怎么判断“相等”，依然取决于对象自身的 `equals()` 实现。

## Objects 核心理解

```text
Objects
→ 工具类
→ 方法主要是 static
→ 使用类名直接调用

Objects.equals()
→ 安全比较两个对象

Objects.isNull()
→ 判断是否为 null

Objects.nonNull()
→ 判断是否不为 null

Objects.requireNonNull()
→ 要求对象不能为 null
```
