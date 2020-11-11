$(".collection-btn").click(function () {
  const m = $(this).attr("data-src");
  $.get(`/collection?o=zuidazy&m=${m}`).then(res => {
    if (res.status) {
      location.href = `/zuidazy/${m}`;
    }
  });
});
