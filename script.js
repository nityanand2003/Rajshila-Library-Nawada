document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  var LIBRARY_WHATSAPP_NUMBER = '918340751940'; // country code 91 + the library's number, no spaces or symbols

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Count-up numbers in the hero trust row ---------- */
  var countEls = document.querySelectorAll('[data-countup]');
  function runCountUp(el) {
    var target = parseInt(el.getAttribute('data-countup'), 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    var start = 0;
    var duration = 900;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(start + (target - start) * progress);
      el.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    window.requestAnimationFrame(step);
  }
  countEls.forEach(function (el) {
    window.setTimeout(function () { runCountUp(el); }, 300);
  });

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg && lightboxClose) {
    document.querySelectorAll('.gallery-item:not(.placeholder) img').forEach(function (img) {
      img.addEventListener('click', function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('show');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('show');
      lightboxImg.src = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- Enquiry form -> WhatsApp ---------- */
  var form = document.getElementById('enquiryForm');
  if (!form) return;

  var nameInput = document.getElementById('fName');
  var phoneInput = document.getElementById('fPhone');
  var shiftSelect = document.getElementById('fShift');
  var messageInput = document.getElementById('fMessage');
  var errName = document.getElementById('errName');
  var errPhone = document.getElementById('errPhone');
  var formNote = document.getElementById('formNote');

  function validatePhone(value) {
    var digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length === 10;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var shift = shiftSelect.value;
    var message = messageInput.value.trim();

    var valid = true;
    errName.textContent = '';
    errPhone.textContent = '';
    formNote.textContent = '';

    if (!name) {
      errName.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!phone) {
      errPhone.textContent = 'Please enter your phone number.';
      valid = false;
    } else if (!validatePhone(phone)) {
      errPhone.textContent = 'Please enter a valid 10-digit number.';
      valid = false;
    }

    if (!valid) return;

    var lines = [
      'Hello, I would like to enquire about Rajshila Library.',
      'Name: ' + name,
      'Phone: ' + phone,
      'Interested shift: ' + shift
    ];
    if (message) lines.push('Message: ' + message);

    var text = encodeURIComponent(lines.join('\n'));
    var url = 'https://wa.me/' + LIBRARY_WHATSAPP_NUMBER + '?text=' + text;

    window.open(url, '_blank', 'noopener');

    formNote.style.color = 'var(--green)';
    formNote.textContent = 'Opening WhatsApp with your message ready to send.';
  });
});