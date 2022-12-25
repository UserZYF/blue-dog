// Dark+主题功能，Ctrl+鼠标滚轮可以放大缩小内容
// window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/wheel.js"), undefined, true);

/***js form Morgan***/
/****************************思源API操作**************************/
async function 设置思源块属性(内容块id, 属性对象) {
  let url = '/api/attr/setBlockAttrs'
  return 解析响应体(向思源请求数据(url, {
    id: 内容块id,
    attrs: 属性对象,
  }))
}
async function 向思源请求数据(url, data) {
  let resData = null
  await fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      Authorization: `Token ''`,
    }
  }).then(function (response) { resData = response.json() })
  return resData
}
async function 解析响应体(response) {
  let r = await response
  return r.code === 0 ? r.data : null
}


/****UI****/
function ViewSelect(selectid, selecttype) {
  let button = document.createElement("button")
  button.id = "viewselect"
  button.className = "b3-menu__item"
  button.innerHTML = '<svg class="b3-menu__icon" style="null"><use xlink:href="#iconGlobalGraph"></use></svg><span class="b3-menu__label" style="">视图选择</span><svg class="b3-menu__icon b3-menu__icon--arrow" style="null"><use xlink:href="#iconRight"></use></svg></button>'
  button.appendChild(SubMenu(selectid, selecttype))
  return button
}

function SubMenu(selectid, selecttype, className = 'b3-menu__submenu') {
  let node = document.createElement('div');
  node.className = className;
  if (selecttype == "NodeList") {
    node.appendChild(GraphView(selectid))
    node.appendChild(TableView(selectid))
    node.appendChild(kanbanView(selectid))
    node.appendChild(DefaultView(selectid))
  }
  if (selecttype == "NodeTable") {
    node.appendChild(FixWidth(selectid))
    node.appendChild(AutoWidth(selectid))
    node.appendChild(Removeth(selectid))
    node.appendChild(Defaultth(selectid))
  }
  return node;
}

