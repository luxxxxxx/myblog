/**
 *  一个方便的弹窗插件
 *  Created on 2018/2/8
 *  version 1.0
 *  Author luxxxxxx
**/


// showMsg API  
// msg ：弹框消息 默认 （无）
// status ： 弹框状态 success 成功消息样式 err 失败消息样式 默认（无样式）
// link ：链接 默认（无）  
// callback ：回调函数 默认 （无）
// async : 默认 （false 同步执行）是否延迟时间结束时触发callback
// delay : 延迟 ms（包括延迟执行回调函数，延迟结束取消消息弹框）默认（0）
// detail : 报错详情


(function (params) {
    window.showMsg = function (obj) {  //
        setStyle (msg_box,{
            'visibility' : 'visible',
            'opacity' : 1
        })
        msg_a.innerHTML = obj.msg? obj.msg : '';
        msg_a.href = obj.link ? obj.link : '##';
        msg_p.href = obj.link ? obj.link : '##';
        if (obj.status === 'success') {
            setStyle (msg_a , {
                'color' : 'lightgreen'
            })
        } else if (obj.status === 'err') {
            setStyle (msg_a , {
                'color' : 'red'
            })
        } else {
            setStyle (msg_a , {
                'color' : '#000'
            })
        }

        if (obj.detail) {
            msg_p.innerHTML = obj.detail;
            msg_a.style.marginTop = fixMargin;
        } else {
            msg_p.innerHTML = '';
            msg_a.style.marginTop = '36px';

        }

        if (obj.async) {  // yes  异步 callback 直接执行 和 delay 时间不同步
            obj.callback && obj.callback();    
            setTimeout( function () {
                setStyle(msg_box, {
                    'visibility': 'hidden',
                    'opacity': '0'
                });
            }, obj.delay ? obj.delay : 500);
        } else {
            setTimeout(function () {
                setStyle(msg_box, {
                    'visibility': 'hidden',
                    'opacity': '0'
                });
                obj.callback && obj.callback();    
            }, obj.delay ? obj.delay : 500);            
        }
    }
    var body = document.body,
        msg_box = document.createElement ('div'),
        msg_close = document.createElement ('div'),  //关闭弹窗
        msg_a = document.createElement ('a'),  // 提示信息（中心） 带链接 两种样式 success  error
        msg_p = document.createElement('a'),  // 报错详情
        fixMargin = '20px',  // 如果传入值有detail 改变 title margin
        setStyle = function (ele,styleObj) {
            for (var key in styleObj) {
                ele.style[key] = styleObj[key]
            }
        };
        
        
    msg_close.className = 'iconfont icon-close';
    setStyle (msg_close,{
        'position' : 'absolute',
        'top' : '7px',
        'right' : '7px',
        'width' : '16px',
        'height' : '16px',
        'textAlign' : 'center',
        'line-height' : '16px',
        'fontSize' : '16px',
        'transition' : '.2s all linear',
        'transformOrigin' : 'center',
        'color' : '#333',
        'cursor' : 'pointer'
    }) 
    setStyle(msg_box,{
        'zIndex': '999',
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)',
        'width': '300px',
        'height': '180px',
        'background': '#fff',
        'border': '1px solid #4444441f',
        'box-sizing': 'border-box',
        'padding': '20px',
        'border-radius': '4px',
        'visibility': 'hidden',
        'opacity': '0',
        'transition:':'.1s all linear'
    })
    setStyle(msg_a,{
        'display' : 'block',
        'color': '#000',
        'font-size' : '16px',
        'margin-top' : '36px',
        'text-align' : 'center'
    })

    setStyle(msg_p,{
        'color': '#00fff5',
        'font-size' : '13px',
        'margin-top' : '35px',
        'text-align' : 'center',
        'display' : 'block'
    })
    


    msg_close.onmouseover = function (params) {
        setStyle (this,{
            'color' : 'red',
            'transform' : 'rotate(90deg)'
        })
    }

    msg_close.onmouseleave = function (params) {
        setStyle (this, {
            'color': 'red',
            'transform' : 'rotate(0deg)'
        })
    }
    msg_close.onclick = function (params) {
        setStyle (msg_box, {
            'visibility' : 'hidden',
            'opacity' : '0'
        })
    }




    msg_box.appendChild(msg_close);
    msg_box.appendChild(msg_a);
    msg_box.appendChild(msg_p);
    body.appendChild(msg_box);

    


    // msg_box.id = 'info';

})()
