const cheerio = require("cheerio");
const request = require("request");
const router = require("koa-router")();
const { BASE_URL, SENSITIVE_WORDS } = require("../config");
router.prefix("/search");

/**
 * 根据关键字搜索  后面考虑不返回各大影视的擦边球类型的结果
 */
router.get("/", async function (ctx, next) {
  let originUrl; //源站
  if ("o" in ctx.query) {
    originUrl = BASE_URL[ctx.query.o];
  }
  if (!originUrl) {
    originUrl = BASE_URL.zuidazy; // 默认源站为最大资源网
  }
  let keyword;
  if ("q" in ctx.query) {
    keyword = ctx.query.q;
  }
  if (!keyword) {
    ctx.body = {
      message: "参数不合法",
      status: false
    };
    return;
  }
  try {
    const data = await getSearchResult(keyword, originUrl);
    console.log("data", data);
    await ctx.render("search.html", { list: data });
  } catch (error) {
    ctx.body = {
      message: error.message,
      status: false
    };
  }
});

/**
 * 获取搜索结果
 */
function getSearchResult(keyword, url) {
  const options = {
    method: "POST",
    url: `${url}/index.php?m=vod-search`,
    formData: {
      wd: keyword,
      submit: "search"
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (err, res) {
      if (err) reject(err);
      const $ = cheerio.load(res.body);
      let urlArray = [];
      $(".xing_vb ul").each((index, item) => {
        //将此页面中的所有链接url获取出来
        const $li = $(item).children("li");
        const aLink = $li.find(".xing_vb4 a");
        const type = $li.find(".xing_vb5").text();
        if (
          index !== 0 &&
          index !== $(".xing_vb ul").length - 1 &&
          !SENSITIVE_WORDS.includes(type)
        ) {
          urlArray.push({
            name: aLink.text(),
            url: aLink.attr("href")
          });
        }
      });
      resolve(urlArray);
    });
  });
}

module.exports = router;
