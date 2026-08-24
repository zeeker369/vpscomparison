(function(){
  var nodes=document.querySelectorAll('[data-daily-price-status]');
  if(!nodes.length) return;
  function fmtDate(iso){
    var d=new Date(iso+'T12:00:00');
    if(Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat('en-US',{day:'numeric',month:'short',year:'numeric'}).format(d);
  }
  function localISO(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  fetch('/data/database-health.json',{cache:'no-store'}).then(function(r){if(!r.ok) throw new Error('status');return r.json();}).then(function(h){
    var today=localISO()===h.latest_verified_at;
    var latestCount=h.verified_on_latest_date||h.verified_products;
    var text=latestCount+' products '+(today?'verified today':'last verified '+fmtDate(h.latest_verified_at));
    if(h.partial_products) text+=' · '+h.partial_products+' partial';
    nodes.forEach(function(n){n.textContent=text;});
  }).catch(function(){ /* Static fallback remains visible. */ });
})();
