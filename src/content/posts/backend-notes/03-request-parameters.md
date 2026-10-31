---
title: "后端学习笔记 03：驼峰映射与请求参数"
published: 2026-11-01
description: "MyBatis 驼峰命名映射及 Spring MVC 简单参数的接收方式。"
tags: ["Java","Spring Boot","后端开发"]
category: 后端开发
series: "后端学习笔记"
seriesOrder: 3
draft: false
lang: zh_CN
author: Player
---

> 学习日期：2026-10-12。

## mybatis配置驼峰命名映射

```yaml
mybatis:
  configuration:
    #开启驼峰命名映射开关
    map-underscore-to-camel-case: true
```

## 简单参数接收方式

方法一:通过原始的HttpServletRequest对象获取

```java

@GetMapping("/depts")
public String get(HttpServletRequest request) {
    String id = request.getParameter("id");
    return id;
}

```

方法二：通过@RequestParam进行参数绑定

```java
@GetMapping("/depts")
public String get(@RequestParam("id") Integer deptId) {
    return "部门ID：" + deptId;
}
```

方法三:保证请求参数与形参变量名相同，直接接收**（推荐）**

```java
@GetMapping("/depts")
public String get(Integer id) {
    return "部门ID：" + id;
}
```
