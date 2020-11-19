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
function search() {
  const q = $(".search-input").val();
  if (q === "") return;
  window.location.href = `/search?o=zuidazy&q=${q}`;
}
$(function () {
  //获取邮箱
  $(".get-email").click(() => {
    layer.msg("htmlcs@163.com");
  });
  //搜索
  $(".search-btn").click(() => {
    search();
  });
  //按回车键搜索
  $(".search-input").on("keyup", e => {
    if (e.keyCode && e.keyCode === 13) search();
  });
});
