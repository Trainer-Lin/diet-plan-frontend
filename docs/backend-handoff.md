# 个人健康饮食计划系统后端交接文档

## 1. 项目目标

本项目后端的目标不是做复杂的 AI 推荐平台，而是稳定支撑前端以下核心业务：

- 用户注册、登录、登录态校验
- 用户个人档案维护
- 食物库查询与自定义食物录入
- 每日饮食记录与明细管理
- 热量、营养素、打卡、体重趋势等统计接口

对新手后端同学来说，最重要的是先把 `用户 -> 档案 -> 食物 -> 饮食记录 -> 统计` 这条主链路跑通。

---

## 2. 推荐技术栈

建议使用下面这套，学习成本和课设可控性都比较合适：

- 核心框架：`Spring Boot 3`
- JDK：`JDK 17`
- 数据库：`MySQL 8`
- 持久层：`MyBatis-Plus`
- 安全认证：`Spring Security + JWT`
- 参数校验：`Hibernate Validator`
- 工具库：`Lombok`
- 接口文档：`knife4j` 或 `springdoc-openapi`
- 构建工具：`Maven`

如果是新手，不建议一开始上太多复杂技术，比如 Redis、消息队列、分布式、微服务，这个项目完全没必要。

---

## 3. 推荐后端工程结构

建议按模块分层，不要所有类都堆在一个目录里。

```text
src/main/java/com/example/dietplan
├── common
│   ├── config
│   ├── exception
│   ├── result
│   └── utils
├── auth
│   ├── controller
│   ├── service
│   └── dto
├── user
│   ├── controller
│   ├── service
│   ├── mapper
│   ├── entity
│   └── dto
├── food
│   ├── controller
│   ├── service
│   ├── mapper
│   ├── entity
│   └── dto
├── record
│   ├── controller
│   ├── service
│   ├── mapper
│   ├── entity
│   └── dto
├── stats
│   ├── controller
│   ├── service
│   └── dto
└── DietPlanApplication.java
```

---

## 4. 数据库表设计

建议先做 5 张核心表，已经足够支撑前端当前页面。

### 4.1 用户表 `sys_user`

字段建议：

- `id`：主键
- `username`：用户名
- `email`：邮箱
- `password`：加密密码
- `nickname`：昵称
- `created_at`
- `updated_at`

用途：

- 注册登录
- 关联所有用户业务数据

### 4.2 用户档案表 `user_profile`

字段建议：

- `id`
- `user_id`
- `gender`
- `age`
- `height`
- `weight`
- `activity_level`
- `target_weight`
- `target_calories`
- `updated_at`

用途：

- 保存身体数据
- 支撑 TDEE / 热量推荐

### 4.3 食物表 `food`

字段建议：

- `id`
- `name`
- `category`
- `serving_unit`
- `serving_size`
- `calories`
- `protein`
- `carbs`
- `fat`
- `is_custom`
- `created_by`
- `created_at`

用途：

- 系统食物库
- 用户自定义食材

### 4.4 饮食记录主表 `diet_record`

字段建议：

- `id`
- `user_id`
- `record_date`
- `meal_type`
- `note`
- `total_calories`
- `created_at`

说明：

- 一条记录对应一顿，比如早餐一条、午餐一条

### 4.5 饮食记录明细表 `diet_record_item`

字段建议：

- `id`
- `record_id`
- `food_id`
- `food_name_snapshot`
- `amount`
- `calories`
- `protein`
- `carbs`
- `fat`

说明：

- 一顿饭里面可能有多个食物，所以要拆成明细表
- 即使后续食物表改了，历史记录也不受影响，因此建议保留 `snapshot` 字段

### 4.6 体重记录表 `weight_record`

字段建议：

- `id`
- `user_id`
- `record_date`
- `weight`
- `created_at`

用途：

- 支撑趋势图与目标分析

---

## 5. 后端必须实现的功能

### 5.1 认证模块

必须实现：

- 用户注册
- 用户登录
- JWT 生成
- JWT 校验
- 获取当前登录用户信息

建议接口：

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### 5.2 档案模块

必须实现：

