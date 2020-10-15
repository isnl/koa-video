const router = require("koa-router")();
const { BASE_CONSTANCE } = require("../config");

router.get(`/:id`, async (ctx, next) => {
  await ctx.render(ctx.params.id, {});
});

//根据影视网站的类型不同  匹配views文件夹中不同类型的对应文件
Object.keys(BASE_CONSTANCE).map(key => {
  router.get(`/${key}/:id`, async (ctx, next) => {
    await ctx.render(ctx.params.id, {});
  });
});

module.exports = router;
