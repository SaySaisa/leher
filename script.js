/* LEHER – interactions. Wrapped so nothing leaks into the global scope. */
(function () {
  'use strict';

  /* 1. Mobile menu toggle */
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function () { menu.classList.remove('open'); });

  /* 2. Reveal-on-scroll (IntersectionObserver) */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('show'); });
  }

  /* 3. Gallery lightbox: tap a photo to enlarge, tap anywhere to close */
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('img');
  document.querySelectorAll('.g img').forEach(function (img) {
    img.addEventListener('click', function () { boxImg.src = img.src; box.hidden = false; });
  });
  box.addEventListener('click', function () { box.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.hidden = true; });

  /* 4. Music player (works when audio/song.mp3 exists) */
  var audio = document.getElementById('audio');
  var play = document.getElementById('play');
  var fill = document.getElementById('fill');
  var cur = document.getElementById('cur');
  var dur = document.getElementById('dur');
  var hint = document.getElementById('hint');
  var bar = document.querySelector('.bar');

  function fmt(s) {
    if (!isFinite(s)) return '0:00';
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  audio.addEventListener('error', function () { hint.textContent = 'Add your song as audio/song.mp3 to play it.'; });
  audio.addEventListener('loadedmetadata', function () { dur.textContent = fmt(audio.duration); hint.textContent = ''; });
  audio.addEventListener('timeupdate', function () {
    cur.textContent = fmt(audio.currentTime);
    fill.style.width = (audio.duration ? audio.currentTime / audio.duration * 100 : 0) + '%';
  });
  audio.addEventListener('ended', function () { play.innerHTML = '&#9654;'; });
  play.addEventListener('click', function () {
    if (audio.error) { hint.textContent = 'Add your song as audio/song.mp3 to play it.'; return; }
    if (audio.paused) { audio.play(); play.innerHTML = '&#10074;&#10074;'; }
    else { audio.pause(); play.innerHTML = '&#9654;'; }
  });
  document.getElementById('prev').addEventListener('click', function () { audio.currentTime = 0; });
  document.getElementById('next').addEventListener('click', function () { audio.currentTime += 10; });
  bar.addEventListener('click', function (e) {
    var r = bar.getBoundingClientRect();
    if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
  });
})();
