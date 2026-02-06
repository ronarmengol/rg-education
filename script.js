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

// Hero Particle Animation System
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles");
  if (!canvas) return; // Exit if no canvas found

  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Track mouse for interactive effect
  document.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = this.getRandomColor();
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
      const colors = [
        "59, 130, 246", // Blue
        "139, 92, 246", // Purple
        "6, 182, 212", // Cyan
        "236, 72, 153", // Pink
        "255, 255, 255", // White
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Pulse effect
      this.pulsePhase += this.pulseSpeed;
      const pulse = Math.sin(this.pulsePhase) * 0.3 + 0.7;

      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150) {
        const force = (150 - distance) / 150;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      return pulse;
    }

    draw(pulse) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity * pulse})`;
      ctx.fill();

      // Glow effect for larger particles
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.1 * pulse})`;
        ctx.fill();
      }
    }
  }

  // Create particles
  const particleCount = 80;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Connect nearby particles with lines
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection lines first
    connectParticles();

    // Update and draw particles
    particles.forEach((particle) => {
      const pulse = particle.update();
      particle.draw(pulse);
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Add shooting stars occasionally
  function createShootingStar() {
    // Check if hero exists to append to, otherwise fallback to body
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const star = document.createElement("div");
    star.style.cssText = `
      position: absolute;
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
      top: ${Math.random() * 100}%;
      left: -100px;
      z-index: 1;
      transform: rotate(${15 + Math.random() * 10}deg);
      animation: shootingStar 1s linear forwards;
      pointer-events: none;
    `;

    hero.appendChild(star);

    setTimeout(() => star.remove(), 1000);
  }

  // Create shooting star style if not exists
  if (!document.getElementById("shooting-star-style")) {
    const style = document.createElement("style");
    style.id = "shooting-star-style";
    style.textContent = `
      @keyframes shootingStar {
        0% { transform: translateX(0) rotate(15deg); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateX(calc(100vw + 200px)) rotate(15deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Trigger shooting stars randomly
  setInterval(() => {
    if (Math.random() > 0.7) {
      createShootingStar();
    }
  }, 3000);
});
