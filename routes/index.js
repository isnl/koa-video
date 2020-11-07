const router = require("koa-router")();
const { BASE_CONSTANCE } = require("../config");
const path = require("path");

//根据影视网站的类型不同  匹配views文件夹中不同类型的对应文件
Object.keys(BASE_CONSTANCE).map(key => {
  router.get(`/${key}/:id`, async (ctx, next) => {
    const id = ctx.params.id.includes(".html")
      ? ctx.params.id.replace(".html", "")
      : ctx.params.id;
    try {
      const data = await require(path.resolve(
        __dirname,
        `../views/zuidazy/json/${id}.json`
      ));
      await ctx.render("zuidazy/template.html", data);
    } catch (error) {
      // 404页面
      await ctx.render("404.html");
    }
  });
});

module.exports = router;
