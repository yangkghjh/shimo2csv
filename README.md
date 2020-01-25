# 石墨文档导出 csv

## Usage

填写配置文件

```shell
cp config.example.js config.js
```

```js
export const config = {
    Cookie: 'xxx', // 从浏览器中获取石墨文档的 Cookie
    Path: 'files', // 存放导出文档的位置
};
```

安装依赖

```shell
yarn # or npm install
```

运行

```shell
node index.js
```

## 依赖

```
node ^13
```
