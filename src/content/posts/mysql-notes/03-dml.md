---
title: "MySQL 学习笔记 03：数据操纵语句 DML"
published: 2026-10-30
description: "INSERT、UPDATE 与 DELETE 的基础语法和练习记录。"
tags: [MySQL, SQL, 数据库]
category: MySQL
series: "MySQL 学习笔记"
seriesOrder: 3
draft: false
lang: zh_CN
author: Player
---

**DML关键字**

```sql
insert :用于数据插入关键字

update:用于数据修改关键字

delete:用于数据删除关键字
```

## 插入语法

```sql
#为表的所有字段(列)插入一行数据，且值的顺序必须和数据表中的列字段顺序一致
insert into 表名 values(value1,value2...);

#为表的一行指定字段 插入数据 （推荐）
inset into 表名(列名1，列名2...) values(value1,value2...);
#前后对应顺序也需一致

#同时插入多条记录
insert into 表名 values(value1,value2,...),(value1,value2,...);
or
insert into 表名(列名1，列名2...) values(value1,value2,...),(value1,value2,...);




######实例
#不指定字段名称插入
insert into books values(1,'Tal of AAA','Dickes',23,1995,'novel',11);

#指定所有字段名称，插入

insert into books (id,name,authors,price,pubdate,note,num)values(2,'EmmaT','Jane Lura',40,1993,'joke',22);

#同时插入多条记录
insert into books (id,name,authors,price,pubdate,note,num) values
(3,'Story of jane','Jane Tim',40,2001,'novel',0),
(4,'Lovey Day','George Byron',20,2005,'novel',30),
(5,'Old land','Honore Bllade',30,1999,'medicine',40),
(6,'The Battle','Upton Sara',30,1999,'medicine',40),
(7,'Rose Hood','Richard haggard',28,2008,'cartoon',28);


```

## 修改数据

```sql
#修改表中所有行数据(全表修改)
update table_name set column1=value1,column2=value2...



####实例
#将所有novel书价格提升5元
update books set price =price+5 where note='novel';
select * from books;



#修改表中符合条件行的数据(条件修改)
update table_name set column1=value1,column2=value2...[where condition]
```

## 删除数据

```sql
#删除表中所有行数据 (全表删除)
delete from 表名

#删除表中符合条件行的数据(条件删除)
delete from 表名 where 条件
```
