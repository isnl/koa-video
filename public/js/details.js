$(function () {
  const $btn = $(".play-list-box").children("button");
  const [name, url] = $btn.eq(0).attr("data-src").split("$");
  //默认激活第一个按钮
  $btn.eq(0).addClass("active");
  const element = document.getElementById("dplayer");
  const dp = new DPlayer({
    element,
    video: {
      url,
      type: "hls"
    }
  });
  dp.on("ended", function () {
    //一集播放完了
  });
  dp.on("loadeddata", function () {
    //一集播放完了
    initEvent();
  });
});
function initEvent(player) {
  //切换播放
  $(".play-list-box")
    .children("button")
    .on("click", function () {
      const [name, src] = $(this).attr("data-src").split("$");
      player.loadByUrl(src);
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
    });

  //复制下载链接
  $(".copy-one-link").on("click", function () {
    const [name, src] = $(this).prev().text().split("$");
    copyText(src, () => {
      layer.msg("复制成功");
    });
  });
  //复制名称+下载链接
  $(".copy-one-all").on("click", function () {
    const text = $(this).prev().prev().text();
    copyText(text, () => {
      layer.msg("复制成功");
    });
  });

  //复制所有名称+链接
  $(".copy-all").click(function () {
    let str = ``;
    $(".download-list li").each((index, item) => {
      const [name, src] = $(item).children(".text-muted").text().split("$");
      index === $(".download-list li").length - 1
        ? (str += `${name}$${src}`)
        : (str += `${name}$${src}\n`);
    });
    str += `\n---艾特影视资源网:https://v.iiter.cn`;
    copyText(str, () => {
      layer.msg("复制成功");
    });
  });
  //复制所有链接
  $(".copy-all-link").click(function () {
    let str = ``;
    $(".download-list li").each((index, item) => {
      const [name, src] = $(item).children(".text-muted").text().split("$");
      index === $(".download-list li").length - 1
        ? (str += `${src}`)
        : (str += `${src}\n`);
    });
    str += `\n---艾特影视资源网:https://v.iiter.cn`;
    copyText(str, () => {
      layer.msg("复制成功");
    });
  });
}
