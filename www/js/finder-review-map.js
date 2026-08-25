(function(){
  var data=window.VPSFinderIndex;
  if(!data||!Array.isArray(data.products)) return;
  var reviewByProvider={
    hostinger:'/reviews/hostinger/',
    vultr:'/reviews/vultr/',
    digitalocean:'/reviews/digitalocean/',
    kinsta:'/reviews/kinsta/',
    wpengine:'/reviews/wp-engine/'
  };
  data.products.forEach(function(p){
    if(!p.reviewUrl&&reviewByProvider[p.providerId]) p.reviewUrl=reviewByProvider[p.providerId];
  });
})();
