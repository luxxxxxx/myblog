
// 常见的  函数封装 
function $$ (obj) { //封装  简单的的DOM获取
	if (document.querySelector) {
		var aObj = document.querySelectorAll(obj);
		if (aObj.length === 1) {
			return aObj[0];
		}else {
			return aObj;
		}
	}
	if (obj[0] == '#') {  //id获取DOM
		return document.getElementById(obj.replace(/\#/,''));
	}else if (obj[0] == '.') { //class获取DOM
		var arr = [];
		var classN = obj.replace(/\./,'');
		if (document.getElementsByClassName) {
			arr = document.getElementsByClassName(classN);   
		}else { //IE8如果不兼容ClassName的情况  
			var allElements = document.getElementsByTagName('*');
			var reg = RegExp('\\b' + classN + '\\b');
			for (var i = 0; i < allElements.length; i++) {
				if (reg.test(allElements[i].className)) {
					arr.push(allElements[i]);
				}
			}
		}
		return arr;
	}
}

function hasClass (ele,classN) {  // 检测是否有该 class
	var reg = new RegExp('\\b' + classN + '\\b');
	return reg.test( ele.className ); 
};

function addClass (ele,classN) { //  增加该 class
	if (!hasClass(ele,classN)) {
			if (ele.className) { //如果dom对象有classname
				var classArry = ele.className.split(' ');
				classArry.push(classN); //
			}else {
				var classArry = [];
				classArry.push(classN);
			}
	var fixArray = [];  //清除class之间可能存在的多个空格
	for (var i = 0; i < classArry.length; i++) {
		if (classArry[i] != '') {
			fixArray.push(classArry[i])
		};
	};
	ele.className = fixArray.join(' ');
	};
};

function removeClass (ele,classN) { //移除该class
	if (hasClass(ele,classN)) {
		var reg = RegExp('\\b' + classN + '\\b');
		ele.className = ele.className.replace(reg,'')
	}

}

function getStyle( obj , attr ){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

function on (obj, evName, evFn ,boolean) {
	var bl = boolean? boolean : false;
	if  (obj.addEventListener ) {
		obj.addEventListener(evName, evFn ,bl)
	}else {
		obj.attachEvent('on' + evName ,function () {
			evFn.call(obj);    //IE8 里面this 指向window 
		})
	}
}

function ajax (json) {
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),  //兼容老版本IE 
	method = json.method || 'get',
	aysn = json.aysn || true,
	data = json.data || '',
	success = json.success;
	error = json.error;
	if ( method.toLowerCase() === 'get' ) 
		url += '?'+data+'&'+new Date().getTime();
	xhr.open( method, url , aysn);
	xhr.setRequestHeader('content-type' , 'application/x-www-form-urlencoded');
	xhr.send(data);
	xhr.onreadystatechange = function(){
		if ( xhr.readyState == 4 ) {
			if ( xhr.status >= 200 && xhr.status<300 )
				success && success(xhr.responseText);
			else
				error && error();
		}
	}
}




















function move( obj , targetJson , time , cv , fn ){//运动框架  obj：DOM对象 targetJson：目标属性Json time：所需要时间 cv：TWEEN算法 fn：毁掉函数；
					var startTime = new Date(); //程序开始执行的时间 
					var startVal = {}; //新进一个用来存放所需要属性的对象
					for ( var i in targetJson ) //遍历改变的属性
					{
						startVal[i] = parseInt( getStyle( obj , i ) ); 
					}
					var timer = setInterval(function(){
						var t = new Date() - startTime; //现在和开始执行的时间差
						var d = time;  //目标时间
						if ( t >= d ) 
						{
							t = d;
							clearInterval( timer ); 
							fn && fn();   //避免了不存在回调函数参数会产生bug的问题
						}
						for ( var key in targetJson )
						{
							var b = startVal[key];
							var c = parseInt( targetJson[key] ) - b;   
							obj.style[key] = Tween[cv]( t , b , c , d ) + 'px';
						}
					},13);
			}

var Tween = {  //Tween 算法   t：执行时时间   b：变化属性  c：当前时间  时间差  d：
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}

