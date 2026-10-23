// Runs in <head> before paint so the saved theme never flashes. Light is the default.
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  let theme = null;
  try { theme = localStorage.getItem("theme"); } catch {}
  root.dataset.theme = theme === "dark" ? "dark" : "light";
})();
