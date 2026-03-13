/* ============================================
   H N Power Solutions - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // 1. MOBILE MENU TOGGLE
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav__list');
  const overlay = document.querySelector('.mobile-overlay');

  function openMenu() {
    hamburger.classList.add('hamburger--active');
    navList.classList.add('nav__list--open');
    overlay.classList.add('mobile-overlay--visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('hamburger--active');
    navList.classList.remove('nav__list--open');
    overlay.classList.remove('mobile-overlay--visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = navList.classList.contains('nav__list--open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu on nav link click
  document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ============================================
  // 2. STICKY HEADER SCROLL BEHAVIOR
  // ============================================
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }

  // ============================================
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // 4. FAQ ACCORDION
  // ============================================
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq__item');
      var answer = item.querySelector('.faq__answer');
      var isOpen = item.classList.contains('faq__item--open');

      // Close all other items
      document.querySelectorAll('.faq__item--open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('faq__item--open');
          openItem.querySelector('.faq__answer').style.maxHeight = null;
          openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('faq__item--open');
        answer.style.maxHeight = null;
        this.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('faq__item--open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // 5. STAT COUNTER ANIMATION
  // ============================================
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var statElements = document.querySelectorAll('[data-counter]');
  if (statElements.length > 0) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var counters = entry.target.querySelectorAll('[data-counter]');
          counters.forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    var statsSection = document.querySelector('.stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // ============================================
  // 6. PROJECT FILTER
  // ============================================
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      // Update active state
      filterBtns.forEach(function (b) { b.classList.remove('filter-btn--active'); });
      this.classList.add('filter-btn--active');

      // Filter cards
      projectCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // 7. TESTIMONIAL CAROUSEL
  // ============================================
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.testimonial-dot');
  var currentSlide = 0;
  var autoRotateInterval;

  function showSlide(index) {
    slides.forEach(function (s) { s.classList.remove('testimonial-slide--active'); });
    dots.forEach(function (d) { d.classList.remove('testimonial-dot--active'); });

    if (slides[index]) slides[index].classList.add('testimonial-slide--active');
    if (dots[index]) dots[index].classList.add('testimonial-dot--active');
    currentSlide = index;
  }

  function nextSlide() {
    var next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      resetAutoRotate();
    });
  });

  function resetAutoRotate() {
    clearInterval(autoRotateInterval);
    if (slides.length > 1) {
      autoRotateInterval = setInterval(nextSlide, 5000);
    }
  }

  if (slides.length > 1) {
    autoRotateInterval = setInterval(nextSlide, 5000);

    var carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', function () {
        clearInterval(autoRotateInterval);
      });
      carousel.addEventListener('mouseleave', function () {
        autoRotateInterval = setInterval(nextSlide, 5000);
      });
    }
  }

  // ============================================
  // 8. CONTACT FORM VALIDATION
  // ============================================
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group--error').forEach(function (g) {
        g.classList.remove('form-group--error');
      });
      contactForm.querySelectorAll('.form-input--error').forEach(function (i) {
        i.classList.remove('form-input--error');
      });

      // Validate name
      var name = contactForm.querySelector('#name');
      if (name && !name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }

      // Validate email
      var email = contactForm.querySelector('#email');
      if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }

      // Validate phone
      var phone = contactForm.querySelector('#phone');
      if (phone && !isValidPhone(phone.value)) {
        showError(phone, 'Please enter a valid 10-digit phone number');
        isValid = false;
      }

      // Validate message
      var message = contactForm.querySelector('#message');
      if (message && !message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
      }

      if (isValid) {
        // Show success message
        contactForm.style.display = 'none';
        var success = document.querySelector('.form-success');
        if (success) success.classList.add('show');
      }
    });
  }

  function showError(input, message) {
    var group = input.closest('.form-group');
    group.classList.add('form-group--error');
    input.classList.add('form-input--error');
    var errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    var cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
    return /^\d{10,12}$/.test(cleaned);
  }

  // ============================================
  // 9. SCROLL-TRIGGERED ANIMATIONS
  // ============================================
  var animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length > 0) {
    var animateObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animateObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(function (el) {
      animateObserver.observe(el);
    });
  }

  // ============================================
  // 10. BACK TO TOP BUTTON
  // ============================================
  var backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('back-to-top--visible');
      } else {
        backToTop.classList.remove('back-to-top--visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 11. LOGO CAROUSEL DOTS
  // ============================================
  var logoTrack = document.querySelector('.logo-carousel__track');
  var logoDots = document.querySelectorAll('.logo-carousel__dot');
  var totalLogos = 8; // number of unique logos
  var currentDotIndex = 0;

  if (logoTrack && logoDots.length > 0) {
    // Update dots based on animation progress
    var dotInterval = setInterval(function () {
      logoDots.forEach(function (d) { d.classList.remove('logo-carousel__dot--active'); });
      currentDotIndex = (currentDotIndex + 1) % logoDots.length;
      logoDots[currentDotIndex].classList.add('logo-carousel__dot--active');
    }, 7500); // 30s animation / 4 dots = 7.5s per dot

    logoDots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        logoDots.forEach(function (d) { d.classList.remove('logo-carousel__dot--active'); });
        dot.classList.add('logo-carousel__dot--active');
        currentDotIndex = index;

        // Jump to position in the carousel
        var slideWidth = logoTrack.scrollWidth / 2; // half because of duplicate set
        var jumpTo = (slideWidth / logoDots.length) * index;
        logoTrack.style.animation = 'none';
        logoTrack.style.transform = 'translateX(-' + jumpTo + 'px)';

        // Resume animation after a brief pause
        setTimeout(function () {
          logoTrack.style.transform = '';
          logoTrack.style.animation = '';
        }, 50);

        clearInterval(dotInterval);
        dotInterval = setInterval(function () {
          logoDots.forEach(function (d) { d.classList.remove('logo-carousel__dot--active'); });
          currentDotIndex = (currentDotIndex + 1) % logoDots.length;
          logoDots[currentDotIndex].classList.add('logo-carousel__dot--active');
        }, 7500);
      });
    });
  }

  // ============================================
  // 12. SERVICE NAV ACTIVE STATE ON SCROLL
  // ============================================
  var serviceNavLinks = document.querySelectorAll('.service-nav__link');
  var serviceSections = document.querySelectorAll('.service-detail');

  if (serviceNavLinks.length > 0 && serviceSections.length > 0) {
    window.addEventListener('scroll', function () {
      var scrollPos = window.scrollY + 200;

      serviceSections.forEach(function (section) {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
          var targetId = section.getAttribute('id');
          serviceNavLinks.forEach(function (link) {
            link.classList.remove('service-nav__link--active');
            if (link.getAttribute('href') === '#' + targetId) {
              link.classList.add('service-nav__link--active');
            }
          });
        }
      });
    }, { passive: true });
  }

});
