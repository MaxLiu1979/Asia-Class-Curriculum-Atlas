const semesterMap = $('semester-map');
const semesterDetail = $('semester-detail');
function pointButton(id) {
  const row = rows.find(item => item[0]===id);
  return button(row[2],false,() => {
    subject = row[1];
    selected = row;
    stage = 0;
    $('query').value = '';
    render();
    $('atlas').focus();
    $('atlas').scrollIntoView();
  });
}
function showSemester(index,restoreFocus=false) {
  semesterMap.replaceChildren(...semesterPlan.map(([term,title],i) =>
    button(term+' · '+title,i===index,() => showSemester(i,true))
  ));
  if (restoreFocus) semesterMap.children[index].focus();
  const [term,title,intro,tracks] = semesterPlan[index];
  const grid = node('div','','term-tracks');
  tracks.forEach(([subject,title,description,outcome,ids]) => {
    const card = node('article','','term-track');
    const links = node('div','','filters');
    links.append(...ids.split(' ').map(pointButton));
    card.append(node('div',subject,'eyebrow'),node('h4',title),node('p',description),node('b','学完拿什么复查'),node('p',outcome),links);
    grid.append(card);
  });
  semesterDetail.replaceChildren(node('div','衔接教研建议 · '+term,'meta'),node('h3',title),node('p',intro),grid);
}
showSemester(0);

const moduleSelect = $('module-select');
const moduleSearch = $('module-search');
const modules = [...new Set(moduleIndex.map(row => row[1]))];
const names = {
  IFYPH005:'物理', IFYCH004:'化学', IFYEAP004:'学术英语 EAP',
  IFYBI004:'生物', IFYEC004:'经济', IFYBS005:'商务财务 LO4',
  IFYIM001:'综合数学', IFYTM001:'技术数学', IFYFM005:'进一步数学'
};
modules.forEach(code => {
  const short = code.split(' ')[0];
  const option = node('option',names[short]+' · '+short);
  option.value=code;
  moduleSelect.append(option);
});
function showModule() {
  const q=moduleSearch.value.trim().toLowerCase();
  const hits=moduleIndex.filter(row => row[1]===moduleSelect.value && row.join(' ').toLowerCase().includes(q));
  $('module-count').textContent='当前 '+hits.length+' 条';
  const list=$('module-results');
  list.replaceChildren();
  if (!hits.length) list.append(node('p','此模块没有匹配条目。'));
  hits.forEach(([,code,criteria,topic,pages]) => {
    const card=node('article','','module-row');
    card.append(node('strong',topic),node('div',code.split(' ')[0]+' · '+criteria.replace(/\n/g,' / ')+' · PDF '+pages.join('、'),'meta'));
    list.append(card);
  });
}
moduleSelect.value=modules.find(code => code.startsWith('IFYTM001'));
moduleSelect.onchange=showModule;
moduleSearch.oninput=showModule;
showModule();