- 获取个人档案
- 更新个人档案
- 根据档案计算建议热量

建议接口：

- `GET /api/profile`
- `PUT /api/profile`

### 5.3 食物库模块

必须实现：

- 查询食物列表
- 关键字搜索
- 新增自定义食材

建议接口：

- `GET /api/foods`
- `GET /api/foods/search?keyword=鸡胸`
- `POST /api/foods/custom`

### 5.4 饮食记录模块

必须实现：

- 按日期获取饮食记录
- 新增一顿饮食记录
- 删除某条饮食明细
- 自动汇总每顿总热量

建议接口：

- `GET /api/records/daily?date=2026-06-30`
- `POST /api/records`
- `DELETE /api/records/item/{id}`

### 5.5 统计模块

必须实现：

- 今日摄入统计
- 近 7 天热量趋势
- 宏量营养素趋势
- 打卡完成率
- 体重趋势

建议接口：

- `GET /api/stats/today`
- `GET /api/stats/weekly-calories`
- `GET /api/stats/weekly-macros`
- `GET /api/stats/checkin`
- `GET /api/stats/weight-trend`

---

## 6. 接口返回格式建议

建议统一返回，避免前端每个接口单独判断格式。

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

失败示例：

```json
{
  "code": 400,
  "message": "参数错误",
  "data": null
}
```

---

## 7. 前后端联调字段建议

为了让前端 Zustand 仓库容易替换真实接口，建议后端字段尽量稳定。

### 7.1 档案接口返回建议

```json
{
  "gender": "male",
  "age": 24,
  "height": 175,
  "weight": 68,
  "activity": "moderate",
  "tdee": 2140
}
```

### 7.2 食物接口返回建议

```json
[
  {
    "id": 1,
    "name": "鸡胸肉",
    "category": "高蛋白",
    "serving": "100 g",
    "calories": 133,
    "protein": 24.6,
    "carbs": 0,
    "fat": 3.1,
    "tags": ["减脂期", "常备"]
  }
]
```

### 7.3 饮食记录接口返回建议

```json
[
  {
    "id": "breakfast",
    "meal": "早餐",
    "time": "07:30",
    "totalCalories": 420,
    "note": "优先补充蛋白质和慢碳。",
    "foods": [
      {
        "name": "燕麦酸奶杯",
        "amount": "1 份",
        "calories": 180
      }
    ]
  }
]
```

---

## 8. 新手后端开发顺序

建议严格按照下面顺序做，不要跳着写：

1. 建数据库表
2. 完成注册登录
3. 完成 JWT 校验
4. 完成用户档案接口
5. 完成食物库查询接口
6. 完成饮食记录增删查
7. 最后再做统计接口

原因：

- 认证是所有业务入口
- 档案和食物库是记录功能的前置条件
- 统计模块依赖前面所有数据

---

## 9. 新手最容易踩的坑

### 9.1 不要明文存密码

必须加密存储，建议用 `BCryptPasswordEncoder`。

### 9.2 不要把所有逻辑写在 Controller

Controller 只接参数和返回结果，业务逻辑放到 Service。

### 9.3 记录表不要只做一张

一顿饭有多个食物，必须拆成主表和明细表。

### 9.4 不要先做统计接口

统计依赖记录数据，没有前面的数据结构就很难写对。

### 9.5 注意 token 解析失败处理

登录失效时要返回明确状态码，方便前端跳回登录页。

---

## 10. 本项目后端最低可交付版本

如果时间紧，至少保证下面这些能跑：

- 注册
- 登录
- 获取/更新档案
- 查询食物库
- 新增/查询每日饮食记录
- 查询本周热量趋势

只要这几个打通，前端页面就能完整演示。

---

## 11. 建议答辩表达

可以这样描述后端工作：

- 采用 `Spring Boot + MyBatis-Plus + MySQL + JWT` 搭建 RESTful 后端
- 完成用户认证、档案管理、食物库管理、饮食记录和统计分析模块
- 通过主表 + 明细表结构实现饮食记录的可扩展建模
- 为前端 Zustand 状态管理提供统一接口数据支撑

这套说法对新手友好，也足够像一个完整项目。
