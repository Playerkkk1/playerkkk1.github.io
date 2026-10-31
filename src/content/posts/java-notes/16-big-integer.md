---
title: "Java 学习笔记 16：BigInteger"
published: 2026-11-01
description: "大整数的创建、运算、比较与不可变性。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 16
draft: false
lang: zh_CN
author: Player
---

`BigInteger` 用于表示非常大的整数，当整数超过 `long` 的范围时可以使用。

需要导包：

```
import java.math.BigInteger;
```

## 创建 BigInteger

常用方式是通过字符串创建：

```
BigInteger a = new BigInteger("123456789012345678901234567890");
```

使用字符串的原因是：超大整数字面量可能已经超过 `long` 的范围，无法直接使用普通整数类型表示。

## BigInteger 的运算

`BigInteger` 是对象，不能直接使用：

```
+  -  *  /
```

进行算术运算，而是通过方法完成。

```
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("20");
```

常见方法：

```
a.add(b);       // 加法
a.subtract(b);  // 减法
a.multiply(b);  // 乘法
a.divide(b);    // 除法
```

例如：

```
BigInteger result = a.add(b);

System.out.println(result);
```

结果：

```
120
```

## BigInteger 的比较

`BigInteger` 是对象，比较数值大小时不能使用：

```java
>  <  >=  <=
```

应该使用：

```java
compareTo()
```

例如：

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("200");

int result = a.compareTo(b);
```

`compareTo()` 的返回结果：

```text
负数 → a < b
0   → a == b
正数 → a > b
```

实际判断：

```java
if (a.compareTo(b) > 0) {
    System.out.println("a大于b");
}

if (a.compareTo(b) < 0) {
    System.out.println("a小于b");
}

if (a.compareTo(b) == 0) {
    System.out.println("a等于b");
}
```

如果只判断两个 `BigInteger` 的数值是否相等，可以使用：

```java
a.equals(b)
```

例如：

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("100");

System.out.println(a.equals(b));
```

结果：

```text
true
```

因此：

```text
compareTo() → 比较数值大小
equals()    → 判断数值是否相等
```

不要使用：

```java
a == b
```

判断两个 `BigInteger` 的数值是否相等，因为对于引用类型，`==` 判断的是两个引用是否指向同一个对象。

## BigInteger 是不可变对象

`BigInteger` 和 `String` 类似，是不可变对象。

例如：

```
BigInteger a = new BigInteger("10");
BigInteger b = new BigInteger("20");

a.add(b);
```

执行 `add()` 后，原来的 `a` 不会变成 `30`。

运算结果会作为新的 `BigInteger` 返回：

```
BigInteger result = a.add(b);
```

也可以重新赋值：

```
a = a.add(b);
```

## 核心理解

```
BigInteger
│
├── 用于表示超出 long 范围的大整数
├── 位于 java.math 包
├── 超大整数通常通过 String 创建
├── 不能直接使用 + - * /
├── 使用 add()、subtract()、multiply()、divide() 运算
└── BigInteger 不可变，运算结果通过返回值获得
```

> `BigInteger` 现阶段掌握用途、创建方式和基本运算即可。
