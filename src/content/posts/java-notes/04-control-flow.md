---
title: "Java 学习笔记 04：判断与循环"
published: 2026-11-01
description: "分支结构、循环语句与随机数的基础用法。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 4
draft: false
lang: zh_CN
author: Player
---

## 1. 分支结构

### 1.1 if语句

```java
if(关系表达式){
    语句体
}
```

> 如果对一个布尔类型的变量进行判断，不要用==号，直接把变量写在小括号内即可

```java
boolean flag=false;
if(flag){
    System.out.println("flag值为true");
}else{
     System.out.println("flag值为false");
}
// 输出flag值为false
```

**if的第三种格式**

```java
if(关系表达式1){
    语句体1;
}else if(关系表达式2){
    语句体2;
}
	...
  else{
      语句n+1;
  }
	//if或else if表达式中有符合的就执行对应的语句体，若没有则执else中的语句体
```

### 1.2 switch语句

```java
switch(表达式){
    case 值1:
        语句体1;
        break;
    case 值2:
        语句体2;
        break;
    ...
        default:
        语句体n+1;
        break;
            
}
```

> 执行流程：
>
> 1. 首先计算表达式的值。
> 2. 依次和case后面的值进行比较，如果有对应的值，就会执行相应的语句，在执行过程中，遇到break就会结束。
> 3. 如果所有case后面的值和表达式的值都不匹配，就会执行default里的语句体，然后结束整个switch语句。

### 1.3 if和switch的使用场景

**if第三种格式：一般用于对范围的判断**

**switch：把有限数据一一列举出来，让我们任选其一**

## 2. 循环语句

循环的分类

- for
- while
- do...while

### 2.1 for循环

```java
for(初始化语句;条件判断语句;条件控制语句){
    循环体语句;
}
```

### 2.2 while 循环

```java
初始化语句;
while(条件判断语句){
    循环体语句;
    条件控制语句;
}
```

### 2.3 无限循环

```java
for(;;){
    System.out.println("学习");
}

//do..while
do{
     System.out.println("学习");
}while(true);

//while  无限循环用的最多
while(true){
     System.out.println("学习");
}
```

> 注意事项:
>
> 无限循环的下面不能写其他代码,因为循环停不下来,下面的代码永远执行不到

### 2.4 continue和break的含义

**continue**:跳过本次循环,继续执行下次循环

```java
  for (int i = 1; i <=6 ; i++) {
      if(i==5){
      continue;//结束本次循环,继续下次循环
  }
    System.out.println(i);
  }//输出1,2,3,4,6
```



**break:**结束整个循环

```java
  for (int i = 1; i <=6 ; i++) {
      if(i==2){
     break;//结束整个循环
  }
    System.out.println(i);
  }//输出1
```

### 2.5 获取随机数

```java
Random r =new Random();
int number =r.nextInt(随机数的范围);
//以上只有number是变量名可以变,其他的都不允许

```

> 1.括号内写一个数字n,表示随机的最大值，但是不包含这个数字 0~n-1。
>
> 2.范围为0~n-1
>
> 3.int a=r.nextInt(1,10);范围为1—9
