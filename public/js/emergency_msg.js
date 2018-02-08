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
// asyn : 默认 （false 同步执行）是否延迟时间结束时触发callback
// delay : 延迟（包括延迟执行回调函数，延迟结束取消消息弹框）默认（0）


(function (params) {
    window.showMsg = function (obj) {  //
        setStyle (msg_box,{
            
        })
        msg_a.innerHTML = obj.msg? obj.msg : '';
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
        if (obj.asyn) {
            setTimeout(obj.callback? obj.callback : function () {} , delay? delay : 0);
            setStyle (msg_box,{

            })
        } else {

        }
        


    }
    var body = document.body,
        msg_box = document.createElement ('div'),
        msg_close = document.createElement ('div'),  //关闭弹窗
        msg_a = document.createElement ('a'),  // 提示信息（中心） 带链接 两种样式 success  error
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
        // 'visibility': 'hidden',
        // 'opacity': '0',
        'transition:':'.1s all linear'
    })
    setStyle(msg_a,{
        'display' : 'block',
        'color': '#000',
        'font-size' : '16px',
        'margin-top' : '40px',
        'text-align' : 'center'
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

    msg_box.appendChild(msg_close);
    msg_box.appendChild(msg_a);
    body.appendChild(msg_box);

    



    // msg_box.id = 'info';

})()
