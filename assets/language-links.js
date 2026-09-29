// Preserve the current section when following the equivalent language page.
document.querySelectorAll("a[data-locale-link]").forEach(link => {
  const base = link.getAttribute("href");
  const update = () => { link.href = base + window.location.hash; };
  update();
  link.addEventListener("click", update);
  window.addEventListener("hashchange", update);
});
