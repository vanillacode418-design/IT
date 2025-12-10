/* Kaizen Automation Hub — site JS
   Slider, accordion, form interactions, year injection
*/

document.addEventListener('DOMContentLoaded', function () {
  // Inject year in footers
  const yrs = new Date().getFullYear();
  ['year','year2','year3','year4','year5'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.textContent = yrs;
  });

  /***** HERO SLIDER *****/
  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    let current = 0;
    const controls = document.getElementById('sliderControls');

    // Build dots
    slides.forEach((s, idx) => {
      s.setAttribute('aria-hidden', 'true');
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.addEventListener('click', ()=> showSlide(idx));
      controls.appendChild(dot);
    });

    const dots = Array.from(controls.querySelectorAll('.slider-dot'));

    function showSlide(idx){
      slides.forEach((s,i)=>{
        s.style.opacity = i===idx ? '1' : '0';
        s.setAttribute('aria-hidden', i===idx ? 'false' : 'true');
      });
      dots.forEach((d,i)=> d.classList.toggle('active', i===idx));
      current = idx;
    }

    // check URL param ?slide=1..5
    const params = new URLSearchParams(location.search);
    const requested = parseInt(params.get('slide'),10);
    if(requested && requested >=1 && requested <= slides.length){
      showSlide(requested-1);
    } else {
      showSlide(0);
    }

    // autoplay
    const autoplay = slider.dataset.autoplay === 'true';
    if (autoplay){
      setInterval(()=>{ showSlide((current+1)%slides.length); }, 6000);
    }
  }

  /***** Accordion (FAQ) *****/
  document.querySelectorAll('.acc-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const panel = btn.nextElementSibling;
      const isOpen = panel.style.display === 'block';
      // close all
      document.querySelectorAll('.acc-panel').forEach(p => p.style.display = 'none');
      document.querySelectorAll('.acc-btn .chev').forEach(ch => ch.textContent='▸');
      if(!isOpen){
        panel.style.display = 'block';
        btn.querySelector('.chev').textContent = '▾';
      }
    });
  });

  /***** Contact form (dummy) *****/
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    const sendBtn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');
    sendBtn.addEventListener('click', ()=>{
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      if(!name || !email){ status.textContent = 'Please provide name and email.'; return; }
      status.textContent = 'Sending…';
      // Simulate send
      setTimeout(()=>{ status.textContent = 'Thanks — we received your message. We will reach out soon.'; contactForm.reset(); }, 900);
    });
  }

  /***** Tiny nav animation on scroll (sticky already) *****/
  let lastScroll = 0;
  const topbar = document.querySelector('.topbar');
  window.addEventListener('scroll', function(){
    const sc = window.scrollY;
    if(sc > 40) topbar.classList.add('scrolled'); else topbar.classList.remove('scrolled');
    lastScroll = sc;
  });

  /***** Accessible: allow keyboard slide control with arrows *****/
  document.addEventListener('keydown', function(e){
    if(['ArrowLeft','ArrowRight'].includes(e.key) && document.getElementById('heroSlider')){
      const dots = document.querySelectorAll('.slider-dot');
      const activeIdx = Array.from(dots).findIndex(d => d.classList.contains('active'));
      if(e.key === 'ArrowLeft') dots[Math.max(0, activeIdx-1)].click();
      if(e.key === 'ArrowRight') dots[Math.min(dots.length-1, activeIdx+1)].click();
    }
  });

});
