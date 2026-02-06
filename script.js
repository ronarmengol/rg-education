/*
 * School Management System Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Header State
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  // Create a close button for mobile menu if needed, or just toggle
  // Adding close capability
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      // Toggle icon between hamburger and close (simple text switch for now)
      const icon = mobileToggle.querySelector("i");
      if (mobileMenu.classList.contains("active")) {
        // Assuming FontAwesome usage, or generic svg
        // Just toggling aria-expanded logic
        mobileToggle.setAttribute("aria-expanded", "true");
      } else {
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Close mobile menu when clicking a link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });

  // 3. Smooth Scroll for Anchor Links (polishing default behavior)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header.offsetHeight;
        const elementPosition =
          target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 4. Scroll Reveal Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = document.querySelectorAll(
    ".fade-up, .feature-card, .timeline-item",
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });

  // Add 'active' class rules via JS injection or assume CSS handles it
  // Ideally CSS should handle .active, let's inject a quick style rule just in case styles.css missed the specific utility
  // But better to just set style directly since I'm already looping

  // Modify observer to actually set styles
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => revealObserver.observe(el));

  // 5. Form Handling (Mock)
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      // Loading state
      btn.innerHTML = "Sending...";
      btn.disabled = true;
      btn.style.opacity = "0.7";

      // Simulate API call
      setTimeout(() => {
        btn.innerHTML = "✔ Message Sent!";
        btn.style.backgroundColor = "#10b981"; // Success green
        btn.style.borderColor = "#10b981";

        // Reset form
        form.reset();

        // Revert button after 3 seconds
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.style.backgroundColor = ""; // Revert to CSS
          btn.style.borderColor = "";
        }, 3000);
      }, 1500);
    });
  });
});
