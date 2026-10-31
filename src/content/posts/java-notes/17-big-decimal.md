---
title: "Java 学习笔记 17：BigDecimal"
published: 2026-11-01
description: "高精度小数的创建、运算、除法与比较。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 17
draft: false
lang: zh_CN
author: Player
---

`BigDecimal` 用于进行**精确的小数运算**。

需要导包：

```
import java.math.BigDecimal;
```

普通的 `float`、`double` 在进行某些小数运算时可能出现精度问题。

例如：

```
System.out.println(0.1 + 0.2);
```

结果可能是：

```
0.30000000000000004
```

原因是：

> 有些十进制小数无法使用二进制浮点数精确表示，因此 `float`、`double` 进行计算时可能产生精度误差。

需要精确的小数计算时，可以使用 `BigDecimal`。

## 创建 BigDecimal

推荐通过字符串创建：

```
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
```

推荐：

```
new BigDecimal("0.1");
```

不推荐：

```
new BigDecimal(0.1);
```

因为 `0.1` 在传入 `BigDecimal` 之前已经先作为 `double` 存储，可能存在精度误差。

也可以使用：

```
BigDecimal a = BigDecimal.valueOf(0.1);
```

因此常用方式：

```
new BigDecimal("0.1")     → 推荐
BigDecimal.valueOf(0.1)  → 可以使用
new BigDecimal(0.1)      → 不推荐
```

## BigDecimal 的基本运算

`BigDecimal` 是对象，不能直接使用：

```
+  -  *  /
```

进行算术运算。

假设：

```
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("2.5");
```

加法：

```
BigDecimal result = a.add(b);
```

减法：

```
BigDecimal result = a.subtract(b);
```

乘法：

```
BigDecimal result = a.multiply(b);
```

除法：

```
BigDecimal result = a.divide(b);
```

对应关系：

```
add()       → 加法
subtract()  → 减法
multiply()  → 乘法
divide()    → 除法
```

## BigDecimal 是不可变对象

`BigDecimal` 和 `String`、`BigInteger` 一样，是不可变对象。

例如：

```
BigDecimal a = new BigDecimal("10");
BigDecimal b = new BigDecimal("20");

a.add(b);
```

执行以后，原来的 `a` 不会变成 `30`。

`add()` 会返回一个新的计算结果，因此需要接收返回值：

```
BigDecimal result = a.add(b);
```

或者重新赋值：

```
a = a.add(b);
```

## BigDecimal 的除法

除法是 `BigDecimal` 中需要特别注意的地方。

例如：

```
BigDecimal a = new BigDecimal("10");
BigDecimal b = new BigDecimal("3");
```

数学结果：

```
10 ÷ 3 = 3.333333333...
```

这是无限循环小数。

如果直接：

```
a.divide(b);
```

因为无法得到有限的精确结果，可能抛出：

```
ArithmeticException
```

因此可以指定：

```
保留的小数位数 + 舍入方式
```

例如：

```
BigDecimal result =
        a.divide(b, 2, RoundingMode.HALF_UP);
```

需要导包：

```
import java.math.RoundingMode;
```

其中：

```
2
→ 保留2位小数

RoundingMode.HALF_UP
→ 四舍五入
```

结果：

```
3.33
```

## BigDecimal 的比较

比较数值大小可以使用：

```
compareTo()
```

例如：

```
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("20.5");

int result = a.compareTo(b);
```

返回结果：

```
负数 → a < b
0   → a 与 b 数值相等
正数 → a > b
```

例如：

```
if (a.compareTo(b) > 0) {
    System.out.println("a大于b");
}
```

需要特别注意 `equals()` 和 `compareTo()` 的区别。

例如：

```
BigDecimal a = new BigDecimal("10.0");
BigDecimal b = new BigDecimal("10.00");
```

使用：

```
a.compareTo(b)
```

结果为：

```
0
```

说明两者**数值大小相等**。

但：

```
a.equals(b)
```

结果为：

```
false
```

因为 `BigDecimal.equals()` 不仅比较数值，还会考虑小数位数（scale）。

所以如果主要目的是判断两个 `BigDecimal` 的**数值是否相等**，通常使用：

```
a.compareTo(b) == 0
```

## BigInteger 与 BigDecimal

```
BigInteger
→ 表示任意精度的大整数

BigDecimal
→ 表示任意精度的十进制数，适合精确的小数运算
```

共同特点：

```
BigInteger / BigDecimal
│
├── 都位于 java.math 包
├── 都是对象
├── 都是不可变对象
├── 运算结果需要使用返回值
└── 通过 add / subtract / multiply / divide 等方法进行运算
```

`BigDecimal` 额外需要注意：

```
BigDecimal
│
├── 解决常见浮点数精度问题
├── 推荐使用字符串创建
├── 除法可能需要指定精度和舍入方式
└── 比较数值是否相等时通常使用 compareTo()
```

> `BigInteger` 重点解决“大整数”，`BigDecimal` 重点解决“精确的十进制数运算”。
