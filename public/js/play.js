var $danmuScreen = $('#danmu'),
    screenW = $danmuScreen.width(),
    screenH = $danmuScreen.height(),
    video = document.querySelector('video'),
    videoId = Number(location.search.match(/[0-9]+/g)),
    gdms = [], //存放弹幕数组
    $dmNum2 = $('#view_con > div.info > div.v_data > div:nth-child(2) > span'), //视频名称下面的弹幕数量
    $dmNum = $('div.danmu_con > div.player_info > em'), //弹幕数量
    $dm_list = $('ul.dm_list'),
    beaginH = parseFloat(screenH) * 0.9, //起始随机高度区域
    $sendBt = $('.send_bt'), //发送弹幕按钮
    $banBt = $('.ban_dm'), //测试按钮

    // 评论头部（页数、评论数） 
    $cmNum = $('#cmNum'), //评论数
    $totalPage = $('#totalPage'),
    totalPage = Number($totalPage.html()), //评论总页数
    $cm_pages = $('.container .page'), //评论页数doms
    $pages_con = $('.pages_con .container'),
    $sendCm = $('#send_cm'), //发送评论按钮
    iframe = document.querySelector('iframe'),
    iframePage = iframe.contentWindow,

    //下方视频播放控件
    $playBtn = $('#controls .play'), //播放按钮
    $slideBar = $('#controls .progressBar'), //长度的进度条
    $slideDot = $('#controls .currentTime'), //滑动视频进度点
    $volume = $('#controls > div.volume.btn'), //音量按钮
    $volumeCon = $('#controls > .volume > div'), //音量容量框（改变样式 show）
    $v_bar = $('#controls .v_bar'), //音量控制条
    $v_dot = $('#controls .v_dot'), //音量滚动点
    $expand = $('#controls > div.expand.btn'), //全屏按钮
    $t_now = $('#controls > div.showTime > span.now'), //当前时间
    $t_total = $('#controls > div.showTime > span.total'),

    //下方发送弹幕控件
    $changeFontSize = $('#senddm_con > div.fn.dm_font > div > div.type'), //改变发送的弹幕大小按钮
    fontSize = 1, //弹幕大小 默认 1(正常), 小 ：0.5 ,大 ：2
    $changeFontColor = $('#senddm_con > div.fn.dm_color > div > div > div.c'), //改变弹幕颜色
    fontColor = '#ffffff', //弹幕颜色 默认（#ffffff）


    $a_login = $('.a_login'), //登录按钮
    sendFlag = true,
    videoPause = true,
    pause = true; //弹幕暂停 flag

/*  API
	video_con  视频继续播放
	video_pause  视频暂停播放
	sendDm(span)  发送弹幕  参数：spanElement object
	wait()  发送弹幕后等待 五秒钟才能继续发送
	crt_dm_record(dm_obj)  添加弹幕对象到右边弹幕列表
	dm_load(dm_arr)  加载弹幕渲染页面 并将所有弹幕对象填充到dm_arr数组
	time_format(time)  将时间改成 mm:ss 格式并返回
	video_progress_listener()  //监听视频当前播放时间定时器结合发送弹幕功能
	vpl_flag  //变量 监听 视频播放定时器flag （防止多个定时器）（防止多个定时器）
*/





$a_login.attr("href", "login?href=" + self.location.href); //将所有登录按钮的href替换成当前页面 
// 视频控件

$banBt.click(function (params) { //禁止弹幕按钮
    if ($(this).hasClass('ban')) {
        $danmuScreen.removeClass('hidden')
        $(this).removeClass('ban');
    } else {
        $danmuScreen.addClass('hidden')
        $(this).addClass('ban');
    }
})

$('#input_dm').bind('keyup', function (e) { //回车发送弹幕
    if (e.keyCode == '13') {
        if (sendFlag)
            $sendBt.click();
    }
})


