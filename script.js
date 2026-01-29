// CHANGE THIS if needed:
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxlfBXRl00eqURE_mmR5ti-Ak3kwMt106T2dtSwmKzPgRA9mkm5wuQDfHUKzP4U5M4I/exec";

// Footer year
document.getElementById("year").textContent = String(new Date().getFullYear());

// Scroll reveal
const els = Array.from(document.querySelectorAll("[data-reveal]"));
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add("reveal-in");
  },
  { threshold: 0.15 }
);
els.forEach((el) => io.observe(el));

// Follower pills
const form = document.getElementById("applyForm");
const statusEl = document.getElementById("formStatus");
const followersHidden = form.querySelector('input[name="followers"]');
const pillButtons = Array.from(form.querySelectorAll(".app-pill"));

pillButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    pillButtons.forEach((b) => b.classList.remove("app-pill-active"));
    btn.classList.add("app-pill-active");
    followersHidden.value = btn.getAttribute("data-followers") || "20k / 50k";
  });
});

// Form submit (works with Apps Script using no-cors)
// NOTE: with no-cors, we can't read the response, so we show "Submitted" after fetch completes.
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Submitting...";

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    statusEl.textContent = "✅ Application received. We’ll review it and get back to you.";
    form.reset();
    followersHidden.value = "20k / 50k";
    pillButtons.forEach((b) => b.classList.remove("app-pill-active"));
    pillButtons[0].classList.add("app-pill-active");
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Error submitting. Try again.";
  }
});
