$(function () {
  //切换播放
  $(".play-list-box")
    .children("button")
    .on("click", function () {
      console.log($(this).text());
    });

  //复制下载链接
});