function GraphView(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "f")
  button.setAttribute("custom-attr-value", "dt")

  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconFiles"></use></svg><span class="b3-menu__label">转换为导图</span>`
  button.onclick = ViewMonitor
  return button
}
function TableView(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "f")
  button.setAttribute("custom-attr-value", "bg")

  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconTable"></use></svg><span class="b3-menu__label">转换为表格</span>`
  button.onclick = ViewMonitor
  return button
}
function kanbanView(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "f")
  button.setAttribute("custom-attr-value", "kb")

  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconMenu"></use></svg><span class="b3-menu__label">转换为看板</span>`
  button.onclick = ViewMonitor
  return button
}
function DefaultView(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.onclick = ViewMonitor
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "f")
  button.setAttribute("custom-attr-value", '')

  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconList"></use></svg><span class="b3-menu__label">恢复为列表</span>`
  return button
}
function FixWidth(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.onclick = ViewMonitor
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "f")
  button.setAttribute("custom-attr-value", "")

  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconTable"></use></svg><span class="b3-menu__label">页面宽度</span>`
  return button
}
function AutoWidth(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "f")
  button.setAttribute("custom-attr-value", "auto")
  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconTable"></use></svg><span class="b3-menu__label">自动宽度</span>`
  button.onclick = ViewMonitor
  return button
}
function Removeth(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.onclick = ViewMonitor
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "t")
  button.setAttribute("custom-attr-value", "biaotou")

  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconTable"></use></svg><span class="b3-menu__label">取消表头样式</span>`
  return button
}
function Defaultth(selectid) {
  let button = document.createElement("button")
  button.className = "b3-menu__item"
  button.setAttribute("data-node-id", selectid)
  button.setAttribute("custom-attr-name", "t")
  button.setAttribute("custom-attr-value", "")
  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="#iconTable"></use></svg><span class="b3-menu__label">默认表头样式</span>`
  button.onclick = ViewMonitor
  return button
}
function MenuSeparator(className = 'b3-menu__separator') {
  let node = document.createElement('button');
  node.className = className;
  return node;
}

/* 操作 */

/**
 * 获得所选择的块对应的块 ID
 * @returns {string} 块 ID
 * @returns {
 *     id: string, // 块 ID
 *     type: string, // 块类型
 *     subtype: string, // 块子类型(若没有则为 null)
 * }
 * @returns {null} 没有找到块 ID */
function getBlockSelected() {
  let node_list = document.querySelectorAll('.protyle:not(.fn__none)>.protyle-content .protyle-wysiwyg--select');
  if (node_list.length === 1 && node_list[0].dataset.nodeId != null) return {
    id: node_list[0].dataset.nodeId,
    type: node_list[0].dataset.type,
    subtype: node_list[0].dataset.subtype,
  };
  return null;
}

function ClickMonitor() {
  window.addEventListener('mouseup', MenuShow)
}

function MenuShow() {
  setTimeout(() => {
    let selectinfo = getBlockSelected()
    if (selectinfo) {
      let selecttype = selectinfo.type
      let selectid = selectinfo.id
      if (selecttype == "NodeList" || selecttype == "NodeTable") {
        setTimeout(() => InsertMenuItem(selectid, selecttype), 0)
      }
    }
  }, 0);
}


function InsertMenuItem(selectid, selecttype) {
  let commonMenu = document.getElementById("commonMenu")
  let readonly = commonMenu.querySelector(".b3-menu__item--readonly")
  let selectview = commonMenu.querySelector('[id="viewselect"]')
  if (readonly) {
    if (!selectview) {
      commonMenu.insertBefore(ViewSelect(selectid, selecttype), readonly)
      commonMenu.insertBefore(MenuSeparator(), readonly)
    }
  }
}

function ViewMonitor(event) {
  let id = event.currentTarget.getAttribute("data-node-id")
  let attrName = 'custom-' + event.currentTarget.getAttribute("custom-attr-name")
  let attrValue = event.currentTarget.getAttribute("custom-attr-value")
  let blocks = document.querySelectorAll(`.protyle-wysiwyg [data-node-id="${id}"]`)
  if (blocks) {
    blocks.forEach(block => block.setAttribute(attrName, attrValue))
  }
  let attrs = {}
  attrs[attrName] = attrValue
  设置思源块属性(id, attrs)
}

setTimeout(() => ClickMonitor(), 1000)



const config = {
  theme: {
    regs: {
      // 正则表达式
      fontsize: /(?<=\.b3-typography|protyle-wysiwyg|protyle-title\s*\{\s*font-size\s*:\s*)(\d+)(?=px(?:\s+\!important)?(?:\s*;|\}))/,
    },
    wheel: {
      enable: true, // 滚轮功能开关
      zoom: {
        enable: true, // 滚轮缩放功能开关
        threshold: 100, // 滚轮缩放阈值
        min: 9, // 最小字号(px)
        max: 72, // 最大字号(px)
      },
    },
    hotkeys: {
      wheel: {
        zoom: {
          // 鼠标滚轮缩放(Ctrl + wheel)
          enable: true,
          CtrlCmd: true,
          WinCtrl: false,
          Shift: false,
          Alt: false,
          type: 'mousewheel',
        },
      },
    },
  },
};

/**
* 设置编辑器字号
* REF https://github.com/siyuan-note/siyuan/blob/7fbae2f7438a313837218e419468e0b189163c6a/app/src/util/assets.ts#L120-L145
* @param {number} fontSize 字号
* @return {number} 设置后的字号
* @return {null} 没有找到字号
*/
function setFontSize(fontSize) {
  let style = document.getElementById('editorFontSize');
  if (style) {
    const height = Math.floor(fontSize * 1.625);
    style.innerHTML = `
.b3-typography, .protyle-wysiwyg, .protyle-title {font-size:${fontSize}px !important}
.b3-typography code:not(.hljs), .protyle-wysiwyg span[data-type~=code] { font-variant-ligatures: ${window.siyuan.config.editor.codeLigatures ? "normal" : "none"} }
.li > .protyle-action {height:${height + 8}px;line-height: ${height + 8}px}
.protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h1, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h2, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h3, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h4, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h5, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h6 {line-height:${height + 8}px;}
.protyle-wysiwyg [data-node-id].li > .protyle-action:after {height: ${fontSize}px;width: ${fontSize}px;margin:-${fontSize / 2}px 0 0 -${fontSize / 2}px}
.protyle-wysiwyg [data-node-id].li > .protyle-action svg {height: ${Math.max(14, fontSize - 8)}px}
.protyle-wysiwyg [data-node-id] [spellcheck="false"] {min-height:${height}px}
.protyle-wysiwyg .li {min-height:${height + 8}px}
.protyle-gutters button svg {height:${height}px}
.protyle-wysiwyg img.emoji, .b3-typography img.emoji {width:${height - 8}px}
.protyle-wysiwyg .h1 img.emoji, .b3-typography h1 img.emoji {width:${Math.floor(fontSize * 1.75 * 1.25)}px}
.protyle-wysiwyg .h2 img.emoji, .b3-typography h2 img.emoji {width:${Math.floor(fontSize * 1.55 * 1.25)}px}
.protyle-wysiwyg .h3 img.emoji, .b3-typography h3 img.emoji {width:${Math.floor(fontSize * 1.38 * 1.25)}px}
.protyle-wysiwyg .h4 img.emoji, .b3-typography h4 img.emoji {width:${Math.floor(fontSize * 1.25 * 1.25)}px}
.protyle-wysiwyg .h5 img.emoji, .b3-typography h5 img.emoji {width:${Math.floor(fontSize * 1.13 * 1.25)}px}
.protyle-wysiwyg .h6 img.emoji, .b3-typography h6 img.emoji {width:${Math.floor(fontSize * 1.25)}px}
.b3-typography:not(.b3-typography--default), .protyle-wysiwyg,.protyle,.p, .protyle-title, .protyle-title__input{font-family: "${window.siyuan.config.editor.fontFamily}",  "D-DIN","MiSans","quote", "Helvetica Neue", "Luxi Sans", "DejaVu Sans", "Hiragino Sans GB", "Microsoft Yahei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols" !important;}
`;
    return parseInt(config.theme.regs.fontsize.exec(style.innerHTML));
  }
  return null;
}

/* 字号更改 */
function changeFontSize(delta) {
  let size = delta / config.theme.wheel.zoom.threshold | 0;
  let old_size = window.siyuan.config.editor.fontSize;
  let new_size = Math.max(Math.min(old_size + size, config.theme.wheel.zoom.max), config.theme.wheel.zoom.min);
  new_size = setFontSize(new_size);
  if (new_size) window.siyuan.config.editor.fontSize = new_size;
}

function isEvent(event, key) {
  return (event.type === key.type
    && event.altKey === key.Alt
    && event.shiftKey === key.Shift
    && (event.ctrlKey || event.metaKey) === key.CtrlCmd
    && (event.ctrlKey && event.metaKey) === key.WinCtrl
  )
}

document.addEventListener('mousewheel', e => {
  if (isEvent(e, config.theme.hotkeys.wheel.zoom)) {
    e.stopPropagation();
    setTimeout(() => changeFontSize(e.wheelDeltaY), 0);
  }
}, true);





document
  .querySelector("div.dock span[data-type=backlink]")
  .addEventListener("click", function () {
    setTimeout(setAllExpand(), 500);
  });

var setAllExpand = function () {
  if (document.getElementById("backlink_allexpand")) {
    return;
  }
  // 反链全部展开图标
  var barSearch = document.querySelector(
    ".sy__backlink span[data-type=collapse]"
  );
  barSearch.insertAdjacentHTML(
    "beforebegin",
    `<span id="backlink_allexpand" data-type="collapse_expand" style="width:22px;height:22px;padding-right:2px;" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="反链一键展开"><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="1280.000000pt" height="1194.000000pt" viewBox="0 0 1280.000000 1194.000000"
    preserveAspectRatio="xMidYMid meet">
   <metadata>
   Created by potrace 1.15, written by Peter Selinger 2001-2017
   </metadata>
   <g transform="translate(0.000000,1194.000000) scale(0.100000,-0.100000)"
   fill="#00000" stroke="none">
   <path d="M3075 11863 c-622 -387 -1140 -833 -1582 -1363 -925 -1106 -1440
   -2454 -1489 -3900 l-7 -200 2241 0 2242 0 0 45 c0 234 89 587 206 815 160 313
   417 597 695 766 l60 36 -33 58 c-196 345 -2204 3819 -2208 3819 -3 -1 -59 -34
   -125 -76z"/>
   <path d="M9534 11832 c-33 -59 -533 -927 -1112 -1929 -579 -1003 -1053 -1827
   -1054 -1832 -2 -5 43 -40 99 -77 378 -255 652 -631 778 -1069 34 -118 62 -286
   71 -419 l7 -106 2240 0 2240 0 -7 200 c-68 1986 -1022 3787 -2631 4969 -147
   108 -552 373 -568 371 -1 0 -29 -49 -63 -108z"/>
   <path d="M6210 7666 c-470 -85 -824 -366 -995 -790 -159 -397 -112 -829 130
   -1197 63 -95 239 -271 335 -334 224 -148 452 -218 715 -218 165 -1 230 9 380
   54 207 64 367 161 526 319 144 143 236 288 304 478 237 664 -121 1403 -790
   1630 -49 17 -124 38 -165 47 -102 22 -344 28 -440 11z"/>
   <path d="M5436 4731 c-11 -20 -1530 -2652 -1843 -3194 -206 -356 -376 -654
   -379 -661 -7 -17 76 -67 311 -186 731 -370 1474 -583 2326 -667 249 -24 844
   -24 1098 1 845 81 1594 296 2326 666 235 119 318 169 311 186 -4 11 -1949
   3386 -2168 3762 l-60 103 -53 -30 c-82 -47 -251 -116 -363 -149 -175 -53 -334
   -75 -532 -76 -320 -1 -588 60 -864 199 -58 29 -108 50 -110 46z"/>
   </g>
   </svg></span>`
  );
  let backLinkAllExpand = document.getElementById("backlink_allexpand");

  backLinkAllExpand.addEventListener(
    "click",
    function (e) {
      var list = document.querySelector(
        "div.backlinkList.fn__flex-1 > ul"
      ).children;
      for (var i = 0; i < list.length; i++) {
        if (
          list[i].nextSibling &&
          (list[i].nextSibling.tagName == "LI" ||
            list[i].nextSibling.className.indexOf("fn__none")) > -1
        ) {
          list[i].click();
        }
        if (i == list.length - 1) {
          list[i].click();
        }
      }
    },
    false
  );
  backLinkAllExpand.addEventListener(
    "click",
    function (e) {
      e.stopPropagation();
    },
    false
  );

  // 提及全部展开图标
  var barSearch = document.querySelector(
    ".sy__backlink span[data-type=mCollapse]"
  );
  barSearch.insertAdjacentHTML(
    "beforebegin",
    `<span id="m_backlink_allexpand" data-type="collapse_expand" style="width:22px;height:22px;padding-right:2px;" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="提及一键展开"><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="1280.000000pt" height="1194.000000pt" viewBox="0 0 1280.000000 1194.000000"
    preserveAspectRatio="xMidYMid meet">
   <metadata>
   Created by potrace 1.15, written by Peter Selinger 2001-2017
   </metadata>
   <g transform="translate(0.000000,1194.000000) scale(0.100000,-0.100000)"
   fill="#00000" stroke="none">
   <path d="M3075 11863 c-622 -387 -1140 -833 -1582 -1363 -925 -1106 -1440
   -2454 -1489 -3900 l-7 -200 2241 0 2242 0 0 45 c0 234 89 587 206 815 160 313
   417 597 695 766 l60 36 -33 58 c-196 345 -2204 3819 -2208 3819 -3 -1 -59 -34
   -125 -76z"/>
   <path d="M9534 11832 c-33 -59 -533 -927 -1112 -1929 -579 -1003 -1053 -1827
   -1054 -1832 -2 -5 43 -40 99 -77 378 -255 652 -631 778 -1069 34 -118 62 -286
   71 -419 l7 -106 2240 0 2240 0 -7 200 c-68 1986 -1022 3787 -2631 4969 -147
   108 -552 373 -568 371 -1 0 -29 -49 -63 -108z"/>
   <path d="M6210 7666 c-470 -85 -824 -366 -995 -790 -159 -397 -112 -829 130
   -1197 63 -95 239 -271 335 -334 224 -148 452 -218 715 -218 165 -1 230 9 380
   54 207 64 367 161 526 319 144 143 236 288 304 478 237 664 -121 1403 -790
   1630 -49 17 -124 38 -165 47 -102 22 -344 28 -440 11z"/>
   <path d="M5436 4731 c-11 -20 -1530 -2652 -1843 -3194 -206 -356 -376 -654
   -379 -661 -7 -17 76 -67 311 -186 731 -370 1474 -583 2326 -667 249 -24 844
   -24 1098 1 845 81 1594 296 2326 666 235 119 318 169 311 186 -4 11 -1949
   3386 -2168 3762 l-60 103 -53 -30 c-82 -47 -251 -116 -363 -149 -175 -53 -334
   -75 -532 -76 -320 -1 -588 60 -864 199 -58 29 -108 50 -110 46z"/>
   </g>
   </svg></span>`
  );
  let mBackLinkAllExpand = document.getElementById("m_backlink_allexpand");

  mBackLinkAllExpand.addEventListener(
    "click",
    function (e) {
      var list = document.querySelector(
        "div.backlinkMList.fn__flex-1 > ul"
      ).children;
      for (var i = 0; i < list.length; i++) {
        if (
          list[i].nextSibling &&
          (list[i].nextSibling.tagName == "LI" ||
            list[i].nextSibling.className.indexOf("fn__none")) > -1
        ) {
          list[i].click();
        }
        if (i == list.length - 1) {
          list[i].click();
        }
      }
    },
    false
  );
  mBackLinkAllExpand.addEventListener(
    "click",
    function (e) {
      e.stopPropagation();
    },
    false
  );
};
setTimeout(setAllExpand(), 500);




// 日历功能
function initCalendarPanel() {

  // 日历面板================================================================================================================

  var barSearch = document.getElementById("barSearch");
  barSearch.insertAdjacentHTML(
    "beforebegin",
    '<div id="calendar"class="toolbar__item b3-tooltips b3-tooltips__se" aria-label="日历" ></div>'
  );
  let calendarIcon = document.getElementById("calendar");

  barSearch.insertAdjacentHTML(
    "afterend",
    ` <div
    data-node-index="1"
    data-type="NodeWidget"
    class="iframe"
    data-subtype="widget"
  >
    <div class="iframe-content">
      <iframe id="calendarPanel" style="visibility:hidden;position: fixed; z-index: 1000; top: 225px; left: 170px;  width: 300px; height: 360px; background: white; box-shadow: rgba(0, 0, 0, 0.55) 0px 0px 6px 0px;  transform: translate(-50%, -50%); overflow: auto;" src="/widgets/日历" data-src="/widgets/日历" data-subtype="widget" ></iframe>
    </div>
  </div>`
  );

  let calendarPanel = document.getElementById("calendarPanel");

  calendarIcon.innerHTML = `<svg t="1663295440835" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4890" width="200" height="200"><path d="M146.285714 0h731.428572a146.285714 146.285714 0 0 1 146.285714 146.285714v731.428572a146.285714 146.285714 0 0 1-146.285714 146.285714H146.285714a146.285714 146.285714 0 0 1-146.285714-146.285714V146.285714a146.285714 146.285714 0 0 1 146.285714-146.285714z m0 73.142857a73.142857 73.142857 0 0 0-73.142857 73.142857v731.428572a73.142857 73.142857 0 0 0 73.142857 73.142857h731.428572a73.142857 73.142857 0 0 0 73.142857-73.142857V146.285714a73.142857 73.142857 0 0 0-73.142857-73.142857H146.285714z" fill="#ffffff" p-id="4891"></path><path d="M0 219.428571h1024v73.142858H0V219.428571z m987.428571 36.571429L950.857143 292.571429V219.428571l36.571428 36.571429z" fill="#ffffff" p-id="4892"></path><path d="M475.428571 438.857143h73.142858a36.571429 36.571429 0 0 1 0 73.142857h-73.142858a36.571429 36.571429 0 0 1 0-73.142857z m219.428572 0h73.142857a36.571429 36.571429 0 1 1 0 73.142857h-73.142857a36.571429 36.571429 0 0 1 0-73.142857z m-438.857143 146.285714h73.142857a36.571429 36.571429 0 0 1 0 73.142857h-73.142857a36.571429 36.571429 0 0 1 0-73.142857z m438.857143 0h73.142857a36.571429 36.571429 0 1 1 0 73.142857h-73.142857a36.571429 36.571429 0 0 1 0-73.142857z m-438.857143 146.285714h73.142857a36.571429 36.571429 0 1 1 0 73.142858h-73.142857a36.571429 36.571429 0 1 1 0-73.142858z m438.857143 0h73.142857a36.571429 36.571429 0 1 1 0 73.142858h-73.142857a36.571429 36.571429 0 1 1 0-73.142858z m-219.428572 0h73.142858a36.571429 36.571429 0 1 1 0 73.142858h-73.142858a36.571429 36.571429 0 1 1 0-73.142858z m0-146.285714h73.142858a36.571429 36.571429 0 0 1 0 73.142857h-73.142858a36.571429 36.571429 0 0 1 0-73.142857z" fill="#ffffff" p-id="4893"></path></svg>`;

  calendarIcon.addEventListener(
    "click",
    function (e) {
      e.stopPropagation();
      if (calendarPanel.style.visibility === "hidden") {
        calendarPanel.style.visibility = "visible";
      } else {
        calendarPanel.style.visibility = "hidden";
      }
    },
    false
  );

  calendarPanel.addEventListener(
    "click",
    function (e) {
      e.stopPropagation();
    },
    false
  );

  // 隐藏历史面板
  function hideCalendarPanel() {
    if (calendarPanel.style.visibility === "visible") {
      calendarPanel.style.visibility = "hidden";
    }
  }
  // 点击其他区域时，隐藏日历面板
  window.addEventListener("click", hideCalendarPanel, false);



}
window.onload = setTimeout(initCalendarPanel, 500);
