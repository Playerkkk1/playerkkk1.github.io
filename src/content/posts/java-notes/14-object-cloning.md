---
title: "Java 学习笔记 14：对象克隆"
published: 2026-11-01
description: "Cloneable、clone、对象赋值、浅克隆与深克隆。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 14
draft: false
lang: zh_CN
author: Player
---

`clone()` 是 `Object` 类提供的方法，用于克隆对象。

注意：

> `clone` 不是一个类，而是 `Object` 中的方法。

与克隆有关的：

```java
Object
Cloneable
CloneNotSupportedException
```

## Cloneable 接口

如果一个类需要使用 `Object` 提供的克隆机制，一般需要：

```java
public class User implements Cloneable {
}
```

`Cloneable` 是一个标记接口。

作用可以理解为：

> 告诉 Java：这个类允许进行克隆。

## 重写 clone()

基本结构：

```java
@Override
protected Object clone() throws CloneNotSupportedException {
    return super.clone();
}
```

其中：

```java
super.clone();
```

表示调用父类 `Object` 提供的 `clone()` 方法。

如果：

```java
class User
```

没有显式继承其他类，那么：

```text
User → Object
```

所以这里的：

```java
super.clone()
```

调用的是：

```java
Object.clone()
```

## 对象赋值与克隆的区别

## 普通赋值

```java
User u1 = new User(...);
User u2 = u1;
```

这里没有创建新的 `User` 对象。

内存关系：

```text
u1 ──┐
     ↓
   User①
     ↑
u2 ──┘
```

因此：

```java
u1 == u2
```

结果：

```text
true
```

因为两个引用指向同一个对象。

## clone()

```java
User u1 = new User(...);

User u2 = (User) u1.clone();
```

克隆之后：

```text
u1 → User①

u2 → User②
```

因此：

```java
u1 == u2
```

结果：

```text
false
```

因为已经产生了两个不同的 `User` 对象。

## 浅克隆

假设：

```java
class User {
    String name;
    int age;
    int[] date;
}
```

只使用：

```java
User u = (User) super.clone();
```

会创建一个新的 `User` 对象。

但是 `date` 是引用类型，默认情况下复制的是它保存的引用。

所以：

```text
u1 → User① ──┐
              ↓
          date数组①
              ↑
u2 → User② ──┘
```

外层 `User` 是两个对象，但是两个 `User` 中的 `date` 指向同一个数组。

因此：

```java
u1 == u2
```

结果：

```text
false
```

但是：

```java
u1.getDate() == u2.getDate()
```

结果：

```text
true
```

这就是浅克隆。

## 深克隆

深克隆不仅复制外层对象，还需要把需要独立的内部可变引用对象继续复制。

希望达到：

```text
u1 → User① → date数组①

u2 → User② → date数组②
```

两个 `User` 不同：

```text
User① != User②
```

两个数组也不同：

```text
date数组① != date数组②
```

但是数组中的数据相同。

## 对数组进行深克隆

第一步，克隆外层对象：

```java
User u = (User) super.clone();
```

此时：

```text
原 User → date数组①
新 User → date数组①
```

还是浅克隆。

第二步，再克隆数组：

```java
u.date = date.clone();
```

此时：

```text
原 User → date数组①

新 User → date数组②
```

最后：

```java
return u;
```

完整核心代码：

```java
@Override
protected Object clone() throws CloneNotSupportedException {

    // 克隆外层 User
    User u = (User) super.clone();

    // 克隆内部数组
    u.date = date.clone();

    // 返回新的 User
    return u;
}
```

核心思路：

```text
super.clone()
      ↓
复制外层对象
      ↓
内部可变引用对象继续 clone()
      ↓
让内部对象也独立
      ↓
return 新对象
```

## 为什么 String 通常不用继续 clone？

例如：

```java
String name;
```

`String` 虽然也是引用类型，但是 `String` 是不可变对象。

因此即使：

```text
u1.name ──┐
          ↓
        "zyf"
          ↑
u2.name ──┘
```

通常也不会出现类似数组那样修改内部内容导致另一个对象跟着变化的问题。

所以判断深克隆时，不应该简单记成：

```text
引用类型 → 全部重新 clone
```

更应该理解为：

> 对于需要相互独立的内部可变对象，需要继续复制。

## clone() 完整示例

```java
public class User implements Cloneable {

    private String name;
    private int age;
    private int[] date;

    public User(String name, int age, int[] date) {
        this.name = name;
        this.age = age;
        this.date = date;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {

        User u = (User) super.clone();

        u.date = date.clone();

        return u;
    }
}
```

调用：

```java
int[] date = {1, 2, 3, 4};

User u1 = new User("zyf", 18, date);

User u2 = (User) u1.clone();
```

## 今日 API 易错点

## 2. 对象赋值不等于克隆

```java
User u2 = u1;
```

只是多了一个引用：

```text
1 个对象
2 个引用
```

而：

```java
User u2 = (User) u1.clone();
```

才会产生新的外层对象：

```text
2 个对象
2 个引用
```

## 3. 浅克隆不是“没有创建新对象”

浅克隆：

```text
外层对象 → 新的
内部引用对象 → 可能共享
```

所以浅克隆仍然会产生新的外层对象。

## 4. 深克隆不是简单地把所有引用类型都复制

应该关注：

> 内部对象是否是需要独立的可变对象。

例如：

```text
int[] → 可变，通常需要考虑独立复制
String → 不可变，通常可以共享
```

## 5. 方法返回值不能忽略

例如：

```java
u1.toString();
```

虽然调用了 `toString()`，但是返回的 `String` 没有被使用，因此不会自动输出。

可以：

```java
System.out.println(u1.toString());
```

也可以：

```java
System.out.println(u1);
```

打印对象时会使用对象的 `toString()` 字符串表示。

当前最重要的一句话：

> `super.clone()` 复制外层对象；对于需要独立的内部可变对象，再继续复制。
