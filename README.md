### 安装依赖

```bash
npm install
```

### 运行

```bash
npm run dev
```

### 接口列表

目前仅对 `最大资源站` 做了接入，日后再考虑其他站点

- http://127.0.0.1:3000/search `get`

| 参数 | 类型   | 默认值  | 必填  | 说明       |
| ---- | ------ | ------- | ----- | ---------- |
| o    | string | zuidazy | false | 采集源     |
| q    | string | 无      | true  | 搜索关键字 |

- http://127.0.0.1:3000/collection `get`

| 参数 | 类型   | 默认值  | 必填  | 说明        |
| ---- | ------ | ------- | ----- | ----------- |
| o    | string | zuidazy | false | 采集源      |
| m    | string | 无      | true  | 采集资源 id |
