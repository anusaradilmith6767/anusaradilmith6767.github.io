(function () {
  var $ = function (s) { return document.querySelector(s); };
  var burger = $('#burger'), links = $('#links');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  var toast = $('#toast');
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  $('#copy').addEventListener('click', function () {
    var email = 'anusaradilmith60@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(function () { say('Email copied'); }, function () { say(email); });
    } else { say(email); }
  });

  $('#yr').textContent = new Date().getFullYear();

  var items = document.querySelectorAll('.story, .stat, .cost-card, .card, .prog-grid figure, .relay, .sg-hero');
  if ('IntersectionObserver' in window) {
    items.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }
})();

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };

  /* scroll progress */
  var bar = $('#pbar');
  function prog() {
    var h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }
  window.addEventListener('scroll', prog, { passive: true }); prog();

  /* hero glow follows pointer */
  var hero = $('.hero');
  hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* typewriter */
  var words = ['SeaGuard, an SOS beacon', 'apps in Python and C#', 'databases in SQL', 'clean interfaces in Figma', 'things that help people'];
  var el = $('#role'), wi = 0, ci = 0, del = false;
  function type() {
    var w = words[wi];
    el.textContent = w.slice(0, ci);
    if (!del && ci === w.length) { del = true; return setTimeout(type, 1600); }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    ci += del ? -1 : 1;
    setTimeout(type, del ? 28 : 55);
  }
  if (reduce) { el.textContent = words[0]; } else { type(); }

  /* SOS relay animation */
  var viz = $('#viz'), arcs = viz.querySelectorAll('.arc'), nodes = viz.querySelectorAll('.node');
  var status = $('#vizStatus'), timers = [], loopT;
  var msgs = ['SOS pressed. The boat sends its GPS position over LoRa.', 'Relay 1 picks it up and passes it on.', 'Relay 2 passes it on.', 'Relay 3 passes it on.', 'Shore station has it. The Coast Guard is alerted.'];
  function clear() { timers.forEach(clearTimeout); clearTimeout(loopT); arcs.forEach(function (a) { a.classList.remove('on'); }); nodes.forEach(function (n) { n.classList.remove('on'); }); }
  function run() {
    clear();
    nodes.forEach(function (n, i) {
      timers.push(setTimeout(function () {
        n.classList.add('on');
        if (arcs[i]) arcs[i].classList.add('on');
        status.textContent = msgs[i];
      }, 400 + i * 900));
    });
    if (!reduce) loopT = setTimeout(run, 400 + nodes.length * 900 + 4500);
  }
  if (reduce) { arcs.forEach(function (a) { a.classList.add('on'); }); nodes.forEach(function (n) { n.classList.add('on'); }); }
  else { setTimeout(run, 800); }
  $('#sos').addEventListener('click', run);

  /* count-up */
  var counts = document.querySelectorAll('[data-count]');
  function fmt(n) { return n.toLocaleString('en-US'); }
  function animate(c) {
    var end = +c.dataset.count, pre = c.dataset.prefix || '', suf = c.dataset.suffix || '', t0 = null;
    if (reduce) return;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - k, 3);
      c.textContent = pre + fmt(Math.round(end * e)) + suf;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counts.forEach(function (c) { cio.observe(c); });
  }

  /* equaliser bars */
  var eq = $('#eq');
  for (var i = 0; i < 18; i++) {
    var b = document.createElement('i');
    b.style.setProperty('--h', (35 + Math.random() * 65) + '%');
    b.style.animationDuration = (0.5 + Math.random() * 0.8) + 's';
    b.style.animationDelay = (-Math.random()) + 's';
    eq.appendChild(b);
  }

  /* card tilt */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(700px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
  }
})();
