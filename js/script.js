(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

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
      a.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("click", (e) => {
      const clickedInside = nav.contains(e.target) || toggle.contains(e.target);
      if (!clickedInside) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeNav();
      }
    });
  }

  const form = document.getElementById("contactForm");
  const status = document.getElementById("form-status");
  const submitButton = document.getElementById("contactSubmit");

  window.turnstileSuccess = function () {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Send message";
    }

    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }
  };

  window.turnstileExpired = function () {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Verify to Send";
    }
  };

  window.turnstileError = function () {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Verify to Send";
    }

    if (status) {
      status.textContent = "Captcha could not load. Please refresh the page and try again.";
      status.className = "form-status is-visible is-error";
    }
  };

  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = form.querySelector('input[name="cf-turnstile-response"]');
      if (!token || !token.value) {
        status.textContent = "Please complete the captcha before sending your message.";
        status.className = "form-status is-visible is-error";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Verify to Send";
        }

        return;
      }

      const originalText = submitButton ? submitButton.textContent : "Send message";

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
          status.textContent = "Thanks! Your message has been sent. A member of Rylan Realty Group will reach out soon.";
          status.className = "form-status is-visible is-success";

          if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Message Sent";
          }

          setTimeout(() => {
            form.reset();

            if (typeof turnstile !== "undefined") {
              turnstile.reset();
            }

            if (submitButton) {
              submitButton.disabled = true;
              submitButton.textContent = "Verify to Send";
            }
          }, 4000);
        } else {
          const data = await response.json().catch(() => null);

          if (data && data.errors && data.errors.length > 0) {
            status.textContent = data.errors.map((err) => err.message).join(" ");
          } else {
            status.textContent = "Sorry, something went wrong. Please try again.";
          }

          status.className = "form-status is-visible is-error";

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
          }
        }
      } catch (error) {
        status.textContent = "Sorry, something went wrong. Please try again.";
        status.className = "form-status is-visible is-error";

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }
})();
