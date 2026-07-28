window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 400);
    setTimeout(runTerminal, 1200);
  });

  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle.addEventListener('click', () => navList.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navList.classList.remove('open')));

  const spineFill = document.getElementById('spineFill');
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    spineFill.style.height = scrolled + '%';
    backTop.classList.toggle('show', h.scrollTop > 600);
  });
  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Custom cursor
  const cDot = document.getElementById('cursorDot');
  const cRing = document.getElementById('cursorRing');
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2, ringX = mouseX, ringY = mouseY;
  const isDesktop = window.matchMedia('(min-width:901px)').matches;
  if(isDesktop){
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cDot.style.left = mouseX + 'px'; cDot.style.top = mouseY + 'px';
    });
    function animateRing(){
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cRing.style.left = ringX + 'px'; cRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .project-card, .c-card, .filter-btn, .t-card-head').forEach(el => {
      el.addEventListener('mouseenter', () => cRing.classList.add('grow'));
      el.addEventListener('mouseleave', () => cRing.classList.remove('grow'));
    });
  } else {
    cDot.style.display = 'none'; cRing.style.display = 'none';
  }

  // Cursor glow (hero ambient)
  const glow = document.getElementById('cursorGlow');
  const heroEl = document.querySelector('.hero');
  if(isDesktop){
    heroEl.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1'; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
    });
    heroEl.addEventListener('mouseleave', () => glow.style.opacity = '0');
  }

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${x*0.22}px, ${y*0.22}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });

  // Terminal typing sequence
  const termLines = [
    {cmd:'git clone https://github.com/divya-ughade/portfolio.git', out:"Cloning into 'portfolio'... done."},
    {cmd:'npm install', out:'Dependencies installed successfully.'},
    {cmd:'npm run dev', out:'Server running at http://localhost:3000 🚀'}
  ];
  const termBody = document.getElementById('termBody');
  let termRunning = false;
  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }
  async function typeInto(el, text, speed){
    for(let i=0;i<=text.length;i++){ el.textContent = text.slice(0,i); await wait(speed); }
  }
  async function runTerminal(){
    if(termRunning) return;
    termRunning = true;
    termBody.innerHTML = '';
    for(const line of termLines){
      const cmdRow = document.createElement('div'); cmdRow.className = 'term-line';
      const prompt = document.createElement('span'); prompt.className = 'term-prompt'; prompt.textContent = 'divya@dev:~$ ';
      const cmdSpan = document.createElement('span'); cmdSpan.className = 'term-cmd';
      cmdRow.appendChild(prompt); cmdRow.appendChild(cmdSpan); termBody.appendChild(cmdRow);
      await typeInto(cmdSpan, line.cmd, 30);
      await wait(300);
      const outRow = document.createElement('div'); outRow.className = 'term-out'; outRow.textContent = line.out;
      termBody.appendChild(outRow);
      await wait(500);
    }
    termRunning = false;
  }
  const termReplayBtn = document.getElementById('termReplay');
  if(termReplayBtn) termReplayBtn.addEventListener('click', runTerminal);

  // Nav scroll-spy + sliding pill
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navPill = document.getElementById('navPill');
  function movePill(link){
    if(!link || window.innerWidth <= 768) return;
    const ulRect = navList.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    navPill.style.left = (r.left - ulRect.left) + 'px';
    navPill.style.width = r.width + 'px';
  }
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
        if(active){ active.classList.add('active'); movePill(active); }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spyObserver.observe(s));
  window.addEventListener('resize', () => movePill(document.querySelector('.nav-link.active')));
  window.addEventListener('load', () => movePill(document.querySelector('.nav-link.active') || navLinks[0]));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));

  // Skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.querySelectorAll('.skill-progress').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

  // Stat counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '+';
          let cur = 0;
          const step = Math.max(1, Math.round(target / 40));
          const iv = setInterval(() => {
            cur += step;
            if(cur >= target){ cur = target; clearInterval(iv); }
            el.textContent = cur + (cur === target ? suffix : '');
          }, 30);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stats-grid').forEach(el => statObserver.observe(el));

  // 3D tilt on project cards
  document.querySelectorAll('.project-card.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)'; });
  });

  // Project filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if(match){
          card.style.display = '';
          requestAnimationFrame(() => card.classList.remove('hide'));
        } else {
          card.classList.add('hide');
          setTimeout(() => { if(card.classList.contains('hide')) card.style.display = 'none'; }, 350);
        }
      });
    });
  });

  // Timeline expand/collapse
  document.querySelectorAll('.t-card-head').forEach(head => {
    head.addEventListener('click', () => head.closest('.t-card').classList.toggle('expanded'));
  });

  // Toast helper
  let toastTimer;
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  // Confetti burst
  function burstConfetti(x, y){
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9500;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const colors = ['#3B6FD1', '#FF7A30', '#8B6BF2', '#3ADFC5'];
    const pieces = Array.from({length: 50}, () => ({
      x, y, vx: (Math.random()-0.5)*8, vy: Math.random()*-8-2, g: 0.28,
      size: Math.random()*6+4, color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360, vr: (Math.random()-0.5)*10
    }));
    let frame = 0;
    function tick(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI/180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
      });
      frame++;
      if(frame < 65) requestAnimationFrame(tick); else canvas.remove();
    }
    tick();
  }

  document.getElementById('copyEmailBtn').addEventListener('click', async (e) => {
    const email = 'divya.ughade24@pccoepune.org';
    try{
      await navigator.clipboard.writeText(email);
      showToast('Email copied to clipboard!');
      burstConfetti(e.clientX, e.clientY);
    }catch(err){
      showToast('Copy failed — email: ' + email);
    }
  });

  // Particle network canvas in hero
  const canvasEl = document.getElementById('particleCanvas');
  const ctx2 = canvasEl.getContext('2d');
  let particles = [];
  function resizeCanvas(){ canvasEl.width = heroEl.offsetWidth; canvasEl.height = heroEl.offsetHeight; }
  function initParticles(){
    const count = window.innerWidth < 700 ? 35 : 70;
    particles = Array.from({length: count}, () => ({
      x: Math.random() * canvasEl.width, y: Math.random() * canvasEl.height,
      vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4
    }));
  }
  function drawParticles(){
    ctx2.clearRect(0, 0, canvasEl.width, canvasEl.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > canvasEl.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvasEl.height) p.vy *= -1;
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 130){
          ctx2.strokeStyle = `rgba(111,160,245,${1 - dist/130})`;
          ctx2.lineWidth = 1;
          ctx2.beginPath(); ctx2.moveTo(particles[i].x, particles[i].y); ctx2.lineTo(particles[j].x, particles[j].y); ctx2.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx2.fillStyle = 'rgba(255,122,48,0.8)';
      ctx2.beginPath(); ctx2.arc(p.x, p.y, 2, 0, Math.PI*2); ctx2.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    resizeCanvas(); initParticles(); drawParticles();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  }
