"use strict";
var account = "123456";
var isEdit = false;  //是否进行编辑
var title1, title2; // 选中的一二级标题
var item_title;  //选中的item标题
window.onload = function() {
	//新增分类
	var add1 = document.getElementsByClassName("add")[0];
    add1.onclick = function() {
        var person1 = prompt("请输入新分类的名字：", "" );
        if(person1 != null && person1 != "") {
			if (title1) {
				var info = JSON.parse(getStore(account))
				var i = info.firstTitles.findIndex((value) => value.name == title1)
				var secondTitle = createInfo(person1)
				console.log(secondTitle)
				if(!info.firstTitles[i].secondTitles){ // 第一次添加二级标题
					info.firstTitles[i].secondTitles = [secondTitle]
				}else{
					info.firstTitles[i].secondTitles.push(secondTitle)
				}
				setStore(account, info)
				var aimFirstTitle = document.getElementsByClassName("item_background")[0]
				var ul = aimFirstTitle.nextElementSibling;
				console.log(ul)
				createSecondtitle(person1, ul, 0);
			}else{  // 设置一级标题
				if(!getStore(account)){ // 没有储存用户信息
					var content = createInfo(123456)
					setStore(account, content)
				}
				createFirstTitle(person1, 0);
				console.log(getStore(account).firstTitles)
				var firstTitle = createInfo(person1)
				var all = JSON.parse(getStore(account))
				if(!all.firstTitles){ // 第一次设置一级标题
					all.firstTitles = [firstTitle]
				}else{
					all.firstTitles.push(firstTitle)
				}
				setStore(account, all) 
			}
			 
        }  
    };
	
	document.getElementById("left-container").onclick = function() {
		var item_background = document.getElementsByClassName("item_background")[0]
		if(item_background){
			item_background.classList.remove("item_background")
			title1 = ""
		}
	}
	
	// 点击新增任务，显示右侧任务描述页面
	document.getElementsByClassName("add")[1].onclick = function() {
		showRight();
	}

	document.getElementById('wancheng').onclick = function() {
		var title = document.getElementsByClassName('title_background')[0].innerText;
		var content = JSON.parse(getStore(account));
		var index = titleIndex(content)
		var i = index[0]
		var j = index[1]
		var items = content.firstTitles[i].secondTitles[j].items
		var l = items.findIndex((value) => value.title == title)
		if(content.firstTitles[i].secondTitles[j].items[l].type === 0){
			if(confirm("确认是否完成")) {
				// var content = JSON.parse(getStore(account));
				// var index = titleIndex(content)
				// var i = index[0]
				// var j = index[1]
				// var items = content.firstTitles[i].secondTitles[j].items
				// var l = items.findIndex((value) => value.title == title)
				content.firstTitles[i].secondTitles[j].items[l].type = 1
				setStore(account, content)
				changeItemsNum(i, l, false)
				var right = document.getElementById("right");
					right.style.opacity = "0";
			}
		}
			
	}

	document.getElementById("bianji").onclick = function() {
		var li = document.getElementsByClassName('title_background')[0];
		showHide("inline", "none");
		document.getElementById("right_title").removeAttribute("readonly")
		document.getElementById("right_content").removeAttribute("readonly")
		document.getElementById("right_date").removeAttribute("readonly")
		isEdit = true
	}

	document.getElementById("all").onclick = function() {
		changeLicolor("all", "undones", "dids")
		var arr = getItems()
		if(arr){
			createItemsList(arr)
		}
	}

	document.getElementById("undones").onclick = function() {
		changeLicolor("undones", "all", "dids")
		var arr = getItems()
		if(arr){
			changeDid(arr, 0)
		}
	}

	document.getElementById('dids').onclick = function() {
		changeLicolor("dids", "all", "undones")
		var arr = getItems()
		if(arr){
			changeDid(arr, 1)
		}
	}
	
	document.getElementById("quxiao").onclick = function() {
		quxiao();
	}
	document.getElementById("queding").onclick = function() {
		queding();
	}
	
	showLeft()
}

function changeDid(arr, num) {  // 完成和未完成目录的显示
	var arrList = []
	for(var i = 0; i < arr.length; i++){
		if(arr[i].type == num){
			arrList.push(arr[i])
		}
	}
	if(arrList.length != 0){
		createItemsList(arrList)
	}else{
		var content = document.getElementById("content");
		if (content.children.length != 0) {
			content.removeChild(content.firstElementChild);
		}
	}
}

function getItems(){  //获得指定的item数据
	var content = JSON.parse(getStore(account))
	var index = titleIndex(content)
	var i = index[0]
	var j = index[1]
	var arr = content.firstTitles[i].secondTitles[j].items
		return arr
}

