(function(){
  var tabs = document.getElementById('feedtabs');
  var feed = document.getElementById('feed');
  if(!tabs || !feed) return;
  tabs.addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    tabs.querySelectorAll('button').forEach(function(x){ x.classList.toggle('on', x === b); });
    var f = b.getAttribute('data-f');
    feed.querySelectorAll('.item').forEach(function(it){
      var show = f === 'all' || it.getAttribute('data-show') === f || it.getAttribute('data-type') === f;
      it.classList.toggle('hidden', !show);
    });
  });
})();

/* theme: auto -> light -> dark */
(function(){
  var root=document.documentElement, KEY='mtv-theme';
  function get(){ try{ return localStorage.getItem(KEY)||'auto'; }catch(e){ return 'auto'; } }
  function apply(m){
    if(m==='auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme',m);
    document.querySelectorAll('[data-theme-label]').forEach(function(l){ l.textContent='Theme: '+m.charAt(0).toUpperCase()+m.slice(1); });
  }
  apply(get());
  document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
    b.addEventListener('click',function(){
      var order=['auto','light','dark'], n=order[(order.indexOf(get())+1)%3];
      try{ if(n==='auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY,n); }catch(e){}
      apply(n);
    });
  });
})();
