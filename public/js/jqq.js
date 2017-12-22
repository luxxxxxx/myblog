/**
 *  Created on 2017/4/7
 *  version jqq-1.31
	增加了 text方法		
 *  Author luxxxxxx
**/

(function () {
	function $(arg) {
		return new Init(arg);
	}
	function Init(arg) {
		return this.exe(arg);
	}
	$.prototype = {
		getUrl: function (file) {
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
		exe: function (args) {
			var typeArgs = typeof args;
			switch (typeArgs) {   //如果传入的是字符串 自动转化成jqq对象
				case 'string':
					var jqObject = document.querySelectorAll(args),
						l = jqObject.length;
					this.length = l;
					for (var i = 0; i < l; i++) {
						this[i] = jqObject[i];
					};
					break;
				case 'function':
					window.onload = args;
					break;
				case 'object':  //如果传进来的是dom节点
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
		each: function (func) {
			var l = this.length;
			for (var i = 0; i < l; i++) {
				func.call(this[i], i);
			};
		},
		//Css
		css: function () {
			var args = arguments,
				argsL = arguments.length;
			if (argsL === 1) {
				var attr = args[0];
				if (typeof attr === 'string') {  //如果css 只传入一个参数只返回dom第一个元素的该css属性的值
					targetDom = this[0];  //第一个节点(目标节点) 在这里先转化成js对象用js的currentStyle 和 getComputedStyle
					switch (attr) {
						case 'left':
							return targetDom.offsetLeft;
							break;
						case 'right':
							return targetDom.offsetRight + targetDom.offsetWidth;
							break;
						case 'top':
							return targetDom.offsetTop;
							break;
						case 'bottom':
							return targetDom.offsetTop + targetDom.offsetHeight;
							break;
						default:
							return targetDom.currentStyle ? targetDom.currentStyle[attr] : getComputedStyle(targetDom)[attr];
							break;
					}
				} else if (typeof attr === 'object') {
					for (var i in attr) {
						this.each(function () {
							$(this).css(i, attr[i]);
						})
					}
				}
			} else if (argsL === 2) {  //两个参数 设置
				this.each(function (i) {
					switch (args[0]) {
						case 'left':
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						case 'right':
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						case 'top':
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						case 'bottom':
							this.style[args[0]] = parseFloat(args[1]) + 'px';
							break;
						default:
							this.style[args[0]] = args[1];
							break;
					}
				});
			}
			return this;
		},
		//Html
		html: function (str) {
			if (arguments[0] != undefined) {
				this.each(function (i) {
					this.innerHTML = str;
				})
			}
			return this[0].innerHTML;
		},
		//Text
		text:function (str) {
			this.each(function (params) {
				this.textContent = str;
			});
			return this;
		},
		empty: function () {
			this.each(function (i) {
				this.innerHTML = '';
			})
		},
		//节点操作
		//Eq
		eq: function (num) {  //返回指定位置的jqq对象
			return $(this[num]);
		},
		//Get
		get: function (num) { //返回JS对象
			return this[num];
		},
		first: function () {
			return $(this[0]);
		},
		last: function () {
			return $(this[this.length - 1]);
		},
		parent: function (selector) {  //父元素
			if (!selector) {
				return $(this[0].parentNode);
			}
		},
		//Siblings
		siblings: function () {
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
			return $(nodeArr);
		},
		//Remove
		remove: function (selector) {
			this.each(function () {
				this.parentNode.removeChild(this);
			})
		},
		//Child 
		child: function (num) {
			return $(this[0].children[num]);
		},

		// append : function (jqq) {
		// 	domArr = [],
		// },

		//Height
		height: function (num) {
			if (num) {
				if (typeof num === 'string') {
					this[0].style.height = num;
				} else if (typeof num === 'number') {

					this[0].style.height = num + 'px';
				} else {
					throw 'arguments error';
				}
				return this;
			} else {
				return parseFloat(this.css('height'));
			}
		},
		//GetStyle  返回第一个dom元素属性
		getStyle: function (attr) {
			let obj = this[0];
			return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
		},

		//Width
		width: function (num) {
			var num = arguments[0];
			if (num) {
				if (typeof num === 'string') {
					this[0].style.width = num;
				} else if (typeof num === 'number') {
					this[0].style.width = number + 'px';
				} else {
					throw 'arguments error';
				}
				return this;
			} else {
				return parseFloat(this.css('width'));
			}
		},
		//Left 
		left: function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('left', num);
				return this;
			} else {
				return $(this[0]).css('left');
			}
		},
		//Top
		top: function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('top', num);
				return this;
			} else {
				return $(this[0]).css('top');
			}
		},
		//Right
		right: function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('right', num);
				return this;
			} else {
				return $(this[0]).css('right');
			}
		},
		//Bottom
		bottom: function (num) {
			if (typeof arguments[0] == 'number') {
				this.css('bottom', num);
				return this;
			} else {
				return $(this[0]).css('bottom');
			}
		},
		//Bind
		bind: function (event, func) {  //可以是两个参数  ，可以是一个对象同时绑定多个事件
			if (window.addEventListener) {
				if (arguments.length === 1) {
					var evts = arguments[0];
					if (typeof arguments[0] === 'object') {  //多个事件对象
						for (var evt in evts) {
							this.each(function (i) {
								this.addEventListener(evt, evts[evt]);
							})
						}
					}
				} else {  //如果是两个参数
					this.each(function () {
						this.addEventListener(event, func);
						// this.addEventListener(event,func);
					})
				}

			} else {  //IE 8 attachEvent 而且还要修改this指向
				alert('检测到低版本浏览器-jqq');
				var evts = arguments[0],
					l = arguments.length;
				if (l === 1) {
					if (typeof evts === 'object') {
						for (var evt in evts) {
							this.each(function (i) {

								this.attachEvent.call(this, 'on' + evt, evts[evt]);
							});
						};
					}
				} else { //两个参数
					this.each(function (i) {
						this.attachEvent.call(this, 'on' + event, func);
					})
				}
			}
			return this;
		},

		//Click
		click: function (func) {
			if (func) {
				this.each(function (i) {
					this.onclick = func;
				})
				return this;
			} else {
				this.each(function (i) {
					this.click();
				})
			}
		},

		//Find
		find: function (selector) {
			return $(this[0].querySelectorAll(selector));
		},
		is: function (selector) {  //用一个表达式来检查当前选择的元素集合如果其中至少有一个给定的表达式就返回true
			var allDom = document.querySelectorAll(selector),
				l = allDom.length,
				flag = false;
			this.each(function (i) {
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
		hasClass: function (attr) {  //如果至少有一个元素含有该class  就返回true 如果都没有则返回false
			var flag = false;
			var reg = new RegExp('\\b' + attr + '\\b');
			this.each(function (i) {
				if (reg.test(this.className))
					flag = true;
			});
			return flag;
		},
		//AddClass
		addClass: function (clN) {
			this.each(function (i) {
				var classN = this.className;
				if (!$(this).hasClass(clN)) {  //如果该元素没有该class增加该class
					var lastChar = classN[classN.length - 1];  //class最后一个字符
					if (lastChar === undefined || lastChar === ' ')  //最后一个字符如果不存在 （也就是没有class的情况下）或者最后一个字符是空格
						this.className += clN;
					else if (lastChar != ' ')
						this.className += ' ' + clN;
				}
			})
			return this;
		},
		//Class 
		class: function (classN) {
			if (arguments.length) {
				this.each(function () {
					this.className = classN;
				});
				return this;
			} else {
				return this[0].className;
			}
		},
		//RemoveClass
		removeClass: function (clN) {
			if (typeof clN === 'string') {
				this.each(function (i) {
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
		toggleClass: function (clN) {
			this.each(function (i) {
				var THIS = $(this);
				if (THIS.hasClass(clN)) THIS.removeClass(clN);
				else THIS.addClass(clN);
			});
			return this;
		},
		//SetClass

		//Attr
		attr: function (attr) {
			var agsL = arguments.length;
			if (agsL === 1) {
				return this[0][arguments[0]];
			} else if (agsL === 2) {
				this.each(function () {
					this[arguments[0]] = arguments[1];
				})
				return this;
			}
		},
		//Val
		val: function (text) {
			if (arguments.length != 0) {
				this.each(function () {
					this.value = text;
				})
				return this;
			} else {
				return this[0].value;
			}
		},
		//Move  运动框架
		// targetJson : left,width ....能够变换的属性和 变换的数值 
		// time ： 运动时间 
		// mf ： 运动曲线函数 
		// cb : callback 回调函数
		//
		/*
			传参 obj.move({
				targetJson,
				time,
				mf,
				callback
			})
		*/
		// 第一个元素实现move   只限一个元素
		move: function (obj) {
			// this.each(function (i) {
			var startTime = new Date(),
				THIS = this,
				startVal = {};
			for (var key in obj.targetJson) {
				startVal[key] = parseFloat($(this).getStyle(key))
			};
			var timer = setInterval(function () {
				var t = new Date() - startTime; //现在和开始执行的时间差
				d = obj.time;  //目标时间
				if (t >= d) { //到达目标时间
					t = d;  //消除误差
					clearInterval(timer);
					obj.callback && obj.callback.call($(THIS[0]));  //执行回调函数 邦迪this为 第一个元素
				}
				for (key in obj.targetJson) {
					var b = startVal[key];
					var c = parseFloat(obj.targetJson[key]) - b;
					THIS[0].style[key] = Tween[obj.mf](t, b, c, d) + 'px';
				}
			}, 13)
			// })
		}



	}
	window.$ = window.jqq = $;

	// 判断浏览器是否为pc端
	window.isPc = function () {  
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad", "iPod"];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	};

	//cookie
	window.getCookie = function (key) {
		var r = new RegExp('\\b' + key + '=([^;]+)(; |\$)');
		var val = document.cookie.match(r);
		return val ? val[1] : '';
	}
	window.setCookie = function (key, value, time) {
		document.cookie = key + '=' + value + ';expires=' + (new Date(new Date().getTime() + time)).toGMTString();
	}

	window.removeCookie = function (key) {
		setCookie(key, '', -1);
	}
	
	//Ajax
	window.Ajax = function (json) {
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),  //兼容老版本IE 
			method = json.method || 'get',
			asyn = json.asyn ? true : json.asyn == false ? false : true,
			data = json.data || '',
			success = json.success,
			error = json.error,
			url = json.url;
		if (method.toLowerCase() === 'get') {
			url += '?' + data + '&' + new Date().getTime();
		} else {
			var newData = "";
			for (var key in data) {
				newData += key + '=' + data[key] + '&';
			}
			data = newData.slice(0, newData.length - 1);
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status >= 200 && xhr.status < 300)
					success && success(xhr.responseText);
				else
					error && error(xhr);
			}
		};
		xhr.open(method, url, asyn);
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
		xhr.send(data);
	};





	//Tween 算法 规定运动曲线
	window.Tween = {  //Tween 算法   t：执行时时间   b：变化属性  c：当前时间  时间差  d：
		linear: function (t, b, c, d) {  //匀速
			return c * t / d + b;
		},
		easeIn: function (t, b, c, d) {  //加速曲线
			return c * (t /= d) * t + b;
		},
		easeOut: function (t, b, c, d) {  //减速曲线
			return -c * (t /= d) * (t - 2) + b;
		},
		easeBoth: function (t, b, c, d) {  //加速减速曲线
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		easeInStrong: function (t, b, c, d) {  //加加速曲线
			return c * (t /= d) * t * t * t + b;
		},
		easeOutStrong: function (t, b, c, d) {  //减减速曲线
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeBothStrong: function (t, b, c, d) {  //加加速减减速曲线
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t + b;
			}
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		elasticIn: function (t, b, c, d, a, p) {  //正弦衰减曲线（弹动渐入）
			if (t === 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		elasticOut: function (t, b, c, d, a, p) {    //正弦增强曲线（弹动渐出）
			if (t === 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		elasticBoth: function (t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				p = d * (0.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			}
			else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return - 0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
					Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
		},
		backIn: function (t, b, c, d, s) {     //回退加速（回退渐入）
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		backOut: function (t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 3.70158;  //回缩的距离
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backBoth: function (t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		bounceIn: function (t, b, c, d) {    //弹球减振（弹球渐出）
			return c - Tween['bounceOut'](d - t, 0, c, d) + b;
		},
		bounceOut: function (t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
			}
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		},
		bounceBoth: function (t, b, c, d) {
			if (t < d / 2) {
				return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
			}
			return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
		}
	};

})()