//完成状态标题背景颜色变化
function changeLicolor(id1, id2, id3) {
	document.getElementById(id1).classList.add("li_addcolor");
	document.getElementById(id2).classList.remove("li_addcolor");
	document.getElementById(id3).classList.remove("li_addcolor");
}

function createInfo(name){  // 创建标题数据
	return {
		"name": name,
		"num": 0
	}
}

function showLeft() { // 加载后显示左边信息
	var content =  JSON.parse(getStore(account))
	var left_p = document.getElementsByClassName("left-p")[0]
	if(content){
		left_p.innerHTML = "所有任务（<span>" + content.num + "</span>）"
		if(content.firstTitles){
			var firstTitles = content.firstTitles;
			for(var i = 0; i < firstTitles.length; i++){
				var ul = createFirstTitle(firstTitles[i].name, firstTitles[i].num)
				var secondTitles = firstTitles[i].secondTitles
				if(secondTitles){
					for(var j = 0; j < secondTitles.length; j++){
						var name = secondTitles[j].name
						var num = secondTitles[j].num
						createSecondtitle(name, ul, num)
					}
				}
			}
		}
	}else{
		left_p.innerHTML = "所有任务（<span>" + 0 + "</span>）"
	}
}

//添加一级标题
function createFirstTitle(person, num) {
    var li = document.createElement("LI");
    var ul = document.createElement("ul");
    ul.classList.add("ul_2nd");
	li.innerHTML = "<div class=\"first\" onclick=\"clickTitle(this, 'first', 'item_background');event.cancelBubble=true;\" onmouseover=\"showDelete(this, 1)\" onmouseout=\"showDelete(this, 0)\"><div class=\"item-div\">" + person +"（<span>" + num + "</span>）</div> <img class=\"item-img1\" onclick=\"deleteTitle(this, 1); event.cancelBubble=true;\" src=\"image/3.png\"></div>"
	document.getElementById("item").appendChild(li);
    li.appendChild(ul);
	return ul
}

function deleteTitle(obj, num){  // 点击删除按钮，删除对应节点
	if(confirm("是否删除分类")){
		var child = obj.parentNode.parentNode
		console.log(child)
		var parent = child.parentNode
		var title = child.innerText.split("（")[0]
		var content = JSON.parse(getStore(account))
		if(num == 1) {
			var i = content.firstTitles.findIndex((value) => value.name == title)
			var total = content.num - content.firstTitles[i].num
			content.num = total
			document.getElementsByClassName("left-p")[0].innerHTML = "所有任务（<span>" + content.num + "</span>）"
			// console.log(i)
			content.firstTitles.splice(i, 1)
		}else if(num == 2){
			var titleOne = child.parentNode.previousSibling.innerText.split("（")[0]
			var titleOneNum = parent.previousSibling.firstElementChild.firstElementChild
			var j = content.firstTitles.findIndex((value) => value.name == titleOne)
			var l = content.firstTitles[j].secondTitles.findIndex((value) => value.name == title)
			titleOneNum.innerText = content.firstTitles[j].num - content.firstTitles[j].secondTitles[l].num
			content.firstTitles[j].num = titleOneNum.innerText
			var total = content.num - content.firstTitles[j].secondTitles[l].num
			content.num = total
			document.getElementsByClassName("left-p")[0].innerHTML = "所有任务（<span>" + content.num + "</span>）"
			content.firstTitles[j].secondTitles.splice(l, 1)
		}
		if(obj.parentNode.classList.contains("item_background")){
			var contentId = document.getElementById("content")
			if (contentId.children.length != 0) {
				contentId.removeChild(contentId.firstElementChild);
			}
		}
		if(obj.parentNode.classList.contains("item_background")){
			clearContent()
		}
		setStore(account, content)
		parent.removeChild(child)
		
	}
}

function showDelete(obj, num) {  // 鼠标移动显示和隐藏删除图标
	var img = obj.getElementsByTagName("img")[0]
	// console.log(img)
	img.style.opacity = num
}

