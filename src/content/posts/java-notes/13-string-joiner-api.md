---
title: "Java 学习笔记 13：StringJoiner API"
published: 2026-11-01
description: "字符串拼接、前后缀、add 方法及其与手动拼接的区别。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 13
draft: false
lang: zh_CN
author: Player
---

`StringJoiner` 用于按照指定的分隔符拼接多个字符串。

需要导包：

```java
import java.util.StringJoiner;
```

## 基本使用

创建 `StringJoiner`：

```java
StringJoiner sj = new StringJoiner(",");
```

其中：

```text
"," → delimiter（分隔符）
```

添加字符串：

```java
sj.add("1");
sj.add("2");
sj.add("3");
```

最终：

```java
System.out.println(sj.toString());
```

结果：

```text
1,2,3
```

`StringJoiner` 会自动处理元素之间的分隔符，不需要自己判断最后一个元素。

## 带前缀和后缀

```java
StringJoiner sj = new StringJoiner(",", "[", "]");
```

三个参数分别是：

```text
"," → delimiter 分隔符
"[" → prefix 前缀
"]" → suffix 后缀
```

例如：

```java
sj.add("1");
sj.add("2");
sj.add("3");
```

结果：

```text
[1,2,3]
```

可以理解为：

```text
prefix + 元素 + delimiter + 元素 + ... + suffix
```

## add() 需要 String

例如：

```java
int[] date = {1, 2, 3, 4};
```

`date[i]` 是 `int`，而：

```java
sj.add(date[i] + "");
```

通过：

```java
date[i] + ""
```

可以把 `int` 转换成 `String`。

也可以写：

```java
sj.add(String.valueOf(date[i]));
```

## StringJoiner 与之前手写字符串拼接的区别

之前：

```java
String result = "";

for (int i = 0; i < date.length; i++) {
    if (i != date.length - 1) {
        result = result + date[i] + ",";
    } else {
        result = result + date[i];
    }
}
```

使用 `StringJoiner`：

```java
StringJoiner sj = new StringJoiner(",");

for (int i = 0; i < date.length; i++) {
    sj.add(date[i] + "");
}

return sj.toString();
```

核心作用：

> 当多个数据需要按照固定分隔符进行拼接时，可以使用 `StringJoiner`，避免自己处理最后一个分隔符。
