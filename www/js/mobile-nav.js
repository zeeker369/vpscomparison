(function(){
  var header = document.getElementById('siteHeader');
  if (header) {
    var toggle = header.querySelector('.nav-toggle');
    var shell = header.querySelector('.nav-shell');
    if (toggle && shell) {
      function closeMenu(){
        header.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }

      function openMenu(){
        header.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }

      toggle.addEventListener('click', function(){
        if (header.classList.contains('is-open')) closeMenu();
        else openMenu();
      });

      shell.querySelectorAll('a').forEach(function(link){
        link.addEventListener('click', closeMenu);
      });

      window.addEventListener('resize', function(){
        if (window.innerWidth > 1120) closeMenu();
      });

      document.addEventListener('click', function(e){
        if (!header.contains(e.target) && window.innerWidth <= 1120) closeMenu();
      });
    }
  }

  /* Keep the affiliate explanation attached to every article CTA that is
     actually marked sponsored. Existing hand-written disclosures are kept. */
  document.querySelectorAll('.affiliate-box').forEach(function(box){
    if (box.querySelector('.affiliate-disclosure')) return;
    if (!box.querySelector('a[rel~="sponsored"]')) return;

    var disclosure = document.createElement('div');
    disclosure.className = 'affiliate-disclosure';
    disclosure.innerHTML = '<p>We may earn a commission if you sign up through this link, at no extra cost to you. Affiliate relationships do not affect our pricing data, provider inclusion, or ranking methodology.</p>';

    var verification = box.querySelector('.price-verified');
    if (verification) box.insertBefore(disclosure, verification);
    else box.appendChild(disclosure);
  });
})();
