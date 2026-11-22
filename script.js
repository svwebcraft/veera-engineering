/* ===== Veera Engineering – behaviour ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const pages = ['home', 'products', 'about', 'contact'];
  const header = $('#header'), nav = $('#nav'), toggle = $('#menuToggle'), toast = $('#toast');
  const titles = { home: 'Veera Engineering | Mfg. Rubber and Engineering Products', products: 'Products | Veera Engineering', about: 'About Us | Veera Engineering', contact: 'Contact Us | Veera Engineering' };

  /* Hash-based tab navigation */
  function showPage() {
    const id = pages.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
    $$('.page').forEach(p => p.classList.toggle('active', p.id === id));
    $$('.nav a[data-page]').forEach(a => {
      const on = a.dataset.page === id;
      a.classList.toggle('active', on);
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    document.title = titles[id];
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    closeMenu(); observe(); onScroll();
  }

  /* Mobile menu */
  const closeMenu = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); header.classList.remove('solid'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('solid', open);
  });
  /* Close menu on any link tap (also when the link points to the current tab) */
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('resize', () => innerWidth > 900 && closeMenu());
  document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

  /* Header style + scroll progress (home hero is dark, other pages' heads are dark too) */
  function onScroll() {
    header.classList.toggle('scrolled', scrollY > 30 || nav.classList.contains('open'));
    const h = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* Reveal on scroll */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  function observe() { $$('.page.active .reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in')); }

  /* 3D tilt on cards (pointer devices only) */
  if (matchMedia('(hover:hover)').matches) {
    $$('.tilt').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
    /* Hero art parallax */
    const art = $('#heroArt');
    $('.hero').addEventListener('pointermove', e => {
      art.style.transform = `translate(${(e.clientX / innerWidth - .5) * -24}px,${(e.clientY / innerHeight - .5) * -24}px)`;
    });
  }

  /* Toast + copy buttons */
  let t;
  const say = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(t); t = setTimeout(() => toast.classList.remove('show'), 2200); };
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); say('Copied: ' + b.dataset.copy); }
    catch { say('Copy not supported – select the text instead'); }
  }));

  /* Save contact (vCard built from the company card details) */
  $('#vcard').addEventListener('click', () => {
    const v = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:Anbumani. U', 'N:U;Anbumani;;;', 'ORG:Veera Engineering',
      'TITLE:Mfg. Rubber and Engineering Products', 'TEL;TYPE=CELL:+919444148668', 'TEL;TYPE=CELL:+917448888212',
      'EMAIL:veera20engineering@gmail.com',
      'ADR;TYPE=WORK:;;No.107A\\, Diary Road\\, Sidco Industrial Estate\\, Pattaravakkam;Ambattur\\, Chennai;;600098;India', 'END:VCARD'].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([v], { type: 'text/vcard' })), download: 'Veera-Engineering.vcf' });
    a.click(); URL.revokeObjectURL(a.href); say('Contact file downloaded');
  });

  /* Contact form -> opens visitor's email app */
  const form = $('#contactForm'), msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const { name, phone, message } = form.elements;
    let ok = true;
    [name, message].forEach(f => { const bad = !f.value.trim(); f.classList.toggle('invalid', bad); if (bad) ok = false; });
    if (!ok) { msg.textContent = 'Please fill in your name and message.'; return; }
    msg.textContent = '';
    location.href = 'mailto:veera20engineering@gmail.com?subject=' + encodeURIComponent('Enquiry from website') +
      '&body=' + encodeURIComponent(`Name: ${name.value.trim()}\nPhone: ${phone.value.trim()}\n\n${message.value.trim()}`);
  });

  $('#year').textContent = new Date().getFullYear();
  addEventListener('hashchange', showPage);
  showPage();
})();
