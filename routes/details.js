const cheerio = require("cheerio");
const request = require("request");
const router = require("koa-router")();
const { BASE_URL, BASE_CONSTANCE } = require("../config");
router.prefix("/details");

/**
 * 资源详情
 */
router.get("/", async function (ctx, next) {
  // console.log("params", ctx.params);
  const { m, o = BASE_CONSTANCE.zuidazy } = ctx.query;
  if (!m) {
    ctx.body = {
      message: "参数不合法",
      status: false
    };
    return;
  }
  try {
    ctx.body = await getDetailsByUrl(m, o);
    // console.log({ m, o });
  } catch (error) {
    ctx.body = {
      message: error.message,
      status: false
    };
  }
});
function getDetailsByUrl(m, o) {
  return new Promise((resolve, reject) => {
    request(`${BASE_URL[o]}/?m=${m}`, (err, res) => {
      if (err) {
        reject(err);
      }
      const $jQ = cheerio.load(res.body);
      //将当前项写入数据库
      let imagePic = $jQ(".vodImg img").attr("src"); //缩略图   有问题
      let name = $jQ(".vodh h2").text(); //名称
      let playGrade = $jQ(".vodh span").text(); //播放等级
      let score = $jQ(".vodh label").text(); //评分
      const getText = i => {
        const $vodInfo = $jQ(".vodinfobox").children("ul").children("li");
        return $vodInfo.eq(i).find("span").text();
      };
      let otherName = getText(0); //别名
      let daoyan = getText(1); //导演
      let zhuyan = getText(2); //主演
      let type = getText(3); //类型
      let place = getText(4); //地区
      let language = getText(5); //语言
      let showTime = getText(6); //上线时间
      let updateTime = getText(8); //更新时间
      let introduce = $jQ(".playBox").eq(0).children(".vodplayinfo").text(); //剧情介绍
      let playInfo = []; //播放链接
      $jQ(".playBox")
        .eq(1)
        .children(".vodplayinfo")
        .children("div")
        .children()
        .each((i, k) => {
          let list = [];
          $jQ(k)
            .find("li")
            .each((j, s) => {
              const [grade, url] = $jQ(s).text().split("$");
              list.push({
                grade,
                url
              });
            });
          playInfo.push({
            type: (() => {
              const spanText = $jQ(k)
                .children("h3")
                .find("span")
                .text()
                .substring(5);
              if (spanText == "ll") {
                return "all";
              } else {
                return spanText;
              }
            })(),
            list
          });
        });
      let downloadInfo = []; //下载链接
      $jQ(".playBox")
        .eq(2)
        .find("li")
        .each((j, s) => {
          downloadInfo.push({
            grade: $jQ(s).text().split("$")[0],
            url: $jQ(s).text().split("$")[1]
          });
        });
      resolve({
        imagePic,
        name,
        playGrade,
        score,
        otherName,
        daoyan,
        zhuyan,
        type,
        place,
        language,
        showTime,
        updateTime,
        introduce,
        playInfo,
        downloadInfo
      });
    });
  });
}
module.exports = router;
