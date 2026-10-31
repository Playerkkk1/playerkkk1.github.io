---
title: "Java 学习笔记 21：异常处理"
published: 2026-11-01
description: "Java 异常体系、try/catch/finally、throw、throws 与异常传播。"
tags: ["Java","学习笔记"]
category: Java
series: "Java 学习笔记"
seriesOrder: 21
draft: false
lang: zh_CN
author: Player
---

## 1. 异常的概念

异常是程序运行过程中出现的非正常情况，会中断当前正常执行流程。

### 异常体系

```
Throwable
├── Error                  // 严重错误
└── Exception              // 异常
    ├── IOException        // IO异常
    ├── InterruptedException // 线程中断异常
    └── RuntimeException   // 运行时异常
        ├── NullPointerException
        ├── ArithmeticException
        └── IllegalStateException
```

异常分类：

- 受检异常（Checked Exception）：编译器要求捕获或声明，如 `IOException`。
- 非受检异常（Unchecked Exception）：编译器不强制处理，如 `RuntimeException` 及其子类。

## 2. 异常处理关键字

| 关键字    | 作用                       |
| --------- | -------------------------- |
| `try`     | 包含可能发生异常的代码     |
| `catch`   | 捕获并处理指定异常         |
| `finally` | 通常用于资源清理           |
| `throw`   | 主动抛出异常对象           |
| `throws`  | 声明方法可能向外抛出的异常 |

## 3. 经典代码示例

### try / catch / finally

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println(e.getMessage());
} finally {
    System.out.println("执行结束");
}
```

- 发生匹配异常后，跳过 `try` 中剩余代码，进入 `catch`。
- `finally` 通常都会执行，即使发生异常。

### throw 与 throws

```java
public void checkAge(int age) throws Exception {
    if (age < 0) {
        throw new Exception("年龄不能为负数");
    }
}
```

- `throw`：在方法内部真正抛出异常。
- `throws`：在方法声明处告知调用方可能抛出异常。

## 4. 异常传播机制

```
方法 A
  ↓ 调用
方法 B
  ↓ 调用
方法 C（发生异常）
  ↓
方法 B 未捕获 → 向上传播
  ↓
方法 A 捕获 → 处理异常
```

如果异常始终没有被捕获，就会继续传播，最终可能导致当前线程终止。

## 5. 实际开发中的异常处理

结合 `ZhipuClient`：

```java
try {
    HttpResponse<String> response = httpClient.send(
        request,
        HttpResponse.BodyHandlers.ofString()
    );

    if (response.statusCode() != 200) {
        throw new IllegalStateException("AI 请求失败");
    }

    return response.body();

} catch (IOException e) {
    throw new IllegalStateException("网络请求失败", e);

} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new IllegalStateException("请求被中断", e);
}
```

开发原则：

1. 能合理处理的异常，使用 `try/catch`。
2. 无法处理的异常，向上层传播。
3. 优先捕获具体异常类型，避免随意使用 `catch (Exception e)`。
4. 重新抛出异常时，尽量保留原始异常 `e`，方便排查。
5. 不要捕获异常后什么都不做。
