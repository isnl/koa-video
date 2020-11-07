$(function () {
  const $btn = $(".play-list-box").children("button");
  const [name, source] = $btn.eq(0).attr("data-src").split("$");
  //默认激活第一个按钮
  $btn.eq(0).addClass("active");
  new Aliplayer(
    {
      id: "video-play",
      source,
      width: "100%",
      height: "460px",
      autoplay: true,
      isLive: false,
      rePlay: false,
      playsinline: true,
      preload: true,
      controlBarVisibility: "click",
      useH5Prism: true
    },
    function (player) {
      initEvent(player);
    }
  );
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
      const [name, src] = $(item).children(".text").text().split("$");
      index === $(".download-list li").length - 1
        ? (str += `${name}$${src}`)
        : (str += `${name}$${src}\n`);
    });
    str += `\n---哎呦影视采集:https://v.iiter.cn`;
    copyText(str, () => {
      layer.msg("复制成功");
    });
  });
  //复制所有链接
  $(".copy-all-link").click(function () {
    let str = ``;
    $(".download-list li").each((index, item) => {
      const [name, src] = $(item).children(".text").text().split("$");
      index === $(".download-list li").length - 1
        ? (str += `${src}`)
        : (str += `${src}\n`);
    });
    str += `\n---哎呦影视采集:https://v.iiter.cn`;
    copyText(str, () => {
      layer.msg("复制成功");
    });
  });
}
