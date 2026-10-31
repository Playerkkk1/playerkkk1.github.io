---
title: "Java 学习笔记 12：Object 与 equals"
published: 2026-11-01
description: "Object、toString、equals 与对象相等性比较。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 12
draft: false
lang: zh_CN
author: Player
---

`Object` 是 Java 中非常重要的父类。

Java 中的类最终都会继承到 `Object`，因此可以使用 `Object` 提供的方法。

今天重点学习：

```java
toString()
equals()
```

## toString()

`toString()` 用来获取对象的字符串表示。

例如：

```java
Student s = new Student();
System.out.println(s.toString());
```

如果没有重写 `toString()`，默认得到的字符串通常不能直观展示对象的属性信息。

因此实际开发中经常重写：

```java
toString()
```

让对象能够以更容易阅读的形式展示自己的数据。

例如希望：

```java
System.out.println(s);
```

得到类似：

```text
Student{name='小明', age=18}
```

核心理解：

> 重写 `toString()`，相当于规定“这个对象转换成字符串时应该如何描述自己”。

直接打印对象时：

```java
System.out.println(s);
```

Java 会利用对象的 `toString()` 得到它的字符串表示。

## equals()

`equals()` 用于判断两个对象是否相等。

但是必须注意：

> `equals()` 到底按照什么规则判断相等，要看具体类对 `equals()` 的实现。

## == 与 equals() 的区别

对于引用类型：

```java
s1 == s2
```

判断两个引用是否指向同一个对象。

例如：

```java
Student s1 = new Student();
Student s2 = s1;
```

关系：

```text
s1 ───┐
      ↓
 Student对象
      ↑
s2 ───┘
```

所以：

```java
s1 == s2
```

结果为：

```text
true
```

因为两个引用指向同一个对象。

如果：

```java
Student s1 = new Student("张三", 18);
Student s2 = new Student("张三", 18);
```

虽然两个对象的数据一样，但是执行了两次 `new`：

```text
s1 ──→ Student对象①
       name = "张三"
       age = 18

s2 ──→ Student对象②
       name = "张三"
       age = 18
```

所以：

```java
s1 == s2
```

结果为：

```text
false
```

## Object 默认的 equals()

如果 `Student` 没有重写 `equals()`：

```java
s1.equals(s2);
```

使用的是继承自 `Object` 的默认实现。

默认情况下，它判断的也是两个引用是否指向同一个对象。

因此上面的两个 Student 对象：

```java
s1.equals(s2);
```

结果仍然是：

```text
false
```

## 重写 equals()

子类可以重写 `equals()`，自己规定“什么情况下两个对象算相等”。

例如 Student 可以规定：

```text
name 相同
+
age 相同
↓
两个 Student 对象认为相等
```

这样即使：

```java
s1 != s2
```

也有可能：

```java
s1.equals(s2)
```

得到：

```text
true
```

因此不要简单死记：

```text
== 比地址
equals() 比内容
```

更准确的理解是：

```text
==

对于引用类型：
判断两个引用是否指向同一个对象
```

而：

```text
equals()

是一个方法
↓
具体比较规则取决于类对 equals() 的实现
```

**今日 API 相关易错点**

易错点 1：看到 xxx.method() 就认为都是对象调用

错误理解：

```text
xxx.method() 都是对象调用方法
```

应该先判断 `.` 左边是什么。

例如：

```java
String s = "abc";
s.charAt(0);
```

`s` 是引用变量：

```text
对象.方法()
```

而：

```java
Integer.parseInt("123");
```

`Integer` 是类名：

```text
类名.static方法()
```

 易错点 2：把引用变量当成对象

例如：

```java
Person p = new Person();
```

应该理解为：

```text
Person        → 类/类型
p             → 引用变量
new Person()  → 创建 Person 对象
```

关系：

```text
p ───→ Person对象
```

`p` 本身不是对象。

易错点 3：把 static 成员变量叫作全局变量

例如：

```java
static String school;
```

更准确的名称是：

```text
静态成员变量 / 类变量
```

它属于类，由这个类的对象共享。

普通成员变量：

```java
String name;
```

每个对象各有一份。

例如创建 100 个 Student 对象：

```text
name   → 每个对象各有一份，理论上 100 份
school → static，类共享一份
```

易错点 4：认为 main 中调用的方法必须加 static

`main()` 本身是：

```java
public static void main(String[] args)
```

所以它属于类。

它可以直接调用同一个类中的 `static` 方法。

如果要调用普通实例方法，可以先创建对象：

```java
Student s = new Student();
s.study();
```

因此不要为了让 `main()` 能调用某个方法，就无脑给方法加 `static`。

应该先判断：

```text
这个方法应该属于类？
→ 考虑 static

这个方法应该属于具体对象？
→ 实例方法
```

 今日核心理解

今天 API 学习中真正需要记住的不是方法名，而是看到 API 后能够判断：

```text
1. 这是哪个类提供的？

2. 方法有没有 static？

3. static
   → 通常使用 类名.方法()

4. 非 static
   → 通常需要先获得对象
   → 对象.方法()

5. 方法需要什么参数？

6. 方法返回什么类型？

7. 返回的是基本数据，还是某个对象的引用？
```

以后学习新的 Java API，优先按照这套思路阅读，而不是单纯背 API 的写法。
