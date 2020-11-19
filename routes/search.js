const cheerio = require("cheerio");
const request = require("request");
const router = require("koa-router")();
const path = require("path");
const fs = require("fs");
const { BASE_URL, SENSITIVE_WORDS } = require("../config");
router.prefix("/search");

/**
 * 根据关键字搜索  后面考虑不返回各大影视的擦边球类型的结果
 */
router.get("/", async function (ctx, next) {
  let origin, originUrl; //源站
  if ("o" in ctx.query) {
    origin = ctx.query.o;
    if (!Object.keys(BASE_URL).includes(origin)) {
      error(ctx);
      return;
    }
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
    error(ctx);
    return;
  }
  try {
    //先获取爬虫得到的数据，再取出本地的数据，用爬虫得到的数据比对本地的数据，优先展示采集过的数据
    const data = await getSearchResult(keyword, originUrl);
    const listPath = path.resolve(__dirname, `../views/${origin}/list.json`);
    const listData = JSON.parse(await fs.readFileSync(listPath, "utf-8"));
    let existArray = [];
    let noExistArray = [];
    data.forEach(item => {
      let equal = false;
      listData.forEach(d => {
        if (d.id === item.id) {
          equal = true;
        }
      });
      if (equal) {
        item.status = true;
        existArray.push(item);
      } else {
        item.status = false;
        noExistArray.push(item);
      }
    });
    await ctx.render("search.html", {
      list: [...existArray, ...noExistArray],
      keyword
    });
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
            id: aLink.attr("href").replace("/?m=", "")
          });
        }
      });
      resolve(urlArray);
    });
  });
}
/**
 * 统一出错处理
 */
function error(context) {
  context.body = {
    status: false,
    message: "参数不合法"
  };
}

module.exports = router;
