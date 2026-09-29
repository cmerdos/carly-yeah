// Choose the equivalent static page and preserve manual language preferences.
(() => {
  const links = [...document.querySelectorAll("a[data-locale-link]")];
  if (!links.length) return;
  const current = new URL(window.location.href);
  const storageKey = "carlyYeahLanguage";
  const valid = value => value === "es" || value === "en";
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch {}
  // Used only when browser storage is unavailable during a manual switch.
  const explicit = current.searchParams.get("lang");
  const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  const preferred = valid(explicit) ? explicit : valid(saved) ? saved : /^es(?:-|$)/i.test(browserLanguage) ? "es" : "en";

  links.forEach(link => {
    const base = link.getAttribute("href");
    const update = () => {
      const url = new URL(base, window.location.href);
      url.search = window.location.search;
      url.searchParams.delete("lang");
      url.hash = window.location.hash;
      link.href = url.href;
    };
    update();
    link.addEventListener("click", () => {
      update();
      const language = link.getAttribute("hreflang");
      try {
        localStorage.setItem(storageKey, language);
      } catch {
        const url = new URL(link.href);
        url.searchParams.set("lang", language);
        link.href = url.href;
      }
    });
    window.addEventListener("hashchange", update);
  });

  const pageLanguage = document.documentElement.lang.toLowerCase().split("-")[0];
  if (pageLanguage === preferred) return;
  const target = links.find(link => link.getAttribute("hreflang") === preferred);
  if (!target) return;
  const destination = new URL(target.href);
  if (valid(explicit)) destination.searchParams.set("lang", explicit);
  if (destination.origin === current.origin && destination.pathname !== current.pathname) {
    window.location.replace(destination.href);
  }
})();
