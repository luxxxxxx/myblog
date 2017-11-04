/**
 *  Created on 2017/4/7
 *  version jqq-1.1
 *  Author luxxxxxx
**/
window.Ajax = function (obj) {
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),  //兼容老版本IE 
	method = json.method || 'get',
	asyn = json.asyn ? true : json.asyn == false ? false : true,
	data = json.data || '',
	success = json.success,
	error = json.error,
	url = json.url;
	if ( method.toLowerCase() === 'get' ) 
		url += '?'+ data +'&'+new Date().getTime();
	xhr.onreadystatechange = function(){
		if ( xhr.readyState == 4 ) {
			if ( xhr.status >= 200 && xhr.status < 300 )
				success && success(xhr.responseText);
			else
				error && error();
		}
	};
	xhr.open( method, url , asyn );
	xhr.setRequestHeader('content-type' , 'application/x-www-form-urlencoded');
	xhr.send(data);
};
(function(){
	function $ (arg) {
		return new Init(arg);
	}
	function Init (arg) {
		return this.exe(arg);
	}
	$.prototype = {
		getUrl : function (file) {
			var url;
			if (window.createObjectURL != undefined) {
				url = window.createObjectURL(file);
			} else if (window.URL != undefined) {
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL != undefined) {
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		}
	}
	Init.prototype = {
		exe : function (args) {  
			var typeArgs = typeof args;
			switch (typeArgs) {   //如果传入的是字符串 自动转化成jqq对象
				case 'string' : 
					var jqObject = document.querySelectorAll(args),
						l = jqObject.length;
					this.length = l;
					for (var i = 0; i < l; i++) {
						this[i] = jqObject[i];
					};
					break;
				case 'function' :
					window.onload = args;
					break;
				case 'object' :  //如果传进来的是dom节点
					if (args.nodeType || args === window) {  //单个节点判断一下是不是window 
						this[0] = args;
						this.length = 1;
					} else {  //nodeList 就直接转化成jqq对象
						var l = args.length;
						for (var i = 0; i < l; i++) {
							this[i] = args[i];
						};
						this.length = l;
					};
					break;
			};
		},
		each : function (func) { 
			var l = this.length;
			for (var i = 0; i < l; i++) {
				func.call(this[i],i);
			};
		},
		css : function () {
			var args = arguments,
				argsL = arguments.length;
			if (argsL === 1) {
				var attr = args[0];
				if (typeof attr === 'string') {  //如果css 只传入一个参数只返回dom第一个元素的该css属性的值
					targetDom = this[0];  //第一个节点(目标节点) 在这里先转化成js对象用js的currentStyle 和 getComputedStyle
					switch (attr) {
						case 'left' :
							return targetDom.offsetLeft;
							break;
						case 'right' :
							return targetDom.offsetRight + targetDom.offsetWidth;
							break;
						case 'top' :
							return targetDom.offsetTop;
							break;
						case 'bottom' :
							return targetDom.offsetTop + targetDom.offsetHeight;
							break;
						default :
							return targetDom.currentStyle ? targetDom.currentStyle[attr] : getComputedStyle(targetDom)[attr];
							break;
					}
				} else if (typeof attr === 'object') {
					for (var i in attr) {
						this.each(function(){
							$(this).css(i,attr[i]);
						})
					}
				}
			} else if (argsL === 2) {  //两个参数
				this.each(function(i) {
					switch (args[0]) {
						case 'left' :
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						case 'right' :
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						case 'top' :
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						case 'bottom' :
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						default :
							this.style[args[0]] = args[1];
							break; 
					}
					
				});
			}
			return this;
		},
		//Html
		html : function (str) {
			if (arguments[0] != undefined) {
				this.each(function(i){
					this.innerHTML = str;
				})
			}
			return this[0].innerHTML;
		},
		empty : function () {
			this.each(function(i) {
				this.innerHTML = '';
			})
		},
		//节点操作
		//Eq
		eq : function (num) {  //返回指定位置的jqq对象
			return $(this[num]);
		},
		//Get
		get : function (num) { //返回JS对象
			return this[num];
		},
		first : function () {
			return $(this[0]);
		},
		last : function () {
			return $(this[this.length-1]);
		},
		parent : function (selector) {  //父元素
			if (!selector) {
				return $(this[0].parentNode);
			}
		},
		//Siblings
		siblings : function () {
			if (!this[0]) {
				throw "this is undefined";
			}
			var currentNode = this[0],
			    father = currentNode.parentNode,
				childs = father.childNodes,
				l = childs.length,
				nodeArr = [];
				for (var i = 0; i < l; i++) {
					if (childs[i].nodeType != 3 && childs[i] != currentNode) {
						nodeArr.push(childs[i]);
					}
				}
				console.log(nodeArr)
				return $(nodeArr);
		},
		//Remove
		remove : function (selector) {
			this.parent()[0].removeChild(this[0]);
		},
		//Child 
		child : function (num) {
			return $(this[0].children[num]);
		},
		//Height
		height : function (num) {
			if (num) {
				if (typeof num === 'string') {
					this[0].style.height = num;
				} else if (typeof num === 'number') {

					this[0].style.height = num + 'px';
				} else {
					throw 'arguments error';
				}
			} else {
				return parseFloat(this.css('height'));
			}
		},
		//Width
		width : function (num) {
			var num = arguments[0];
			if (num) {
				if (typeof num === 'string') {
					this[0].style.width = num;
				} else if (typeof num === 'number') {
					this[0].style.width = number + 'px';
				} else {
					throw 'arguments error';
				}
			} else {
				return parseFloat(this.css('width'));
			}
		},
		//Left 
		left : function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('left',num);
				return this;
			} else {
				return $(this[0]).css('left');
			}
		},
		//Top
		top : function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('top',num);
				return this;
			} else {
				return $(this[0]).css('top');
			}
		},
		//Right
		right : function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('right',num);
				return this;
			} else {
				return $(this[0]).css('right');
			}
		},
		//Bottom
		bottom : function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('bottom',num);
				return this;
			} else {
				return $(this[0]).css('bottom');
			}
		},
		//Bind
		bind : function (event,func) {  //可以是两个参数  ，可以是一个对象同时绑定多个事件
			if (window.addEventListener) {
				if (arguments.length === 1) {
					var evts = arguments[0];
					if (typeof arguments[0]  ===  'object') {  //多个事件对象
						for (var evt in evts) {
							$(this).each(function(i) {
								this.addEventListener(evt,evts[evt]);
							})
						}
					}
				} else {  //如果是两个参数
					$(this).each(function(i) {
						this.addEventListener(event,func);
					})
				}

			} else {  //IE 8 attachEvent 而且还要修改this指向
				var evts = arguments[0],
				    l = arguments.length;
				if (l === 1) {  
					if (typeof evts === 'object') {
						for (var evt in evts) {
							$(this).each(function(i) {
								this.attachEvent.call(this,'on' + evt,evts[evt]);
							});
						};
					}
				} else { //两个参数
					$(this).each(function (i) {
						this.attachEvent.call(this,'on' + event, func);
					})
				}
			}
			return this;
		},
		
		//Click
		click : function (func) {
			if (func) {
				this.each (function(i) {
					this.onclick = func;
				})
				return this;
			} else {
				this.each (function(i){
					this.click();
				})
			}
		},
		//Find
		// find : function (selector) {  //通过选择器名称来进行选择
		// 	var objectArr = [],
		// 		parentsL = this.length;
		// 		console.log(this)
		// 	this.each(function (i) {
		// 		var targetDomArr = this.querySelectorAll(selector),
		// 			targetDomArrL = targetDomArr.length;
		// 		if (targetDomArrL != 0) {
		// 			for (var j = 0; j < targetDomArrL; j++) {
		// 				objectArr.push(targetDomArr[j])
		// 			};
		// 		};
		// 	})
		// 	var objectArrL = objectArr.length;
		// 	for (var i = 0; i < objectArrL; i++) {
		// 		this[i] = objectArr[i];
		// 	}
		// 	this.length = objectArrL;
		// 	return this;
		// },
		//Is
		is : function (selector) {  //用一个表达式来检查当前选择的元素集合如果其中至少有一个给定的表达式就返回true
			var allDom = document.querySelectorAll(selector),
				l = allDom.length,
				flag = false;
			this.each (function (i) {
				for (var j = 0; j < l; j++) {
					if (this == allDom[j]) {
						flag = true;
						break;
					}
				}
			});
			return flag;
		},

		// 属性
		//HasClass
		hasClass : function (attr) {  //如果至少有一个元素含有该class  就返回true 如果都没有则返回false
			var flag = false;
			var reg = new RegExp('\\b' + attr + '\\b');
			this.each(function(i) {
				if (reg.test( this.className ))
					flag = true;
			});
			return flag;
		},
		//AddClass
		addClass : function (clN) {
			this.each(function(i) {
				var classN = this.className;
				if (!$(this).hasClass(clN)) {  //如果该元素没有该class增加该class
					var lastChar = classN[classN.length - 1];  //class最后一个字符
					if ( lastChar === undefined || lastChar === ' ')  //最后一个字符如果不存在 （也就是没有class的情况下）或者最后一个字符是空格
						this.className += clN;
					  else if ( lastChar != ' ')
					  	this.className += ' ' + clN;
				}
			})
			return this;
		},
		//RemoveClass
		removeClass : function (clN) {
			if (typeof clN === 'string') {
				this.each(function(i) {
					var classN = this.className;
					if ($(this).hasClass(clN)) {
						var clsArr = classN.split(' '),
							arrL = clsArr.length,
							fixArr = [];
						for (var i = 0; i < arrL; i++) {
							if (clsArr[i] != '' && clsArr[i] != clN) 
								fixArr.push(clsArr[i]);
						}
						this.className = fixArr.join(' ');
					};
				});
			} else if (typeof clN === 'object') {
				if (clN instanceof Array) {
					var l = clN.length;
					for (var i = 0; i < l; i++) {  //递归实现移除所有数组参数里面的class
						this.removeClass(clN[i]);
					}
				} else {
					throw 'type error';
				}
			};
		},
		//ToggleClass
		toggleClass : function (clN) {
			this.each(function(i) {
				var THIS = $(this);
				if (THIS.hasClass(clN)) THIS.removeClass(clN);
			    else THIS.addClass(clN);
			});
		},
		//SetClass
		setClass : function (clN) {
			this.each(function(i) {
				this.className = clN;
			})
		},
		//Attr
		attr : function () {
			var agsL = arguments.length;
			if (agsL === 1) {
				return this[0][arguments[0]];
			} else if (agsL === 2)  {
				this.each(function (){
					this[arguments[0]] = arguments[1];
				})
			}
		},
		//Val
		val : function () {
			return this[0].value;
		}
		
 	}
	window.$ = window.jqq = $;
})()