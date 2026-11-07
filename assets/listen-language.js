// Translate shared campaign URLs in place; never redirect or rewrite their URL.
(() => {
  const translations = JSON.parse(document.getElementById("listen-translations").textContent);
  const texts = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest("script,style")) continue;
    const source = node.textContent.trim();
    if (translations[source]) texts.push({node, original: node.textContent, source});
  }
  const attributes = [];
  document.querySelectorAll("[aria-label],[alt],meta[content]").forEach(element => {
    ["aria-label", "alt", "content"].forEach(name => {
      const source = element.getAttribute(name);
      if (translations[source]) attributes.push({element, name, source});
    });
  });
  const buttons = [...document.querySelectorAll("[data-language]")];
  function apply(language) {
    document.documentElement.lang = language;
    texts.forEach(({node, original, source}) => {
      node.textContent = language === "en" ? original.replace(source, translations[source]) : original;
    });
    attributes.forEach(({element, name, source}) => {
      element.setAttribute(name, language === "en" ? translations[source] : source);
    });
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === language)));
    const prefix = language === "en" ? "/en/" : "/";
    document.querySelector(".brand").href = prefix;
    document.querySelector(".back").href = prefix + document.body.dataset.story + "/";
  }
  let saved;
  try { saved = localStorage.getItem("carlyYeahLanguage"); } catch {}
  const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  apply(saved === "es" || saved === "en" ? saved : /^es(?:-|$)/i.test(browserLanguage) ? "es" : "en");
  buttons.forEach(button => button.addEventListener("click", () => {
    const language = button.dataset.language;
    try { localStorage.setItem("carlyYeahLanguage", language); } catch {}
    apply(language);
  }));
})();
