const router = require("koa-router")();

router.get("/index.html", async (ctx, next) => {
  await ctx.render("index.html", {});
});

module.exports = router;