$sendBt.bind('click', function () { //点击按钮发送弹幕
    if (sendFlag) {
        let danmu = $('#input_dm').val();
        $('#input_dm').val('');
        let span = document.createElement('span'),
            flag = true; //防止用户多次点击
        span.className = 'user';
        if (flag) {
            flag = false;
            Ajax({
                url: '/play/dm',
                method: 'post',
                data: {
                    content: danmu,
                    crt_time: time_format(video.currentTime.toFixed(0)),
                    type: 'random',
                    color: fontColor,
                    size: fontSize,
                    v_id: videoId
                },
                success: function (params) {
                    let data = JSON.parse(params);
                    if (data.err) { //发送失败
                    } else {
                        span.textContent = danmu;
                        span.d_size = fontSize;
                        span.d_color = fontColor;
                        sendDm(span);
                        crt_dm_record({
                            'content': span.textContent,
                            'time': time_format(video.currentTime.toFixed(0)),
                            'date': new Date()
                        });
                    }
                    flag = true;
                },
                error: function (err) {
                    console.log(err);
                    flag = true;
                }
            })
        }
        wait(); //等五秒后才能发送
    }
})


let playBtnFlag = false, //播放暂停按钮flag
    $con = $('#controls .con'), //按钮
    $pause_btn = $('#controls .pause'),
    $play_btn = $('#controls .play');

$con.click((arg) => {
    if (!playBtnFlag) {
        $pause_btn.addClass('show');
        $play_btn.removeClass('show');
        video.play();
        playBtnFlag = !playBtnFlag
    } else {
        $pause_btn.removeClass('show');
        $play_btn.addClass('show');
        video.pause();
        playBtnFlag = !playBtnFlag;
    }
});

$slideBar.bind('click', (e) => { //点击进度条自动跳转到当前视频位置
    let dotL = $slideDot.css('left'),
        slideW = $slideBar.css('width'), //滑动条长度
        duration = video.duration, // 视频时长
        l = e.offsetX, //点击的位置
        rate = (l / parseInt(slideW)).toFixed(2); //占比
    video.currentTime = (duration * rate).toFixed(0);
    $slideDot.css('left', l);
})

$volume.bind('mouseover', () => { //音量按钮鼠标悬浮打开音量控件（因为移动端常常有独立控件）
    $volumeCon.addClass('show');
}).bind('mouseleave', () => {
    $volumeCon.removeClass('show');
})



$v_bar.click((e) => {
    let bar_h = $v_bar.css('height'),
        h = e.offsetY,
        rate = h / parseInt(bar_h);
    console.log(bar_h);

    window.event ? window.event.cancelBubble = true : e.stopPropagation(); //阻止事件冒泡
    $v_dot.css('top', h);
    video.volume = 1 - rate.toFixed(1);
    console.log(video.volume);
})

$expand.click(() => { //全屏
    console.log(1);
    if (!document.webkitIsFullScreen) {
        video.webkitRequestFullscreen();
    } else {
        document.webkitCancelFullScreen()
    }
})

//END



// 发送弹幕控件 


// 弹幕大小
$changeFontSize.click(function (params) {
    $(this).addClass('check').siblings().removeClass('check');
    fontSize = $(this).attr('fontsize');
    console.log(fontSize);
})


// 弹幕颜色

$changeFontColor.click(function (params) {
    $(this).addClass('check').siblings().removeClass('check');
    fontColor = $(this).attr('innercolor');
    console.log(fontColor)
})



// END




function con_pause() { //暂停或者 继续
    if (!pause) {
        video_pause();
    } else {
        video_con();
    }
}


function video_con() { // 视频继续
    pause = false;
    let spanArr = $danmuScreen[0].querySelectorAll('span');

    // 弹幕 滚动
    for (let i = 0; i <= spanArr.length - 1; i++) {
        console.log(spanArr[i])
        spanArr[i].timer();
    }
}


