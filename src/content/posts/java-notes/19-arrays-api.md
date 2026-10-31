---
title: "Java 学习笔记 19：Arrays 工具类"
published: 2026-11-01
description: "数组排序、比较、填充、复制、转 List 与多维数组打印。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 19
draft: false
lang: zh_CN
author: Player
---

| 方法                                | 作用                     |
| :---------------------------------- | :----------------------- |
| `Arrays.toString(arr)`              | 把数组转成字符串打印     |
| `Arrays.sort(arr)`                  | 排序（升序）             |
| `Arrays.binarySearch(arr, key)`     | 二分查找（必须先排序）   |
| `Arrays.equals(a, b)`               | 比较两个数组内容是否相等 |
| `Arrays.fill(arr, val)`             | 用指定值填充数组         |
| `Arrays.copyOf(arr, newLength)`     | 复制数组（可改变长度）   |
| `Arrays.copyOfRange(arr, from, to)` | 复制指定范围             |
| `Arrays.asList(...)`                | 把数组转成 List          |
| `Arrays.stream(arr)`                | 转成 Stream（Java 8+）   |
| `Arrays.deepToString(arr)`          | 打印多维数组             |

示例

```java
//打印数组
int[] arr = {3, 1, 4, 1, 5};
System.out.println(arr);              // 输出 [I@1b6d3586（地址，无意义）
System.out.println(Arrays.toString(arr)); // [3, 1, 4, 1, 5]

//二分查找
int[] arr = {1, 3, 5, 7, 9};
int index = Arrays.binarySearch(arr, 5);
System.out.println(index); // 2

// 找不到时返回负数：-(插入点) - 1
System.out.println(Arrays.binarySearch(arr, 4)); // -3
```

## 排序

```java
int[] arr = {3, 1, 4, 1, 5};
Arrays.sort(arr);
System.out.println(Arrays.toString(arr)); // [1, 1, 3, 4, 5]

// 指定范围排序：[fromIndex, toIndex)
int[] arr2 = {5, 4, 3, 2, 1};
Arrays.sort(arr2, 1, 4); // 只排索引 1~3
System.out.println(Arrays.toString(arr2)); // [5, 2, 3, 4, 1]
```

## 比较数组

```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(a == b);              // false（比地址）
System.out.println(Arrays.equals(a, b)); // true（比内容）
```

## 填充

```java
int[] arr = new int[5];
Arrays.fill(arr, 7);
System.out.println(Arrays.toString(arr)); // [7, 7, 7, 7, 7]

// 范围填充
Arrays.fill(arr, 1, 3, 0);
System.out.println(Arrays.toString(arr)); // [7, 0, 0, 7, 7]
```

## 复制数组

```java
int[] arr = {1, 2, 3};

int[] copy1 = Arrays.copyOf(arr, 5);       // 长度变 5，多出的补 0
System.out.println(Arrays.toString(copy1)); // [1, 2, 3, 0, 0]

int[] copy2 = Arrays.copyOf(arr, 2);       // 截断
System.out.println(Arrays.toString(copy2)); // [1, 2]

int[] copy3 = Arrays.copyOfRange(arr, 1, 3); // [1, 3)
System.out.println(Arrays.toString(copy3)); // [2, 3]
```

## 转List

```java
String[] arr = {"a", "b", "c"};
List<String> list = Arrays.asList(arr);
System.out.println(list); // [a, b, c]
```

>  用 `Arrays.asList()` 得到的 List **长度固定**，不能 add / remove，但可以 set 修改元素

## 多维度数组打印

```java
int[][] matrix = {{1, 2}, {3, 4}};
System.out.println(Arrays.toString(matrix));     // 还是地址
System.out.println(Arrays.deepToString(matrix)); // [[1, 2], [3, 4]]
```
