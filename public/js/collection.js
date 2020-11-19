$(".collection-btn").click(function () {
  const m = $(this).attr("data-src");
  $.get(`/collection?o=zuidazy&m=${m}`, function (res) {
    if (res.status) {
      layer.msg("采集成功，即将跳转至播放页", function () {
        location.href = `/zuidazy/${m}`;
      });
    }
  });
});
