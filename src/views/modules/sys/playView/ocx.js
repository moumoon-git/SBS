$(function () {

    //延迟初始化
    $(document).ready(function () {
        setTimeout(function () {
            init();
        }, 50); //这里设置延迟是为了正确加载OCX(取决于电脑性能,具体数值请根据实际情况设定,通常不需要修改 直接调用init()是可行的)
        setTimeout(function () {
            $('#PlayViewOCX').css({
                'width': '100%',
                'height': '100%'
            });
        }, 500);//这里设置延迟(数值请根据实际情况来)是防止快速刷新页面导致进程残留  具体清楚进程方式请参考<关闭进程 云台控制>demo中的代码
    });

    //初始化
    function init() {
        var OCXobj = document.getElementById("PlayViewOCX");
        var txtInit = $("#config").val();
        OCXobj.ContainOCX_Init(txtInit);
    }

    //获取签名认证
    $('.submit').on('click', function () {
        xmlhttp = null;
		if (window.XMLHttpRequest) {// code for Firefox, Opera, IE7, etc.
			xmlhttp = new XMLHttpRequest();
		} else if (window.ActiveXObject) {// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		//编写回调函数
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			 var result =  JSON.parse(xmlhttp.responseText)
			//  console.log(result.data.appSecret)
			//  console.log(result.data.time)
			//  console.log(result.data.timeSecret)
			 var param = 'ReqType:' + 'PlayReal' + ';' + 'SvrIp:' + 'open8200.hikvision.com' + ';'+'WndCount: 1'+';' + 'SvrPort:' + 443 + ';' + 'Appkey:' + 26135724  + ';' + 'AppSecret:' + result.data.appSecret + ';' + 'time:' + result.data.time + ';' + 'timesecret:' + result.data.timeSecret + ';' + 'httpsflag:' + 1 + ';' + 'CamList:' + '00000000001310013707' + ';';
             //如果初始化传了WndCont值 这里也需要传 如demo中设置了WndCont:1  这里也要传WndCont:1  如果使用默认四窗口则可以不传

             play_ocx_do(param);
			}
		}
		//open设置请求方式和请求路径
		xmlhttp.open("get", "http://192.168.6.88:8848/getEncryptionProtocol?token=a5b0de20d21589db1714a994872cb378");//一个servlet，后面还可以写是否同步
		//send 发送
		xmlhttp.send();
           
    });

    ////OCX控件视频处理函数
    function play_ocx_do(param) {
        if ("null" == param || "" == param || null == param || "undefined" == typeof param) {
            return;
        } else {
            var OCXobj = document.getElementById("PlayViewOCX");
            OCXobj.ContainOCX_Do(param);
        }
    }
});