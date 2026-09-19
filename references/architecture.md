# Architecture · 企业产品手册生成系统

> v0.6 architecture baseline · 2026-09-19

## 目标

本系统不是让 Agent 从 71 个组件里自由拼页面，而是让非设计师通过「内容任务 → 页面 Schema → 受控 React 渲染 → PDF 质量门禁」稳定产出企业产品/服务手册。

## 分层

1. **Content**：原始文案、表格、图片、PDF 与事实证据。
2. **Diagnosis**：受众、页面目标、内容缺口、证据等级。
3. **Document**：章节、页序、叙事节奏与密度曲线。
4. **Page Schema**：页面任务、区块语义、组件名和结构化数据。
5. **Design System**：tokens、theme、style profile、组件契约、模板。
6. **Renderer**：React 根据 Schema 装配白名单组件。
7. **Quality Gate**：schema 校验、组件白名单、令牌扫描、溢出/密度检查、人工评分。

## 关键原则

- **先定页面任务，再选组件**：页面必须说明“让谁理解/相信/行动什么”。
- **来源证据与运行时主题分离**：`provenance` 说明组件为何如此设计；`theme` 与 `styleProfile` 决定当前项目如何渲染。
- **语义受控、风格可配置**：可以换字体、几何、密度、装饰和品牌色，但不能改变组件的内容语义和信息层级。
- **白名单默认生产**：Agent 生成的是 Schema，不是任意 JSX；缺失能力进入 proposal/experimental，不直接污染 stable registry。
- **事实由用户确认，设计由系统约束**：Agent 可诊断缺口，但不得杜撰产品数据、客户结果或品牌资产。

## 运行时组合

```jsx
<DesignSystemProvider theme="yuantai" styleProfile="technical-structured">
  <PageSchemaRenderer page={page} />
</DesignSystemProvider>
```

当前 v0.5 的 `ThemeProvider` 仍可继续使用；`DesignSystemProvider` 是下一阶段的兼容扩展，不要求一次迁移所有页面。

## 组件状态

- `proposal`：候选组件，不进入默认推荐。
- `experimental`：通过自动检查，可用于实验页。
- `stable`：通过至少两个页面场景、两个主题/Profile 和一次真实项目验证。
- `deprecated`：保留兼容，不再推荐新页面使用。

## 推荐实施顺序

1. 用本目录的 Schema 生成一个完整真实手册。
2. 给核心组件补 `contentModel/pageRoles/minItems/maxItems/conflictsWith/status`。
3. 增加 Style Profile 与 `DesignSystemProvider`。
4. 将页面任务映射到模板和组件候选集。
5. 将高分页面沉淀为模板，低分页面只作为反例。
