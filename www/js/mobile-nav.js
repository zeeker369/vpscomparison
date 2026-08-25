(function(){
  var themeHref='/css/strata-signal.css?v=20260825a';
  var oldDark=document.querySelector('link[data-vps-dark-tech]');
  var oldObsidian=document.querySelector('link[data-vps-obsidian-signal]');
  var oldAero=document.querySelector('link[data-vps-aero-chrome]');
  var oldNoir=document.querySelector('link[data-vps-noir-brass]');
  if(oldDark) oldDark.remove();
  if(oldObsidian) oldObsidian.remove();
  if(oldAero) oldAero.remove();
  if(oldNoir) oldNoir.remove();
  if(!document.querySelector('link[data-vps-strata-signal]')){
    var theme=document.createElement('link');
    theme.rel='stylesheet';
    theme.href=themeHref;
    theme.setAttribute('data-vps-strata-signal','');
    document.head.appendChild(theme);
  }

  var header = document.getElementById('siteHeader');
  if (!header) return;
  var toggle = header.querySelector('.nav-toggle');
  var shell = header.querySelector('.nav-shell');
  if (!toggle || !shell) return;

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
})();