function queding() {
	var right_title = document.getElementById("right_title").value;
	var right_date = document.getElementById("right_date").value;
	var right_content = document.getElementById("right_content").value;
	var item = {
		"type": 0,  //0 表示未完成
		"title": right_title,
		"date": right_date,
		"content": right_content
	}
	var content = JSON.parse(getStore(account));
	var index = titleIndex(content)
	var i = index[0]
	var j = index[1]
	var items = content.firstTitles[i].secondTitles[j].items
	if(right_title && right_date && right_content){
		if(isEdit == true){  //对已存在的item进行修改
			var l = items.findIndex((value) => value.title == item_title)
			items[l].title = right_title
			items[l].date = right_date
			items[l].content = right_content
			content.firstTitles[i].secondTitles[j].items = items
			content.firstTitles[i].secondTitles[j].items.sort(compare('date'))
			setStore(account, content)
		}else{
			if(items){
				content.firstTitles[i].secondTitles[j].items.push(item)
				content.firstTitles[i].secondTitles[j].items.sort(compare('date'))
			}else{  //第一次添加item
				content.firstTitles[i].secondTitles[j].items = [item]
			}
			setStore(account, content)
			changeItemsNum(i, j, true)
		}
		changeLicolor("all", "undones", "dids")
		var arr = content.firstTitles[i].secondTitles[j].items
		console.log(arr)
		createItemsList(arr)
		clearContent()
		isEdit = false
	}else{
		alert("内容不能为空")
	}
}

function titleIndex(content) {  // 确定标题在数据中的位置
	var i = content.firstTitles.findIndex((value) => value.name == title1)
	var j = content.firstTitles[i].secondTitles.findIndex((value) => value.name == title2)
	return [i, j]
}

function clearContent(){  // 清除item
	document.getElementById("right_title").value = "";
	document.getElementById("right_date").value = "";
	document.getElementById("right_content").value = "";
}

function createItemsList(arr){ // 中间标题列表的产生
	var content = document.getElementById("content");
	if (content.children.length != 0) {
		content.removeChild(content.firstElementChild);
	}
	var ul = document.createElement('ul');
	ul.setAttribute('id', 'center_date');
	content.appendChild(ul);
	for(var i = 0; i < arr.length; i++){
		var datenum = arr[i].date;
		if(i > 0 && arr[i].date == arr[i-1].date) {
				var date = ul.lastElementChild
				var titleList = date.lastElementChild
				var li = document.createElement("li");
				li.innerHTML = "<div onclick='showItem(this)'>" + arr[i].title + "</div>"
				li.classList.add("li_title")
				titleList.appendChild(li)
		}else{
			var li = document.createElement("li");
			var div = document.createElement("div");
			var ul_title = document.createElement("ul");
			li.classList.add("li_date");
			div.innerHTML = datenum;
			ul.appendChild(li);
			li.appendChild(div);
			li.appendChild(ul_title);
			div.classList.add("dates");
			var title = document.createElement('LI');
			title.innerHTML = "<div onclick='showItem(this)'>" + arr[i].title + "</div>"
			title.classList.add("li_title")
			ul_title.appendChild(title)
		}
	}
}

function showItem(obj){  //点击中间页面标题出现右侧对应内容
	console.log(obj)
	var title_background = document.getElementsByClassName("title_background")[0]
	if(title_background){
		title_background.classList.remove("title_background")
	}
	
	obj.parentNode.classList.add("title_background")
	var arr = getItems()
	console.log(arr)
	item_title = obj.innerText
	var i = arr.findIndex((value) => value.title == item_title)
	document.getElementById("right").style.opacity = 1
	document.getElementById("right_title").value = arr[i].title
	document.getElementById("right_date").value = arr[i].date
	document.getElementById("right_content").value = arr[i].content
	document.getElementById("right_title").setAttribute("readonly", "")
	document.getElementById("right_content").setAttribute("readonly", "")
	document.getElementById("right_date").setAttribute("readonly", "")
	showHide("none", "inline");
}

function compare(key){  // 对item进行排序
	return function(value1,value2){
		var val1 = toTimestamp(value1[key]);
		var val2 = toTimestamp(value2[key]);
        return val1-val2;
    }
}

//日期转化为时间戳
function toTimestamp(time) {
	var date = new Date(time);
	return date.getTime();
}

function changeItemsNum(num1, num2, isAdd){  // 标题后数字的变化
	var content = JSON.parse(getStore(account));
	if(isAdd == true){
		// console.log(Number(content.firstTitles[num1].secondTitles[num2].num))
		content.firstTitles[num1].secondTitles[num2].num = Number(content.firstTitles[num1].secondTitles[num2].num) + 1
		content.firstTitles[num1].num = Number(content.firstTitles[num1].num) + 1
		content.num = Number(content.num) + 1
	}else if(isAdd == false){
		content.firstTitles[num1].secondTitles[num2].num = Number(content.firstTitles[num1].secondTitles[num2].num) - 1
		content.firstTitles[num1].num = Number(content.firstTitles[num1].num) - 1
		content.num = Number(content.num) - 1
	}
	var total2 = content.firstTitles[num1].secondTitles[num2].num
	var total1 = content.firstTitles[num1].num
	titleNum(0, "item_background", total2)
	titleNum(num1, "first", total1)
	document.getElementsByClassName("left-p")[0].innerHTML = "所有任务（<span>" + content.num + "</span>）"
	setStore(account, content)
}

