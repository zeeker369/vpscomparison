(function(){
  var root=document.querySelector('[data-vps-finder]');
  var data=window.VPSFinderIndex;
  if(!root||!data||!Array.isArray(data.products)) return;
  var form=root.querySelector('#vpsFinderForm');
  var result=root.querySelector('#vpsFinderResult');
  if(!form||!result) return;

  var summary=result.querySelector('[data-result-summary]');
  var warning=result.querySelector('[data-result-warning]');
  var list=result.querySelector('[data-result-list]');
  var verified=result.querySelector('[data-result-verified]');
  var managementField=root.querySelector('[data-field-management]');
  var ramField=root.querySelector('[data-field-ram]');
  var siteScaleField=root.querySelector('[data-field-site-scale]');
  var gameField=root.querySelector('[data-field-game]');
  var gameSizeField=root.querySelector('[data-field-game-size]');
  var capacityHint=root.querySelector('[data-capacity-hint]');

  /* Deep-linkable presets for route cards and future landing pages. */
  try {
    var qs=new URLSearchParams(window.location.search);
    ['workload','management','siteScale','ram','game','gameSize','billing','budget'].forEach(function(name){
      var value=qs.get(name), control=form.elements[name];
      if(!value||!control) return;
      var ok=Array.from(control.options||[]).some(function(o){return o.value===value&&!o.disabled;});
      if(ok) control.value=value;
    });
  } catch(e) {}

  function money(n){
    if(n==null||Number.isNaN(Number(n))) return 'Price unavailable';
    var v=Number(n), decimals=Math.round(v*100)%100?2:0;
    return '$'+v.toFixed(decimals);
  }
  function gb(mb){ if(mb==null) return null; return mb<1024?mb+' MB':(mb/1024)+' GB'; }
  function fmtDate(iso){
    var d=new Date(iso+'T12:00:00');
    if(Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat('en-US',{day:'numeric',month:'short',year:'numeric'}).format(d);
  }
  function localISODate(){
    var d=new Date(), y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+day;
  }
  function verificationText(){
    var same=localISODate()===data.latestVerifiedAt;
    var latestCount=data.latestVerifiedProductCount||data.verifiedProductCount;
    var base=latestCount+' products '+(same?'verified today':'last verified '+fmtDate(data.latestVerifiedAt));
    if(data.partialProductCount) base+=' · '+data.partialProductCount+' partial';
    return base;
  }
  document.querySelectorAll('[data-daily-price-status]').forEach(function(el){el.textContent=verificationText();});

  function productTypeLabel(p){
    var map={vps:'VPS',cloud_compute:'Cloud compute',managed_vps:'Managed VPS',managed_wordpress:'Managed WordPress',cloud_hosting:'Cloud hosting',gpu_cloud:'GPU cloud',game_hosting:'Game hosting',bare_metal:'Bare metal'};
    return map[p.productType]||p.productType;
  }
  function storageLabel(p){
    if(p.storageGb==null) return null;
    var type=p.storageType&&p.storageType!=='managed'?' '+String(p.storageType).toUpperCase():'';
    return p.storageGb+' GB'+type+' storage';
  }
  function siteLabel(p){
    if(p.sitesUnlimited) return 'Unlimited sites';
    if(p.sites!=null) return p.sites+' site'+(p.sites===1?'':'s');
    return null;
  }
  function priceLabel(p){
    if(p.price==null) return 'Price unavailable';
    if(p.priceType==='intro') return money(p.price)+'/mo intro';
    if(p.priceType==='monthly-cap') return '~'+money(p.price)+'/mo';
    return money(p.price)+'/mo';
  }
  function billingLabel(p){
    if(p.priceType==='intro'&&p.minimumTermMonths) return p.minimumTermMonths+'-month intro term';
    if(p.billingModel==='prepaid') return 'Prepaid';
    if(p.billingModel==='per-second') return 'Per-second / monthly cap';
    if(p.hourlyAvailable) return 'Hourly';
    if(p.billingModel==='monthly') return 'Monthly';
    return p.billingModel||'Billing n/a';
  }
  function isCompute(p){ return ['vps','cloud_compute','managed_vps','gpu_cloud','bare_metal'].indexOf(p.productType)>=0; }
  function isManagedWP(p){ return p.productType==='managed_wordpress'; }

  function budgetLimit(pref){
    return {under10:10,under25:25,under50:50,under100:100}[pref]||null;
  }
  function budgetFit(p,pref){
    var limit=budgetLimit(pref); if(!limit||p.price==null) return 100;
    if(p.price<=limit) return 100;
    var over=(p.price-limit)/limit;
    return Math.max(0,Math.round(100-over*105));
  }
  function billingFit(p,pref){
    if(pref==='any') return 100;
    if(pref==='hourly') return p.hourlyAvailable?100:5;
    if(pref==='monthly') return p.billingModel==='monthly'?100:(p.billingModel==='prepaid'?35:75);
    if(pref==='prepaid') return p.billingModel==='prepaid'?100:45;
    return 70;
  }
  function managementFit(p,pref,workload){
    if(pref==='any') {
      if(workload==='wordpress'||workload==='woocommerce') return isManagedWP(p)?96:(p.managementLevel==='panel-assisted'?88:78);
      return 100;
    }
    if(pref==='managed') return isManagedWP(p)?100:0;
    if(pref==='panel') return isCompute(p)&&p.managementLevel==='panel-assisted'?100:0;
    if(pref==='self') return isCompute(p)&&p.managementLevel==='self-managed'?100:0;
    return 70;
  }
  function ramFit(p,target){
    if(!isCompute(p)) return 78;
    if(!target||p.ramMb==null) return 55;
    if(p.ramMb===target) return 100;
    if(p.ramMb>target){ var up=p.ramMb/target; return Math.max(50,Math.round(90-(up-1)*18)); }
    var down=target/p.ramMb; return Math.max(0,Math.round(72-(down-1)*42));
  }
  function siteCapacityFit(p,scale){
    var visitTarget={small:25000,growing:75000,high:250000}[scale]||25000;
    var bandwidthTarget={small:20,growing:40,high:100}[scale]||20;
    if(isManagedWP(p)){
      if(p.monthlyVisits!=null){
        if(p.monthlyVisits>=visitTarget) return p.monthlyVisits===visitTarget?100:92;
        return Math.max(25,Math.round(70*(p.monthlyVisits/visitTarget)));
      }
      if(p.serverBandwidthGb!=null){
        if(p.serverBandwidthGb>=bandwidthTarget) return p.serverBandwidthGb===bandwidthTarget?94:90;
        return Math.max(30,Math.round(70*(p.serverBandwidthGb/bandwidthTarget)));
      }
      return 78;
    }
    var ramTarget={small:4096,growing:8192,high:16384}[scale]||4096;
    return ramFit(p,ramTarget);
  }
  function gameProfile(id){ return (data.gameProfiles||[]).find(function(x){return x.id===id;})||(data.gameProfiles||[])[0]; }
  function gameRam(values){
    var g=gameProfile(values.game), key='ram_'+values.gameSize+'_mb';
    return g&&g[key]?g[key]:4096;
  }
  function targetRam(values){
    if(values.workload==='game') return gameRam(values);
    if(values.workload==='wordpress') return {small:4096,growing:8192,high:16384}[values.siteScale]||4096;
    if(values.workload==='woocommerce') return {small:8192,growing:16384,high:32768}[values.siteScale]||8192;
    return values.ramMb;
  }
  function capacityFit(p,values){
    if(values.workload==='wordpress'||values.workload==='woocommerce') return siteCapacityFit(p,values.siteScale);
    return ramFit(p,targetRam(values));
  }
  function eligibleByWorkload(p,values){
    if(values.workload==='wordpress') return !!p.platform.wordpress;
    if(values.workload==='woocommerce') return !!p.platform.woocommerce;
    if(values.workload==='game') return isCompute(p)&&!!p.platform.game_server;
    if(values.workload==='developer'||values.workload==='temporary'||values.workload==='website') return isCompute(p);
    return true;
  }
  function managementEligible(p,values){
    if(values.management==='any') return true;
    if(values.management==='managed') return isManagedWP(p);
    if(values.management==='panel') return isCompute(p)&&p.managementLevel==='panel-assisted';
    if(values.management==='self') return isCompute(p)&&p.managementLevel==='self-managed';
    return true;
  }
  function exact(p,values){
    if(!eligibleByWorkload(p,values)||!managementEligible(p,values)) return false;
    var limit=budgetLimit(values.budget);
    if(limit&&(p.price==null||p.price>limit)) return false;
    if(values.billing==='hourly'&&!p.hourlyAvailable) return false;
    if(values.billing==='monthly'&&p.billingModel!=='monthly') return false;
    if(values.billing==='prepaid'&&p.billingModel!=='prepaid') return false;
    if(isCompute(p)){
      var target=targetRam(values); if(target&&p.ramMb!==target) return false;
    }else if(isManagedWP(p)){
      /* Unknown provider capacity must never be promoted to an exact match. */
      if(p.monthlyVisits==null&&p.serverBandwidthGb==null) return false;
      if(capacityFit(p,values)<70) return false;
    }
    return true;
  }
  function valueFit(p,pool){
    if(p.price==null) return 45;
    var priced=pool.filter(function(x){return x.price!=null;}); if(!priced.length) return 50;
    var min=Math.min.apply(null,priced.map(function(x){return x.price;}));
    var max=Math.max.apply(null,priced.map(function(x){return x.price;}));
    if(max===min) return 100;
    return Math.round(100-((p.price-min)/(max-min))*50);
  }

  function currentValues(){
    var fd=new FormData(form);
    return {
      workload:fd.get('workload')||'wordpress',management:fd.get('management')||'any',
      ramMb:parseInt(fd.get('ram')||'4096',10),siteScale:fd.get('siteScale')||'small',
      game:fd.get('game')||'minecraft',gameSize:fd.get('gameSize')||'small',
      billing:fd.get('billing')||'any',budget:fd.get('budget')||'under25'
    };
  }

  function rank(values){
    var eligible=data.products.filter(function(p){return eligibleByWorkload(p,values);});
    var preferred=eligible.filter(function(p){return managementEligible(p,values);});
    var pool=preferred.length?preferred:eligible;
    return pool.map(function(p){
      var workload=p.scores&&p.scores[values.workload]!=null?p.scores[values.workload]:50;
      var cap=capacityFit(p,values), mgmt=managementFit(p,values.management,values.workload), bill=billingFit(p,values.billing), budget=budgetFit(p,values.budget), value=valueFit(p,pool);
      var weights=values.workload==='game'?{work:0.25,cap:0.35,mgmt:0.10,bill:0.10,budget:0.12,value:0.08}:{work:0.30,cap:0.20,mgmt:0.20,bill:0.10,budget:0.12,value:0.08};
      var total=workload*weights.work+cap*weights.cap+mgmt*weights.mgmt+bill*weights.bill+budget*weights.budget+value*weights.value;
      if(p.verificationStatus==='partial') total-=2;
      return {product:p,score:Math.max(0,Math.min(99,Math.round(total))),exact:exact(p,values),capacity:cap};
    }).sort(function(a,b){
      if(b.exact!==a.exact) return Number(b.exact)-Number(a.exact);
      if(b.score!==a.score) return b.score-a.score;
      return (a.product.price==null?999999:a.product.price)-(b.product.price==null?999999:b.product.price);
    });
  }

  function reasons(item,values){
    var p=item.product, out=[];
    out.push(productTypeLabel(p));
    if(isCompute(p)){
      var t=targetRam(values); if(t){ if(p.ramMb===t) out.push(gb(t)+' target RAM'); else out.push(gb(p.ramMb)+' vs '+gb(t)+' target'); }
    }else{
      if(p.monthlyVisits) out.push((p.monthlyVisits/1000)+'k visits/mo');
      else if(p.serverBandwidthGb) out.push(p.serverBandwidthGb+' GB server bandwidth');
      var sites=siteLabel(p); if(sites) out.push(sites);
    }
    var limit=budgetLimit(values.budget);
    if(limit&&p.price!=null) out.push(p.price<=limit?'Within $'+limit+' budget':'Over budget by '+money(p.price-limit));
    if(values.billing==='hourly') out.push(p.hourlyAvailable?'Hourly billing fits':'Not hourly');
    if(values.management==='managed') out.push(isManagedWP(p)?'Server maintenance handled':'Not fully managed');
    else if(values.management==='panel') out.push(p.managementLevel==='panel-assisted'?'Control panel fit':'No hosting panel');
    else if(values.management==='self') out.push(p.managementLevel==='self-managed'?'Root / cloud control':'Managed service');
    if(values.workload==='game') out.push('Game sizing baseline: '+gb(gameRam(values)));
    return out.slice(0,5);
  }
  function specChips(p){
    var xs=[];
    if(isCompute(p)){
      if(p.ramMb!=null) xs.push(gb(p.ramMb));
      if(p.vCpu!=null) xs.push(p.vCpu+' vCPU');
      var st=storageLabel(p); if(st) xs.push(st);
    }else{
      var sites=siteLabel(p); if(sites) xs.push(sites);
      if(p.monthlyVisits!=null) xs.push((p.monthlyVisits/1000)+'k visits/mo');
      if(p.serverBandwidthGb!=null) xs.push(p.serverBandwidthGb+' GB server bandwidth');
      var storage=storageLabel(p); if(storage) xs.push(storage);
    }
    return xs.slice(0,3);
  }
  function renderCard(item,index,values){
    var p=item.product, why=reasons(item,values);
    var label=index===0?(item.exact?'Best match':'Closest match'):(item.exact?'Exact alternative':'Alternative');
    var verification=p.verificationStatus==='verified'?'Verified '+(p.verifiedAt===localISODate()?'today':fmtDate(p.verifiedAt)):'Partial verification';
    var renewal=p.renewalPrice!=null?'<span class="finder-card-renewal">Renews '+money(p.renewalPrice)+'/mo</span>':'';
    var review=p.reviewUrl?'<a class="btn btn-secondary" href="'+p.reviewUrl+'">Review</a>':'';
    var cta=p.affiliateUrl?'<a class="btn btn-primary" href="'+p.affiliateUrl+'" target="_blank" rel="nofollow sponsored noopener">Open '+p.provider+'</a>':'<a class="btn btn-primary" href="'+p.merchantUrl+'" target="_blank" rel="noopener">View '+p.provider+'</a>';
    return '<article class="finder-match'+(index===0?' finder-match--best':'')+'">'+
      '<div class="finder-match-rank"><span>#'+(index+1)+'</span><strong>'+label+'</strong><em>'+item.score+'% match</em></div>'+
      '<div class="finder-match-main"><div class="finder-match-title"><p>'+productTypeLabel(p)+' · '+p.provider+'</p><h3>'+p.product+'</h3></div><div class="finder-match-price"><strong>'+priceLabel(p)+'</strong>'+renewal+'</div></div>'+
      '<div class="finder-match-specs">'+specChips(p).map(function(x){return '<span>'+x+'</span>';}).join('')+'</div>'+
      '<ul class="finder-match-reasons">'+why.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'+
      '<div class="finder-match-meta"><span>'+billingLabel(p)+'</span><span>'+verification+'</span></div>'+
      '<div class="finder-match-actions">'+review+cta+'</div></article>';
  }

  function updateFields(values){
    var wp=values.workload==='wordpress'||values.workload==='woocommerce';
    var game=values.workload==='game';
    if(managementField) managementField.hidden=!(wp||values.workload==='website');
    if(siteScaleField) siteScaleField.hidden=!wp;
    if(ramField) ramField.hidden=wp||game;
    if(gameField) gameField.hidden=!game;
    if(gameSizeField) gameSizeField.hidden=!game;
    var mgmt=form.elements.management;
    if(mgmt){
      Array.from(mgmt.options).forEach(function(o){ if(o.value==='managed') o.disabled=!wp; });
      if(!wp&&mgmt.value==='managed') mgmt.value='any';
    }
    if(capacityHint){
      if(game){ var gp=gameProfile(values.game); capacityHint.textContent='Sizing baseline: '+gb(gameRam(values))+' RAM for '+(gp?gp.label:'this game')+'. Mods, maps, and player count can require more.'; }
      else if(wp){ capacityHint.textContent=values.management==='managed'?'Managed WordPress capacity is compared by visits/bandwidth/sites where providers publish it.':'For VPS alternatives, site size maps to a RAM baseline; exact needs still depend on plugins and traffic.'; }
      else capacityHint.textContent='RAM is treated as a hard capacity target when an exact size exists.';
    }
  }

  function render(){
    var values=currentValues(); updateFields(values); values=currentValues();
    var ranked=rank(values), exactCount=ranked.filter(function(x){return x.exact;}).length, shown=ranked.slice(0,3);
    if(summary) summary.textContent=data.productCount+' products checked across '+data.providerCount+' providers · '+exactCount+' exact match'+(exactCount===1?'':'es')+' · top 3 shown';
    if(verified) verified.textContent=verificationText();
    if(warning){
      var msg='';
      if(!ranked.length) msg='No product in the current database supports this workload and management combination yet.';
      else if(!exactCount) msg='No product satisfies every selected constraint. The ranking shows the closest trade-offs instead of inventing an exact answer.';
      if(values.workload==='game') msg+=(msg?' ':'')+'Game-server sizing is an editorial baseline, not a benchmark result.';
      warning.hidden=!msg; warning.textContent=msg;
    }
    if(list) list.innerHTML=shown.map(function(x,i){return renderCard(x,i,values);}).join('');
    result.classList.remove('finder-result--updated'); void result.offsetWidth; result.classList.add('finder-result--updated');
  }

  form.addEventListener('submit',function(e){e.preventDefault();render();});
  form.addEventListener('change',render);
  render();
})();
