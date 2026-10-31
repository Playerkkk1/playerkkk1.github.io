---
title: "Java 学习笔记 20：Lambda 表达式"
published: 2026-11-01
description: "Lambda 的作用、语法与函数式接口。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 20
draft: false
lang: zh_CN
author: Player
---

Lambda 是 **Java 8** 引入的最重要特性之一，它让代码更简洁，是**函数式编程**的基础。

## Lambda的作用

**传统写法(匿名内部类)**

```java
// 用 Runnable
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
}).start();
```

**Lambda写法**

```java
new Thread(() -> System.out.println("Hello")).start();
```

## Lambda的语法

```
(参数列表) -> { 方法体 }
```

| 形式     | 例子                                         |
| :------- | :------------------------------------------- |
| 无参     | `() -> System.out.println("hi")`             |
| 一个参数 | `x -> x * x`                                 |
| 多个参数 | `(a, b) -> a + b`                            |
| 带类型   | `(int a, int b) -> a + b`                    |
| 多行语句 | `(a, b) -> { int sum = a + b; return sum; }` |

**语法简化规则**

- **参数类型可省略**：`(int a, int b)` → `(a, b)`
- **单参数可省括号**：`(x) -> ...` → `x -> ...`
- **单行可省 return 和 {}**：`(a,b) -> { return a+b; }` → `(a,b) -> a+b`

## 函数式接口（重点！）

Lambda **只能用于函数式接口**。

> **函数式接口**：只有一个抽象方法的接口（可以有多个 default / static 方法）。

**自定义函数式接口**

```java
@FunctionalInterface   // 可选注解，帮助编译器检查
interface Calculator {
    int calc(int a, int b);
}

public class Demo {
    public static void main(String[] args) {
        Calculator add = (a, b) -> a + b;
        Calculator mul = (a, b) -> a * b;

        System.out.println(add.calc(2, 3)); // 5
        System.out.println(mul.calc(2, 3)); // 6
    }
}
```

> `@FunctionalInterface` 不是必须的，但强烈建议加，能帮你检查接口是否合法。

*实例*

**排序**

```java
List<String> list = Arrays.asList("banana", "apple", "cherry");

// 传统匿名内部类
Collections.sort(list, new Comparator<String>() {
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});

// Lambda
list.sort((a, b) -> a.length() - b.length());
```
