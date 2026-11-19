(function(){
  var cfg = window.MONEYTV_CONFIG || {forms:{}};

  /* ---------- forms ---------- */
  function status(form, msg, ok){
    var p = form.querySelector('.form-status') || (form.parentNode && form.parentNode.querySelector('.form-status'));
    if(!p) return;
    p.hidden = false; p.textContent = msg; p.className = 'form-status ' + (ok ? 'ok' : 'err');
  }
  function collect(form){
    var data = {};
    Array.prototype.forEach.call(form.elements, function(el){
      if(!el.name || el.type === 'submit') return;
      data[el.name] = el.value;
    });
    return data;
  }
  document.querySelectorAll('form[data-form]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var key = form.getAttribute('data-form');
      var conf = (cfg.forms && cfg.forms[key]) || {};
      var data = collect(form);
      if(data.address){ return; }                // honeypot: bots fill this in
      delete data.address;
      data._form = key; data._page = location.pathname; data._submitted = new Date().toISOString();
      var btn = form.querySelector('button[type=submit]');
      if(!conf.endpoint){                        // fallback: open the visitor's email app
        var lines = Object.keys(data).filter(function(k){return k.charAt(0)!=='_';}).map(function(k){return k.charAt(0).toUpperCase()+k.slice(1)+': '+(data[k]||'Not provided');});
        var subj = (conf.subjectPrefix||'') + (data.subject||'');
        location.href = 'mailto:' + (cfg.email||'hello@moneytvpod.com') + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(lines.join('\n'));
        return;
      }
      var opts = {method:'POST', headers:{'Accept':'application/json'}};
      if(conf.format === 'form'){
        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        opts.body = Object.keys(data).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(data[k]);}).join('&');
      } else {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
      }
      if(btn){ btn.disabled = true; }
      fetch(conf.endpoint, opts).then(function(r){
        if(!r.ok) throw new Error('HTTP ' + r.status);
        form.reset(); status(form, conf.success || 'Thanks!', true);
      }).catch(function(){
        status(form, 'Sorry, something went wrong. Please email ' + (cfg.email||'hello@moneytvpod.com') + ' or call 615.266.4111.', false);
      }).then(function(){ if(btn){ btn.disabled = false; } });
    });
  });

  /* ---------- video popup ---------- */
  function openVideo(id){
    var m = document.createElement('div'); m.className = 'video-modal';
    m.innerHTML = '<div class="video-modal-box"><button class="video-modal-close" aria-label="Close">&times;</button><iframe src="https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe></div>';
    function close(){ document.removeEventListener('keydown', esc); m.remove(); }
    function esc(e){ if(e.key === 'Escape') close(); }
    m.addEventListener('click', function(e){ if(e.target === m || e.target.className === 'video-modal-close') close(); });
    document.addEventListener('keydown', esc);
    document.body.appendChild(m);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-video]');
    if(!a) return;
    e.preventDefault(); openVideo(a.getAttribute('data-video'));
  });

  /* ---------- mobile menu ---------- */
  var header = document.querySelector('header.site');
  var toggle = document.querySelector('.mobile-toggle');
  if(header && toggle){
    toggle.addEventListener('click', function(){
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.nav-links a').forEach(function(a){ a.addEventListener('click', function(){ header.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }); });
  }
})();
