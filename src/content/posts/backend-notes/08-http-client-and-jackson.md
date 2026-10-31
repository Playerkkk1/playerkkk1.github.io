---
title: "后端学习笔记 08：HttpClient 与 Jackson"
published: 2026-11-01
description: "HTTP 请求构建与发送、JSON 序列化反序列化及 AI 响应解析。"
tags: ["Java","Spring Boot","后端开发"]
category: 后端开发
series: "后端学习笔记"
seriesOrder: 8
draft: false
lang: zh_CN
author: Player
---

> 学习日期：2026-10-21。

## 一、HttpClient：发送 HTTP 请求

| 核心方法                               | 作用                             |
| -------------------------------------- | -------------------------------- |
| `HttpClient.newHttpClient()`           | 创建 HTTP 客户端                 |
| `HttpRequest.newBuilder()`             | 构建请求                         |
| `.header()`                            | 添加请求头，如身份认证、数据格式 |
| `.POST(BodyPublishers.ofString(json))` | 设置 POST 请求及请求体           |
| `httpClient.send()`                    | 同步发送请求并等待响应           |
| `response.statusCode()`                | 获取 HTTP 状态码                 |
| `response.body()`                      | 获取响应体                       |

重点： 构建请求 ≠ 发送请求；收到响应 ≠ 请求成功。

## 二、Jackson：JSON 数据转换

| 方法                        | 作用                         |
| --------------------------- | ---------------------------- |
| `writeValueAsString()`      | Java 对象 → JSON 字符串      |
| `readTree()`                | JSON 字符串 → `JsonNode`     |
| `path("字段")`              | 读取 JSON 对象中的字段       |
| `get(0)`                    | 读取 JSON 数组第一个元素     |
| `asText()`                  | 将节点值读取为字符串         |
| `readValue(json, 类.class)` | JSON 字符串 → 指定 Java 对象 |

两个概念：

- 序列化：Java 对象 → JSON。
- 反序列化：JSON → Java 对象。

## 三、最值得记住的代码

```java
// 1. Java 对象转 JSON
String json = objectMapper.writeValueAsString(data);

// 2. JSON 解析为树
JsonNode root = objectMapper.readTree(json);

// 3. 提取 AI 回复内容
String content = root.path("choices")
        .get(0)
        .path("message")
        .path("content")
        .asText();

// 4. JSON 转 DTO
ParseTaskResponse task = objectMapper.readValue(
        content,
        ParseTaskResponse.class
);
```

第三步假设 `choices` 非空且结构正确；实际项目中需要先校验。
