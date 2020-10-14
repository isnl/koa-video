const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const Swig = require("koa-swig"); // 1. 引入模块 swig
const co = require("co");

const index = require("./routes/index");
const search = require("./routes/search");
const details = require("./routes/details");
const collection = require("./routes/collection");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(search.routes(), search.allowedMethods());
app.use(details.routes(), details.allowedMethods());
app.use(collection.routes(), collection.allowedMethods());


app.context.render = co.wrap(
  Swig({
    // 2. 配置
    root: __dirname + "/views", // 视图文件路径
    autoescape: true, // false:解析模板数据中的html
    cache: false, // 'memory':请用缓存，避免每次刷新页面都去解析模板
    ext: "html"
  })
);

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
