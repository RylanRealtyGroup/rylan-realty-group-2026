(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    document.addEventListener("click", (e) => {
      const clickedInside = nav.contains(e.target) || toggle.contains(e.target);
      if (!clickedInside) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  const form = document.getElementById("contactForm");
  const status = document.getElementById("form-status");

  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : "Send Message";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      status.textContent = "";
      status.className = "form-status";

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          form.reset();
          status.textContent = "Thanks! Your message has been sent. A member of Rylan Realty Group will reach out soon.";
          status.classList.add("is-visible", "is-success");
        } else {
          const data = await response.json().catch(() => null);

          if (data && data.errors && data.errors.length > 0) {
            status.textContent = data.errors.map((err) => err.message).join(" ");
          } else {
            status.textContent = "Sorry, something went wrong. Please try again.";
          }

          status.classList.add("is-visible", "is-error");
        }
      } catch (error) {
        status.textContent = "Sorry, something went wrong. Please try again.";
        status.classList.add("is-visible", "is-error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }
})();
