var copyText = function (text, callback) {
  // text: 要复制的内容， callback: 回调
  let tag = document.createElement("textarea");
  tag.setAttribute("id", "cp_hgz_input");
  tag.value = text;
  document.getElementsByTagName("body")[0].appendChild(tag);
  document.getElementById("cp_hgz_input").select();
  document.execCommand("copy");
  document.getElementById("cp_hgz_input").remove();
  if (callback) {
    callback(text);
  }
};
$(function () {
  //获取邮箱
  $(".get-email").click(() => {
    layer.msg("htmlcs@163.com");
  });
  //搜索
  $(".search-btn").click(() => {
    const q = $(".search-input").val();
    console.log("q", q);
    window.location.href = `/search?q=${q}`;
  });
});
