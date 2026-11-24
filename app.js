(function(){var $=U.$,h=U.h;
var H=U.load('hb.habits',[]);
function save(){U.save('hb.habits',H)}
function ds(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function addDays(s,n){var p=s.split('-');var d=new Date(+p[0],+p[1]-1,+p[2]+n);return ds(d)}
function streak(x,today){var set={};x.days.forEach(function(d){set[d]=1});var cur=set[today]?today:addDays(today,-1),n=0;while(set[cur]){n++;cur=addDays(cur,-1)}
 var best=0,run=0,sorted=x.days.slice().sort();for(var i=0;i<sorted.length;i++){if(i>0&&addDays(sorted[i-1],1)===sorted[i])run++;else run=1;if(run>best)best=run}return {cur:n,best:best}}
function render(){var today=U.today();$('today').textContent=today;var l=$('list');l.textContent='';$('empty').hidden=H.length>0;
 H.forEach(function(x,i){var s=streak(x,today),has=x.days.indexOf(today)>=0;
  var dots=h('div',{style:'display:flex;gap:3px;flex-wrap:wrap','aria-label':'Last 14 days'});for(var k=13;k>=0;k--){var d=addDays(today,-k);dots.appendChild(h('span',{title:d,'data-day':d,style:'width:14px;height:14px;border-radius:3px;background:'+(x.days.indexOf(d)>=0?'#0f766e':'#e2e8f0')}))}
  l.appendChild(h('div',{style:'display:flex;justify-content:space-between;align-items:center;gap:.8rem;flex-wrap:wrap;padding:.7rem 0;border-bottom:1px solid #e2e8f0'},[
   h('div',{style:'min-width:180px'},[h('strong',{text:x.name}),h('div',{class:'mut','data-streak':i,text:'Streak '+s.cur+' day'+(s.cur===1?'':'s')+' · best '+s.best+' · total '+x.days.length}),dots]),
   h('div',{class:'actions'},[h('button',{class:has?'ghost':'btn','data-tick':i,'aria-pressed':has,text:has?'Done today (undo)':'Mark done today'}),h('button',{class:'x','data-del':i,text:'Delete'})])]))})}
$('f').addEventListener('submit',function(e){e.preventDefault();var v=$('name').value.trim(),er=$('err');
 if(!v){er.textContent='Enter a habit name.';er.hidden=false;return}if(H.some(function(x){return x.name.toLowerCase()===v.toLowerCase()})){er.textContent='That habit already exists.';er.hidden=false;return}
 if(H.length>=30){er.textContent='Limit is 30 habits.';er.hidden=false;return}er.hidden=true;H.push({name:v,days:[]});$('name').value='';save();render()});
$('list').addEventListener('click',function(e){var t=e.target.getAttribute('data-tick'),d=e.target.getAttribute('data-del'),today=U.today();
 if(t!=null){var x=H[+t],i=x.days.indexOf(today);if(i>=0)x.days.splice(i,1);else x.days.push(today);save();render()}
 if(d!=null){if(confirm('Delete this habit and its history?')){H.splice(+d,1);save();render()}}});
$('exp').addEventListener('click',function(){var rows=[['habit','date']];H.forEach(function(x){x.days.slice().sort().forEach(function(d){rows.push([x.name,d])})});U.download('habits.csv',U.toCSV(rows))});
render();window.__hb={streak:streak,H:function(){return H}};
})();
