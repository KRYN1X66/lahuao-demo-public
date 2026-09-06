// Static client-only demo script
(() => {
  const $ = id => document.getElementById(id);
  let balance = 0;
  let username = '游客';

  $('username').addEventListener('input', e => username = e.target.value || '游客');

  function addFeed(item){
    const feed = $('feed');
    const el = document.createElement('div');
    el.innerText = `${new Date().toLocaleTimeString()} — ${item.user} 开出了 ${item.value} U`;
    feed.prepend(el);
    if(feed.childElementCount>50) feed.removeChild(feed.lastChild);
  }

  $('btn-gen').onclick = ()=>{
    const code = Array.from({length:12}).map(()=> 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random()*36)]).join('');
    alert('生成模拟卡密（仅本地）：\n' + code);
  };

  $('btn-redeem').onclick = ()=>{
    const v = [50,100,250,500,1000,2000,5000][Math.floor(Math.random()*7)];
    balance += v;
    $('balance').innerText = balance;
    addFeed({ user: username, value: v });
    alert('模拟兑换成功：+'+v+' U');
  };

  // Pixi wheel
  const app = new PIXI.Application({ view: document.getElementById('game-canvas'), width: 720, height: 360, backgroundAlpha:0 });
  const centerX = app.view.width/2, centerY = app.view.height/2;
  const wheel = new PIXI.Container();
  app.stage.addChild(wheel);
  const sectors = 12; const radius = 120;
  for(let i=0;i<sectors;i++){
    const g = new PIXI.Graphics();
    const a0 = (i/sectors)*Math.PI*2, a1 = ((i+1)/sectors)*Math.PI*2;
    g.beginFill(i%2?0x2b2b2f:0x1a1a1d);
    g.moveTo(centerX, centerY);
    g.arc(centerX, centerY, radius, a0, a1);
    g.lineTo(centerX, centerY);
    g.endFill();
    wheel.addChild(g);
    const t = new PIXI.Text((i+1).toString(), {fill:0xeeeeee, fontSize:16});
    const mid = (a0+a1)/2;
    t.x = centerX + Math.cos(mid)*(radius*0.6)-8;
    t.y = centerY + Math.sin(mid)*(radius*0.6)-8;
    wheel.addChild(t);
  }
  wheel.pivot.set(centerX, centerY); wheel.x = centerX; wheel.y = centerY;

  let anim = false;
  function spin(){
    if(anim) return; anim = true;
    const total = (Math.random()*360 + 900);
    const duration = 2500; const start = performance.now(); const startAngle = wheel.rotation;
    function step(now){
      const t = Math.min(1,(now-start)/duration);
      const e = 1 - Math.pow(1-t,3);
      wheel.rotation = startAngle + (total/180*Math.PI)*e;
      if(t<1) requestAnimationFrame(step); else{ anim=false;
        const finalDeg = (wheel.rotation*180/Math.PI)%360;
        const idx = Math.floor(((360 - finalDeg + 360)%360) / (360/sectors));
        const value = (idx+1)*10;
        balance += value; $('balance').innerText = balance; addFeed({ user: username, value });
        alert('开箱结果：获得 ' + value + ' U');
      }
    }
    requestAnimationFrame(step);
  }

  $('btn-open').onclick = spin;

  // seed a few fake drops on load
  setTimeout(()=>{ addFeed({ user:'系统', value:5000 }); addFeed({ user:'玩家A', value:250 }); }, 600);
})();
