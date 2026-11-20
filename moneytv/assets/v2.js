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
    var empty=document.getElementById('feedempty');
    if(empty) empty.classList.toggle('hidden', feed.querySelectorAll('.item:not(.hidden)').length>0);
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

/* archive: reveal more episodes */
(function(){
  var btn=document.getElementById('archivemore'), grid=document.getElementById('archivegrid');
  if(!btn||!grid) return;
  function update(){ if(!grid.querySelector('.more-hide')) btn.parentNode.hidden=true; }
  btn.addEventListener('click',function(){
    var hidden=grid.querySelectorAll('.more-hide'), n=Math.min(24,hidden.length);
    for(var i=0;i<n;i++) hidden[i].classList.remove('more-hide');
    update();
  });
})();

/* in-page jump links (profile pages) */
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-jump]'); if(!a) return;
  var t=document.getElementById(a.getAttribute('data-jump')); if(!t) return;
  e.preventDefault(); t.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
});

/* Work With Us: choose guest or sponsor form */
(function(){var root=document.getElementById('wwu');if(!root)return;
var btns=root.querySelectorAll('.path'),panes=root.querySelectorAll('.pane');
function pick(t){btns.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-t')===t?'true':'false')});panes.forEach(function(p){p.hidden=p.getAttribute('data-p')!==t})}
btns.forEach(function(b){b.addEventListener('click',function(){pick(b.getAttribute('data-t'))})});
var h=(location.hash||'').replace('#','');if(h==='sponsors'||h==='guests')pick(h);
window.addEventListener('hashchange',function(){var x=(location.hash||'').replace('#','');if(x==='sponsors'||x==='guests')pick(x)});
})();

/* Legal pages: "On this page" list scrolls to a section, highlights it on click, and follows the reader */
(function(){var nav=document.getElementById('tocnav');if(!nav)return;
var links=[].slice.call(nav.querySelectorAll('a'));
var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))}).filter(Boolean);
var OFFSET=70,locked=null;
function set(id){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)})}
function current(){var y=window.scrollY+OFFSET+8,id=secs[0].id;secs.forEach(function(s){if(s.offsetTop<=y)id=s.id});return id}
function update(){set(locked||current())}
function release(){locked=null}
['wheel','touchmove','keydown','mousedown'].forEach(function(ev){window.addEventListener(ev,function(e){if(ev==='mousedown'&&e.target.closest&&e.target.closest('#tocnav'))return;release()},{passive:true})});
links.forEach(function(a){a.addEventListener('click',function(e){
  var id=a.getAttribute('href').slice(1),t=document.getElementById(id);if(!t)return;
  e.preventDefault();locked=id;set(id);
  var top=t.getBoundingClientRect().top+window.scrollY-OFFSET;
  window.scrollTo({top:top,behavior:'smooth'});
  try{history.replaceState(null,'','#'+id)}catch(x){}
})});
var art=document.querySelector('.lg'),mx=0,my=0,over=false;
function hover(){var el=document.elementFromPoint(mx,my),s=el&&el.closest&&el.closest('.lg-sec');if(s)set(s.id);else set(current())}
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;over=!!(art&&art.contains(e.target));if(over){locked=null;hover()}},{passive:true});
if(art)art.addEventListener('mouseleave',function(){over=false});
window.addEventListener('scroll',function(){if(locked)return;if(over)hover();else update()},{passive:true});
if(location.hash&&document.getElementById(location.hash.slice(1))){var h=location.hash.slice(1);locked=h;setTimeout(function(){var t=document.getElementById(h);window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-OFFSET});set(h)},50)}
update();
})();
/* Newsletter button opens a pop-up with the signup form */
(function(){var d=document.getElementById('nlmodal');if(!d||typeof d.showModal!=='function')return;
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="/moneytv/#newsletter"],a[href="#newsletter-open"]');if(!a)return;
e.preventDefault();d.showModal();var i=document.getElementById('nlemail');if(i)setTimeout(function(){i.focus()},30)});
d.addEventListener('click',function(e){if(e.target===d)d.close()});
})();

/* Ticker widget: restyle to match the site (its styles live in an open shadow root; page CSS variables inherit in) */
(function(){
var CSS='.mtv-card{background:var(--panel);color:var(--text);border-color:var(--line);border-radius:16px}'
+'.mtv-name,.mtv-sector,.mtv-k{color:var(--muted)}.mtv-foot{display:none}'
+'.mtv-cell{background:var(--panel-2);border-color:var(--line)}.mtv-v{color:var(--text)}'
+'.up,.mtv-v.pos{color:var(--accent)}.down,.mtv-v.neg{color:var(--down)}'
+'.mtv-cta{background:var(--signal);color:#0b1409;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:13px 20px}'
+'.mtv-card.w{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);column-gap:30px;align-items:start}'
+'.mtv-card.w .mtv-head,.mtv-card.w .mtv-pricerow,.mtv-card.w .mtv-chart,.mtv-card.w .mtv-nochart,.mtv-card.w .mtv-sector{grid-column:1}.mtv-card.w .mtv-head{grid-row:1}.mtv-card.w .mtv-pricerow{grid-row:2}.mtv-card.w .mtv-chart,.mtv-card.w .mtv-nochart{grid-row:3;margin-bottom:0}.mtv-card.w .mtv-sector{grid-row:4;margin:10px 0 0;align-self:center}'
+'.mtv-card.w .mtv-grid{grid-column:2;grid-row:1/4;align-self:stretch;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr))}.mtv-card.w .mtv-cell{justify-content:center;gap:6px;padding:10px 14px}.mtv-card.w .mtv-v{font-size:19px}.mtv-card.w .mtv-k{font-size:10.5px}.mtv-card.w .mtv-cta{grid-column:2;grid-row:4;margin-top:12px;align-self:end}';
function apply(t){var r=t.shadowRoot;if(!r||!r.querySelector('.mtv-card')||r.querySelector('style[data-site]'))return false;
var s=document.createElement('style');s.setAttribute('data-site','1');s.textContent=CSS;r.appendChild(s);var c=r.querySelector('.mtv-card');var f=function(){c.classList.toggle('w',c.getBoundingClientRect().width>=640)};f();if(window.ResizeObserver)new ResizeObserver(f).observe(c);else addEventListener('resize',f);return true}
function watch(t){if(apply(t))return;var n=0,i=setInterval(function(){if(apply(t)||++n>80)clearInterval(i)},250)}
function go(){document.querySelectorAll('moneytv-ticker').forEach(watch)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
