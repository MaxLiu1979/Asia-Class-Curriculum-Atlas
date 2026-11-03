const $ = id => document.getElementById(id);
const labels = ['浙江基础','高一普高主课','高一学科英语','高二高三 NCUK'];
let subject = '全部';
let selected = null;
let stage = 0;
function node(tag,text,cls) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (cls) el.className = cls;
  return el;
}
function button(label,pressed,action) {
  const el = node('button',label);
  el.type = 'button';
  el.setAttribute('aria-pressed',String(pressed));
  el.onclick = action;
  return el;
}
function showDetail() {
  const panel = $('detail');
  panel.replaceChildren();
  if (!selected) {
    panel.append(node('p','没有找到对应条目，可换一个词再试。'));
    return;
  }
  const [id,sub,title,base,school,english,target,gap,task,relation] = selected;
  const values = [base,school,english,target+'。'+gap];
  const links = node('div','','chain');
  labels.forEach((label,i) => {
    links.append(button(label,stage===i,event => {
      stage=i;
      showDetail();
      $('detail').querySelectorAll('.chain button')[i].focus();
    }));
  });
  const info = node('div','','stage');
  info.append(node('b',labels[stage]),node('p',values[stage]));
  const sample = node('div','','sample');
  sample.append(node('h4','衔接练习与复查'),node('p',task));
  const comparison = node('details','');
  comparison.append(node('summary','展开四阶段对应表'));
  const list = node('dl','');
  labels.forEach((label,i) => list.append(node('dt',label),node('dd',values[i])));
  comparison.append(list);
  panel.append(node('div',sub+' · '+id+' · '+relation,'meta'),node('h3',title),links,info,node('p','目标定位  '+target,'meta'),comparison,sample);
}
function render() {
  $('filters').replaceChildren(...['全部','数学','物理','化学','英语'].map(sub =>
    button(sub,subject===sub,() => {subject=sub;render();})
  ));
  const q = $('query').value.trim().toLowerCase();
  const visible = rows.filter(row => (subject==='全部'||row[1]===subject) && row.join(' ').toLowerCase().includes(q));
  if (!visible.includes(selected)) {
    selected = visible[0] || null;
    stage = 0;
  }
  $('points').replaceChildren(...visible.map(row => button(row[2],row===selected,() => {selected=row;stage=0;render();})));
  showDetail();
}
$('query').oninput = render;
function showIntake(index, focusButton = false) {
  $('intake-tabs').replaceChildren(...intakeRoutes.map((item,i) =>
    button(item[0],i===index,() => showIntake(i,true))
  ));
  if (focusButton) $('intake-tabs').children[index].focus();
  const [,title,check,action,ids] = intakeRoutes[index];
  const sampleList = node('div','','filters');
  ids.forEach(id => {
    const row = rows.find(point => point[0]===id);
    sampleList.append(button(row[1]+' · '+row[2],false,() => {
      subject = row[1];
      selected = row;
      stage = 0;
      $('query').value = '';
      render();
      $('atlas').focus();
      $('atlas').scrollIntoView();
    }));
  });
  $('intake-detail').replaceChildren(node('h3',title),node('b','先核对'),node('p',check),node('b','怎么接与怎么复查'),node('p',action),node('b','查看对应知识点'),sampleList);
}
showIntake(0);
sources.forEach(([title,url,note]) => {
  const li = node('li','');
  const a = node('a',title);
  a.href=url;
  li.append(a,node('div',note,'meta'));
  $('refs').append(li);
});
render();

