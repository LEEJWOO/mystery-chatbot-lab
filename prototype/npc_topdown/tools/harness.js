// 브라우저 시험용: sendMessage를 가로채 화면에 보여주고, 붙여넣은 AI 태그로 컴포넌트를 새로 마운트한다.
(function () {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  let key = 0;
  function mount(props) { key++; root.render(React.createElement(Troemerei, Object.assign({ key: 'k' + key }, props))); }
  window.sendMessage = function (msg) { document.getElementById('sentBox').textContent = '[전송된 인계]\n' + msg; window.__lastSent = msg; };
  window.__mountTag = function (tag) {
    const get = name => { const m = new RegExp(name + "='([^']*)'").exec(tag); return m ? m[1] : ''; };
    mount({ s: get('s'), t: get('t'), d: get('d'), e: get('e'), k: get('k'), f: get('f') });
  };
  document.getElementById('apply').onclick = () => window.__mountTag(document.getElementById('reply').value);
  mount({});
})();
