# 石墨文档导出 csv

## Usage

填写配置文件

```shell
cp config.example.js config.js
```

```js
export const config = {
    Cookie: '', // 从浏览器中获取石墨文档的 Cookie
    Path: 'files', // 存放导出文档的位置
};
```

> 获取石墨文档 Cookie：按 `F12` 打开开发者工具，转到 `Network` 标签页后刷新网页，打开第一个html请求，复制 `Request Headers` 中的 `Cookie` 项即可

安装依赖

```shell
yarn # or npm install
```

运行

```shell
node -r esm test.js
```

## 依赖

```
node ^8.0.0
```
