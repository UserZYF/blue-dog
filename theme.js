window.自定义块标菜单 = {};

const 注册自定义块标菜单 = function (块类型, 菜单文字,菜单图标, 回调函数) {
  自定义块标菜单[块类型] ? null : (自定义块标菜单[块类型] = {});
  自定义块标菜单[块类型][菜单文字]
    ? null
    : (自定义块标菜单[块类型][菜单文字] = {});
  自定义块标菜单[块类型][菜单文字]["回调函数"] = 回调函数;
  自定义块标菜单[块类型][菜单文字]["菜单文字"] = 菜单文字;
  自定义块标菜单[块类型][菜单文字]["菜单图标"] = 菜单图标;

};

const 判定目标并添加菜单项目 = function (event) {
  let 父元素 = event.target.parentElement;
  if (父元素.getAttribute("draggable") == "true") {
    扩展菜单(父元素);
  } else if (父元素.parentElement.getAttribute("draggable") == "true") {
    扩展菜单(父元素.parentElement);
  }
};

window.addEventListener("mousedown", 判定目标并添加菜单项目);

const 扩展菜单 = function (父元素) {
  if (自定义块标菜单[父元素.getAttribute("data-type")]) {
    自定义块标菜单.当前块id = 父元素.getAttribute("data-node-id");
    自定义块标菜单.当前块类型 = 父元素.getAttribute("data-type");
    自定义块标菜单.全局菜单定时器 = setTimeout(注入列表菜单项目, 10);
  }
};

const 注入列表菜单项目 = function () {
  let 块标菜单 = document.getElementById("commonMenu");
  let 最后项 = 块标菜单.querySelector(".b3-menu__item--readonly");
  if (最后项) {
    clearTimeout(自定义块标菜单.全局菜单定时器);

    console.log(最后项);
    console.log(自定义块标菜单);
    for (let 菜单项目 in 自定义块标菜单[自定义块标菜单.当前块类型]) {
      console.log(菜单项目);
      菜单项目
        ? 块标菜单.insertBefore(
            生成列表菜单项目(
              自定义块标菜单[自定义块标菜单.当前块类型][菜单项目]
            ),
            最后项
          )
        : null;
    }
  } else {
    自定义块标菜单.全局菜单定时器 = setTimeout(注入列表菜单项目, 10);
  }
};

const 生成列表菜单项目 = function (菜单项目) {
  let button = document.createElement("button");
  button.className = "b3-menu__item diy";
  console.log(菜单项目);
  button.onclick = () => 菜单项目.回调函数(自定义块标菜单.当前块id);
  
  button.setAttribute("data-node-id", 自定义块标菜单.当前块id);
  button.innerHTML = `<svg class="b3-menu__icon" style=""><use xlink:href="${菜单项目.菜单图标}"></use></svg><span class="b3-menu__label">${菜单项目.菜单文字}</span>`;
  return button;
};

const 转换列表为导图 = function (块id) {
  let blocks = document.querySelectorAll(
    `.protyle-wysiwyg [data-node-id="${块id}"]`
  );
  if (blocks[0]) {
    blocks.forEach((block) => block.setAttribute("custom-f", "dt"));
  }
};
const 转换列表为树状表格 = function (块id) {
  let blocks = document.querySelectorAll(
    `.protyle-wysiwyg [data-node-id="${块id}"]`
  );
  if (blocks[0]) {
    blocks.forEach((block) => block.setAttribute("custom-f", "bg"));
  }
};
const 转换列表为默认视图 = function (块id) {
  let blocks = document.querySelectorAll(
    `.protyle-wysiwyg [data-node-id="${块id}"]`
  );
  if (blocks[0]) {
    blocks.forEach((block) => block.setAttribute("custom-f", ""));
  }
};
const 转换标题为子文档 = async function (块id) {
  let 块数据 = null;
  let data = {
    stmt: `select * from blocks where id = '${块id}'`,
  };
  let resData = null;
  await fetch("/api/query/sql", {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      Authorization: `Token `,
    },
  }).then(function (response) {
    resData = response.json();
  });
  console.log(await resData)
  块数据 =(await resData)["data"][0];
  let data1 = {
    pushMode: 0,
    srcHeadingID: 块id,
    targetNoteBook: 块数据.box,
    targetPath: 块数据.path,
  };
  await fetch("/api/filetree/heading2Doc", {
    body: JSON.stringify(data1),
    method: "POST",
    headers: {
      Authorization: `Token `,
    },
  }).then()
  let 块标菜单 = document.getElementById("commonMenu");
  块标菜单.setAttribute("class","b3-menu fn__none")
};
const 运行代码块到文档 = function(块id){
       let block = document.querySelector(
        `.protyle-wysiwyg [data-node-id="${块id}"] div[contenteditable="true"]`
      );
      let oldscript =document.querySelector(`[data-src-id= "${块id}"]`)
      oldscript?oldscript.remove():null
      let script = document.createElement('script');
      script.setAttribute('f', "dt");
      script.setAttribute('data-src-id', 块id);
      script.innerText=block.innerText
      document.head.appendChild(script);
}
const 应用代码块到文档 = function(块id){
    let block = document.querySelector(
     `.protyle-wysiwyg [data-node-id="${块id}"] div[contenteditable="true"]`
   );
   let oldstyle =document.querySelector(`[data-src-id= "${块id}"]`)
   oldstyle?oldstyle.remove():null
   let style = document.createElement('style');
   style.setAttribute('data-src-id', 块id);
   style.innerText=block.innerText
   document.head.appendChild(style);
}
注册自定义块标菜单("NodeList", "显示为导图","#iconList", 转换列表为导图);
注册自定义块标菜单("NodeList", "显示为树状表格","#iconList", 转换列表为树状表格);
注册自定义块标菜单("NodeList", "显示为默认","#iconList", 转换列表为默认视图);
注册自定义块标菜单("NodeHeading", "转换为子文档","#iconFile" ,转换标题为子文档);
注册自定义块标菜单("NodeCodeBlock", "运行到当前窗口","#iconCode" ,运行代码块到文档);
注册自定义块标菜单("NodeCodeBlock", "应用css到当前窗口","#iconCode" ,应用代码块到文档);
