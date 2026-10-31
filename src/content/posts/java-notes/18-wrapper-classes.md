---
title: "Java 学习笔记 18：包装类"
published: 2026-11-01
description: "基本类型对应的包装类、装箱、拆箱及字符串转换。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 18
draft: false
lang: zh_CN
author: Player
---

把基本数据类型的数据“包装”为**对象**。

| 基本类型  | 包装类      |
| --------- | ----------- |
| `byte`    | `Byte`      |
| `short`   | `Short`     |
| `int`     | `Integer`   |
| `long`    | `Long`      |
| `float`   | `Float`     |
| `double`  | `Double`    |
| `char`    | `Character` |
| `boolean` | `Boolean`   |

>  Java 中有些地方**必须使用对象，不能直接使用基本数据类型**，如泛型和集合

## 装箱

基本数据类型 → 包装类对象 称为**装箱**

以前 Java 可以这样：

```java
Integer i = Integer.valueOf(10);
```

也就是：

```java
int 10
↓
Integer对象
```

但现在 Java 可以自动完成：

```java
Integer i = 10;
//Java 会帮你完成基本类型到包装类型的转换。
```

这叫：

> **自动装箱 Autoboxing**

## 拆箱

包装类对象 → 基本数据类型 叫**拆箱 Unboxing**。

例如：

```java
Integer i = 10;

int n = i.intValue();
```

现在通常可以直接：

```java
Integer i = 10;

int n = i;
```

这叫：

> **自动拆箱 Auto-unboxing**

可能会看到：

```java
Integer a = 10;
Integer b = 20;

int result = a + b;

//这里a,b发生了自动拆箱（Java操作）
```

## 包装类最常用：字符串转换

例如：

```java
String s = "123";
```

想得到：

```java
int n = 123;
```

可以：

```java
int n = Integer.parseInt(s);

//其他类似
Double.parseDouble("3.14");
Boolean.parseBoolean("true");
Long.parseLong("123456");
```

####parseInt( )和valueOf( )

这两个很容易混。

```java
int a = Integer.parseInt("123");//返回int

Integer b = Integer.valueOf("123");//返回Integer
```

> 注意：包装类是对象，判断值相等优先使用 `equals()`

####null 自动拆箱

这个以后 Debug 很有用：

```java
Integer a = null;

int b = a;
```

第二行需要自动拆箱，相当于需要从 `a` 这个对象里取出 `int`。

但：

```
a → null
```

没有对象可以拆。

因此会：

```
NullPointerException
```

所以以后看到：

```java
Integer
Double
Long
```

这种包装类型时，要意识到：

> 它们是引用类型，因此可以是 `null`；基本类型 `int/double/long` 本身不能是 `null`。