function video_pause() { //视频暂停API
    pause = true;
}


function sendDm(dm_ele) { //发送弹幕
    var This = dm_ele;
    if (This.d_color == 'vip') { //区分弹幕VIP
        console.log('vip')
        This.style.animation = 'randomColor 5s infinite';
    } else {
        This.style.color = This.d_color
    }

    This.style.fontSize = (This.d_size == 1 ? 20 : This.d_size == 0.5 ? 12 : This.d_size == 2 ? 26 : 20) + 'px';

    $danmuScreen[0].appendChild(This);

    var $dm = $(This);
    This.width = $dm.width();

    This.left = screenW + 5;
    This.size = This.d_size == 1 ? 20 : This.d_size == 0.5 ? 12 : This.d_size == 2 ? 26 : 20; //默认20像素大小
    // 保证每一个弹幕从开始到尾部离开屏幕的时间一样  越长的弹幕速度越快
    This.speed = (This.width + screenW) / 6500 * 13;

    This.style.left = This.left + 'px';
    This.style.top = Math.random() * beaginH + 'px';



    This.clear = false;
    This.timer = function () {
        setTimeout(function () {
            if (!pause) {
                if (This.clear) { // 是否到达了 需要清除弹幕的时候
                    This.timer = null;
                    This.parentNode.removeChild(This);
                } else {
                    This.left -= This.speed;
                    This.style.left = This.left + 'px';
                    if (This.left < (This.width + 6) * -1)
                        This.clear = true;
                    This.timer();
                }
            }
        }, 13)
    }
    This.timer();
    // 这里发送弹幕之后不需要重新刷新全局弹幕数组
}


// 等待五秒钟才能发弹幕
function wait(i) {
    let num;
    if (arguments.length === 0) {
        num = 0;
    } else {
        num = i;
    }
    if (num === 0) {
        sendFlag = false;
        $sendBt.addClass('ban');
        $sendBt.html('5s');
    }
    if (num < 5) {
        num++;
        setTimeout(function () {
            $sendBt.html((5 - num) + 's')
            wait(num);
        }, 1000)
    } else {
        sendFlag = true;
        $sendBt.removeClass('ban');
        $sendBt.html('发送');
    }
}

