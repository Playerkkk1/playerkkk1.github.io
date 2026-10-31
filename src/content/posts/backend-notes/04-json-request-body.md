---
title: "后端学习笔记 04：JSON 请求体"
published: 2026-11-01
description: "使用实体对象与 @RequestBody 接收 JSON 请求参数。"
tags: ["Java","Spring Boot","后端开发"]
category: 后端开发
series: "后端学习笔记"
seriesOrder: 4
draft: false
lang: zh_CN
author: Player
---

> 学习日期：2026-10-13。

## 如何接收Json格式请求参数

通过实体对象接收，保证json格式的键名与对象属性名保持一致，并**添加@RequestBody注解**

```java
  //新增部门
    @PostMapping()
    public Result insert(@RequestBody Dept dept){
        System.out.println("新增部门名为:"+dept);
        deptService.insert(dept);
        return Result.success();
    }
```

json格式的请求参数适用场景

> 主要在POST，PUT请求中，在请求体传递参数
