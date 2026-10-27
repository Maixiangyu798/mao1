# 文档索引

本目录保存产品需求、设计原型和素材处理脚本。应用代码位于仓库根目录的 `src/`。

## 产品需求

- [奶蛙 Python 学习平台 PRD](prd/奶蛙Python学习平台-PRD.md)
- [PRD 配图](prd/images/)：首页、课程、学习工作台等页面使用的奶蛙插画
- [素材处理脚本](prd/scripts/remove_bg.py)：原型素材去背景脚本

## 设计原型

[Figma 原型页面](design/figma-prototype/) 共 28 张 PNG，按页面编号 `PG-01`–`PG-19` 组织，另含全局状态与关键状态补充图。

| 分组 | 原型页面 |
| --- | --- |
| 首页与账号 | `PG-01 首页 · 已登录`、`PG-01 首页 · 游客`、`PG-02 登录`、`PG-03 注册`、`PG-16 找回密码 · 验证账号 / 设置新密码 / 完成` |
| 新手引导 | `PG-04 新手引导 · 基础选择 1／2`、`PG-04 新手引导 · 目标选择 2／2`、`PG-04 新手引导 · 路线推荐完成` |
| 课程与学习 | `PG-05 课程列表`、`PG-06 课程详情`、`PG-07 学习工作台 · 运行成功未提交` |
| 题库与练习 | `PG-08 题库 · 列表`、`PG-08 题库 · 闯关地图`、`PG-09 题目详情 · 初始状态` |
| 排行榜与个人中心 | `PG-10 排行榜`、`PG-11 个人概览`、`PG-12 学习记录`、`PG-13 成就墙`、`PG-14 我的收藏 · 课程 / 题目`、`PG-15 设置` |
| 消息与状态页 | `PG-17 消息中心`、`PG-18 404 页面未找到`、`PG-19 500 服务异常` |
| 全局状态 | `全局状态 · 控件与加载`、`全局状态 · 确认与完成`、`全局状态 · 空内容`、`学习与训练 · 关键状态` |

## 与实现代码的对应关系

| 设计 / 文档 | 代码入口 |
| --- | --- |
| 首页 | `src/pages/HomePage.tsx` |
| 登录、注册、找回密码 | `src/pages/auth/` |
| 新手引导 | `src/pages/onboarding/OnboardingPage.tsx` |
| 课程列表与详情 | `src/pages/courses/` |
| 学习工作台 | `src/pages/learn/LearnPage.tsx` |
| 题库与题目详情 | `src/pages/practice/` |
| 排行榜 | `src/pages/ranking/RankingPage.tsx` |
| 个人中心 | `src/pages/profile/` |
| 消息中心 | `src/pages/messages/MessagesPage.tsx` |
| 状态页 | `src/pages/errors/` |
