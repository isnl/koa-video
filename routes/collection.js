const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const request = require("request");
const router = require("koa-router")();
const { BASE_URL, BASE_CONSTANCE, NOT_FOUNT_MESSAGE } = require("../config");
router.prefix("/collection");

/**
 * 采集
 */
router.get("/", async function (ctx, next) {
  const { m, o = BASE_CONSTANCE.zuidazy } = ctx.query;
  if (!m) {
    ctx.body = {
      message: "参数不合法",
      status: false
    };
    return;
  }
  try {
    //判断当前采集对象是否已经存在
    let noSuffix = m.replace(".html", "");
    const url = path.resolve(__dirname, `../views/${o}/json/${noSuffix}.json`);
    const exist = await fs.existsSync(url);
    if (exist) {
      ctx.body = {
        status: false,
        message: "当前资源已存在，请勿重复采集"
      };
      return;
    }
    // 写入详情.json文件
    const data = await getDetailsByUrl(m, o);
    await fs.writeFileSync(
      path.resolve(__dirname, `../views/${o}/json/${noSuffix}.json`),
      JSON.stringify(data),
      "utf-8"
    );
    //将当前Id和name写入list.json文件
    const listPath = path.resolve(__dirname, `../views/${o}/list.json`);
    const listData = JSON.parse(await fs.readFileSync(listPath, "utf-8"));
    let existObj = listData.some(
      item => item.id === m && item.name === data.name
    );
    //判断list.json中有无
    if (!existObj) {
      listData.push({
        id: m,
        name: data.name
      });
      await fs.writeFileSync(listPath, JSON.stringify(listData));
    }
    //采集成功后直接跳转至详情页面
    ctx.body = {
      status: true,
      message: "采集成功"
    };
  } catch (error) {
    ctx.body = {
      message: error.message,
      status: false
    };
  }
});

/**
 * 更新采集
 */
router.get("/update", async function (ctx, next) {
  const { m, o = BASE_CONSTANCE.zuidazy } = ctx.query;
  if (!m) {
    ctx.body = {
      message: "参数不合法",
      status: false
    };
    return;
  }
  try {
    // 写入详情.json文件
    const data = await getDetailsByUrl(m, o);
    //判断当前采集对象是否已经存在
    let noSuffix = m.replace(".html", "");
    const url = path.resolve(__dirname, `../views/${o}/json/${noSuffix}.json`);
    const exist = await fs.existsSync(url);
    if (exist) {
      const oldData = await fs.readFileSync(url, "utf-8");
      if (JSON.stringify(data) === oldData) {
        ctx.body = {
          message: "暂无更新",
          status: false
        };
        return;
      }
    }

    await fs.writeFileSync(
      path.resolve(__dirname, `../views/${o}/json/${noSuffix}.json`),
      JSON.stringify(data),
      "utf-8"
    );
    //将当前Id和name写入list.json文件
    const listPath = path.resolve(__dirname, `../views/${o}/list.json`);
    const listData = JSON.parse(await fs.readFileSync(listPath, "utf-8"));
    let existObj = listData.some(
      item => item.id === m && item.name === data.name
    );
    //判断list.json中有无
    if (!existObj) {
      listData.push({
        id: m,
        name: data.name
      });
      await fs.writeFileSync(listPath, JSON.stringify(listData));
    }
    //采集成功后直接跳转至详情页面
    ctx.body = {
      status: true,
      message: "采集成功"
    };
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
      const bodyText = $jQ("body").text().trim();
      if (NOT_FOUNT_MESSAGE[o].includes(bodyText)) {
        reject(new Error("参数错误,请检查"));
      }
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
        .eq(0)
        .find("li")
        .each((j, s) => {
          const [grade, url] = $jQ(s).text().split("$");
          playInfo.push({
            grade,
            url
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