function crt_dm_record(obj) { //增加弹幕记录到弹幕列表
    /*obj 
    	userId			
    	date 
    	content
    	time
    	dmId
    */
    let oLi = document.createElement('li'),
        oDm_time = document.createElement('span'),
        oDm_content = document.createElement('span'), //弹幕内容
        oDm_date = document.createElement('span'),
        t = new Date(obj.date), //时间  
        oDelete = document.createElement('div'); //删除弹幕按钮
    oDm_time.className = 'dm_time';
    oDm_content.className = 'dm_content';
    oDm_date.className = 'dm_date';
    oDelete.className = 'btn';

    oLi.title = obj.content;
    oLi.setAttribute('user', obj.userId);
    oLi.setAttribute('dm_id', obj.dmId);
    oDm_time.innerHTML = obj.time;
    oDm_content.innerHTML = obj.content;
    oDm_date.innerHTML = (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes();
    oDelete.innerHTML = '删除弹幕';
    oDelete.onclick = function () {
        Ajax({
            url: 'play/d_dm',
            method: 'post',
            data: {
                id: $(this).parent()[0].getAttribute('dm_id')
            },
            success: function (data) {
                var jData = JSON.parse(data); // err : 0 成功   err : 1 失败
                if (!jData.err) { //成功
                    $(oDelete).parent().remove();
                } else {
                    showMsg({
                        msg: '删除弹幕失败',
                        detail: jData.info,
                        status: 'err',
                        delay: 1000
                    })
                }
            },
            error: function () {
                console.log('ajax err')
            }
        })
    }
    oLi.appendChild(oDm_time);
    oLi.appendChild(oDm_content);
    oLi.appendChild(oDm_date);
    oLi.appendChild(oDelete);
    $dm_list[0].appendChild(oLi);
}

function dm_load(arr) { //加载弹幕 存放在传入的 arr里面并刷新弹幕列表
    $dm_list.empty();
    Ajax({
        url: './play/get_dm',
        method: 'post',
        data: {
            v_id: videoId
        },
        success: function (data) {
            let jData = JSON.parse(data);
            if (!jData.err) { //弹幕加载成功
                let dms = jData['info'];
                $dmNum.html(dms.length); //渲染弹幕数量
                $dmNum2.html(dms.length);
                for (var i in dms) {
                    arr[i] = dms[i]; //将弹幕存储在 全局弹幕数组
                    crt_dm_record({ //添加弹幕记录
                        content: dms[i].d_content,
                        date: dms[i].d_sendTime,
                        time: dms[i].d_time,
                        dmId: dms[i].d_id,
                        userId: dms[i].d_userId
                    })
                }
                //加载成功后 渲染页面

            } else {
                console.log('弹幕加载失败');
                return null;
            }
            return arr;
        },
        error: function () {
            console.log('弹幕ajax加载失败错误-')
        }
    })
}

dm_load(gdms);

function time_format(t) {
    //整理时间 格式 将 0:23 处理成  00:23  
    //或者可以将 秒钟数处理成 分秒格式

    if (isNaN(Number(t))) {
        var arr = t.split(':');
        time_format(Number(arr[0]) * 60 + Number(arr[1]));
    } else {
        let m = parseInt(t / 60),
            s = parseInt(t % 60);
        if (m.toString().length === 1)
            m = '0' + m;
        if (s.toString().length === 1)
            s = '0' + s;
        return (m + ':' + s);
    };
}

let lengthOfSlideBar = parseInt($slideBar.css('width')); //获取进度条总长度


function video_progress_listener(e) { //监听视频当前播放时间定时器结合发送弹幕功能
    setTimeout(() => {
        if (!pause) {
            let t = time_format(video.currentTime.toFixed(0));
            $t_now.html(t); //更新 当前时间
            $t_total.html(time_format(video.duration)); //更新视频总时间
            let rate = video.currentTime / video.duration || 0; //进度比率
            $slideDot.css('left', lengthOfSlideBar * rate + 'px'); //  

            for (let i = 0; i < gdms.length; i++) {
                if (gdms[i].d_time === t) {
                    var crt_dms = $danmuScreen[0].querySelectorAll('span'), //当前视频存在的弹幕;
                        This = gdms[i],
                        exist = false; //是否存在当前弹幕已经发送 解决了弹幕重复发送问题
                    for (let i = 0; i < crt_dms.length && !exist; i++) {
                        const element = crt_dms[i];
                        if (element.d_id == This.d_id) {
                            exist = true;
                            // break;  
                        }
                    };
                    if (!exist) {
                        var oSpan = document.createElement('span');
                        oSpan.textContent = This.d_content;
                        oSpan.d_id = This.d_id;
                        oSpan.d_size = gdms[i].d_size;
                        oSpan.d_type = gdms[i].d_type;
                        oSpan.d_color = gdms[i].d_color;
                        sendDm(oSpan);
                    }

                }
            }
        }
        video_progress_listener();
    }, 1000);
}

video_progress_listener();

// video  绑定事件
video.onprogress = function (e) { //
    // console.log(e)
}
video.onpause = video_pause;
video.onplay = video_con;


//弹窗消息 : obj : { info 弹窗消息内容，err 警告 , success 成功 , callback, delay 显示时常 }
window.msg = function (obj) {
    // $()
}

// 评论 ↓

var totalPage = Number($('#totalPage').html()); // 总页数

// 评论翻页 
var changePage = function (params) {
    var currentPage;
    if (typeof (params) === 'number') currentPage = Number(params);
    else currentPage = Number($(this).html());

    iframe.src = '/play/get_cm?source=<%- locals.data.a_id %>&page=' + currentPage;
    iframePage.cm_fresh();
    // reload_cm_num();

    var crt_page = function (num) {
        var oSpan = document.createElement('span');
        oSpan.className = 'page';
        oSpan.innerHTML = num;
        if (num == currentPage) {
            oSpan.className += ' current'
        }
        if (isNaN(Number(num))) {
            if (num == '...') {
                oSpan.innerHTML = '...';
                oSpan.className += ' dots';
            } else if (num == '下一页') {
                var oNextPage = oSpan;
                oNextPage.innerHTML = '下一页';
                oNextPage.className = 'next page';
                oNextPage.id = 'nextPage';
                oNextPage.onclick = nextPage;
                return oNextPage;
            } else if (num == '上一页') {
                var oPrevPage = oSpan;
                oPrevPage.innerHTML = '上一页';
                oPrevPage.className = 'prev page';
                oPrevPage.id = 'prevPage';
                oPrevPage.onclick = prevPage;
                return oPrevPage;
            }
        }

        oSpan.onclick = changePage;
        return oSpan;
        // $pages_con.append(oSpan);
    };

    $pages_con.empty();


    //current 前
    if (currentPage != 1)
        $pages_con.append(crt_page('上一页'));

    if (currentPage <= 3) {
        for (var i = 1; i <= currentPage; i++) {
            $pages_con.append(crt_page(i));
        }
    } else {
        $pages_con.append(crt_page(1));
        $pages_con.append(crt_page('...'));
        for (var i = currentPage - 2; i <= currentPage; i++) {
            $pages_con.append(crt_page(i));
        }
    }

    // current 后
    if (totalPage - currentPage <= 2) { // 末置位
        for (var i = currentPage + 1; i <= totalPage; i++) {
            $pages_con.append(crt_page(i));
        }
    } else { //中置wei
        for (var i = currentPage + 1; i <= currentPage + 2; i++) {
            $pages_con.append(crt_page(i));
        }
        $pages_con.append(crt_page('...'));
        $pages_con.append(crt_page(totalPage));
    }
    if (currentPage != totalPage)
        $pages_con.append(crt_page('下一页'));

}

$cm_pages.click(function (params) { //翻页翻页
    changePage.call(this);
})

var nextPage = function (params) { // 下一页
    var currentPage = Number($('.container .current').html());
    if (currentPage != totalPage) //防止跳转到错误页
        changePage(currentPage + 1);
}

var prevPage = function (params) { //上一页
    var currentPage = Number($('.container .current').html());
    if (currentPage != 1)
        changePage(currentPage - 1);
}


var $sendText = $('#sendText');


$("#info .close").click(function () {
    $info.removeClass('show');
})

reload_cm_num = function (num) { //刷新评论数
    $cmNum.html(num.toString())
}

$sendCm.click(function (params) {
    var content = $sendText.val();
    $sendText.val('');
    Ajax({
        method: 'post',
        url: '/play/cm_send',
        data: {
            'content': content,
            'source_id': parseInt(self.location.href.split("=")[1]),
            'type': '' //默认评论视频  cm 评论评论
        },
        success: function (data) {
            let jData = JSON.parse(data);
            if (jData.err) {
                showMsg({
                    msg: '发送评论失败',
                    status: 'err',
                    detail: jData.info,
                    delay: 2000
                })
            } else { //发送评论成功
                showMsg({
                    msg: '发送评论成功',
                    callback: function () {
                        iframePage.cm_fresh();
                        iframe.style.height = (iframe.contentWindow.document.body.clientHeight) + 'px';
                    },
                    async: true,
                    delay: 850,
                    status: 'success',
                    detail: jData.info
                })

            }
        },
        err: function (params) {
            showMsg({
                msg: '发送失败 ajax 错误',
                status: 'err',
                detail: params
            })
        }
    })
})