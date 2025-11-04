 // Mobile menu toggle (improved accessibility + close on outside)
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.style.display === 'block';
      mobileNav.style.display = open ? 'none' : 'block';
      mobileNav.setAttribute('aria-hidden', String(open));
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    function closeMobile(){ mobileNav.style.display='none'; mobileNav.setAttribute('aria-hidden','true'); menuBtn.setAttribute('aria-expanded','false') }
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) closeMobile();
    });

    // Smooth scroll helper
    function scrollToDownload(){ document.querySelector('#download').scrollIntoView({ behavior:'smooth' }); }

    // IntersectionObserver for fade-in animations + stagger from style var
    const faders = document.querySelectorAll('.fade-in');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delayAttr = el.getAttribute('style')?.match(/--delay:(\s*\d+)ms/)?.[1];
          const delay = delayAttr ? Number(delayAttr) : (parseInt(el.dataset.delay) || 0);
          el.style.transitionDelay = (delay || 0) + 'ms';
          el.classList.add('show');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.16 });
    faders.forEach(el => io.observe(el));

    // Header scroll effect
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive:true });

    // Parallax-ish phone movement
    const phone = document.getElementById('phoneMock');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!phone) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = phone.getBoundingClientRect();
          const center = rect.top + rect.height/2;
          const diff = (window.innerHeight/2 - center)/30;
          phone.style.transform = `translateY(${Math.max(-14,Math.min(14,diff))}px) rotateX(${diff*0.4}deg) rotateY(${diff*0.18}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive:true });

    // keyboard accessibility for feature cards
    document.querySelectorAll('.feature-card').forEach((card, i) => {
      card.addEventListener('focus', ()=>card.classList.add('show'));
      card.style.transitionDelay = (120 + i*60) + 'ms';
    });

    // Smooth in-page anchor handling (nav + footer + any internal links)
    (function enableSmoothAnchors(){
      // respect reduced motion preference
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e){
          const href = this.getAttribute('href');
          if (!href || href === '#') return; // leave empty/hash links alone
          const id = href.slice(1);
          const target = document.getElementById(id);
          if (!target) return; // external or non-existing id: fallback to default
          // prevent default jump and smooth scroll instead
          e.preventDefault();

          // If mobile menu open, close it first for a clean experience
          if (mobileNav && mobileNav.style.display === 'block') closeMobile();

          if (prefersReduced) {
            target.scrollIntoView();
            // update hash without affecting scroll behavior
            history.replaceState(null, '', '#' + id);
          } else {
            // use smooth behavior and update URL
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // update hash after a small delay so browser doesn't jump (delay is minimal)
            setTimeout(() => history.replaceState(null, '', '#' + id), 300);
          }
        }, { passive: false });
      });
    })();