function titleNum(num, className, total) { // 对标题后数字改变
	var title = document.getElementsByClassName(className)[num]
	title.firstElementChild.firstElementChild.innerText = total
}

function quxiao() {
	var right_title = document.getElementById("right_title").value;
	var right_date = document.getElementById("right_date").value;
	var right_content = document.getElementById("right_content").value;
	// console.log(right_content)
	if(confirm("是否取消")){
		if(isEdit == true){  //删除已存在的item
			if(right_content != '' && right_date != '' && right_title != '') {
				
				var content = JSON.parse(getStore(account));
				var index = titleIndex(content)
				var i = index[0]
				var j = index[1]
				var items = content.firstTitles[i].secondTitles[j].items
				var l = items.findIndex((value) => value.title == item_title)
				var type = items[l].type
				console.log(l)
				items.splice(l, 1)
				content.firstTitles[i].secondTitles[j].items = items
				setStore(account, content)
				// if(items[l].type == 0){
				if(type == 0){
					console.log("yes")
					changeItemsNum(i, j, false)
				}else if(type == 1){
					
					
				}
				// console.log(arr)
				changeLicolor("all", "undones", "dids")
				var arr = content.firstTitles[i].secondTitles[j].items
				createItemsList(arr)
				isEdit = false
			}
			
		}
	}
	clearContent()
	
}

function clickTitle(obj, className1, className2){  // 点击标题背景颜色改变，赋值title1，title2
	removeClass(className1, className2)
	obj.classList.add("item_background")
	if(className1 == "first"){
		removeClass("second", "item_background")
		title1 = obj.innerText.split("（")[0]
		title2 = ""
	}else if(className1 == "second") {
		removeClass("first", "item_background")
		title2 = obj.innerText.split("（")[0]
		title1 = obj.parentNode.parentNode.previousSibling.innerText.split("（")[0]
		var center = document.getElementById("center");
		center.style.opacity = 1
		var content = JSON.parse(getStore(account));
		var index = titleIndex(content)
		var i = index[0]
		var j = index[1]
		var arr = content.firstTitles[i].secondTitles[j].items;
		if(arr){
			createItemsList(arr)
		}else{
			var contentId = document.getElementById("content")
			if (contentId.children.length != 0) {
				contentId.removeChild(contentId.firstElementChild);
			}
		}
		changeLicolor("all", "undones", "dids")
	}
}

function removeClass(className1, className2) {
	var lis = document.getElementsByClassName(className1);
    for(var i = 0; i < lis.length; i++){
        lis[i].classList.remove(className2);
    }
}

//添加二级标题
function createSecondtitle(title, item, num) {
	var ul = item
	var li = document.createElement("li");
	li.classList.add("li_box");
	li.innerHTML = "<div class='second' onclick=\"clickTitle(this, 'second', 'item_background');event.cancelBubble=true;\" onmouseover=\"showDelete(this, 1)\" onmouseout=\"showDelete(this, 0)\"><div class=\"item-div\">" + title + "（<span>" + num + "</span>）</div> <img class=\"item-img1\" onclick=\"deleteTitle(this, 2); event.cancelBubble=true;\" src=\"image/3.png\"></div>"
	ul.appendChild(li)
}

//新增任务右边出现编辑页面
function showRight() {
	var right_title = document.getElementById("right_title");
	var right_date = document.getElementById("right_date");
	var right_content = document.getElementById("right_content");
	showHide("inline", "none");
	right_title.value = "";
	right_date.value = "";
	right_content.value = "";
	var right = document.getElementById("right");
	right.style.opacity = "1";
	right_title.removeAttribute("readonly", "")
	right_content.removeAttribute("readonly", "")
	right_date.removeAttribute("readonly", "")
}

function showHide(text1, text2) {  //右侧编辑图标的显示和隐藏
	var quxiao = document.getElementById("quxiao");
	var queding = document.getElementById("queding");
	quxiao.style.display = text1;
	queding.style.display = text1;
	var wancheng = document.getElementById('wancheng');
	var bianji = document.getElementById('bianji');
	wancheng.style.display = text2;
	bianji.style.display = text2;
}

function getStore(name) {
	if(!name){
		return
	}else{
		return localStorage.getItem(name)
	}	
}

function setStore(name, value) {
	if(!name){
		return
	}else if (typeof value !== 'string'){
		value = JSON.stringify(value)
	}
	localStorage.setItem(name, value)
}

function removeStore(name) {
	if(!name){
		return
	}else{
		localStorage.removeItem(name)
	}
}
