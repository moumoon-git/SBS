/**
 * @Description: el
 * @Date: 2021-03-16 11:08:03
 * @param {*} url    请求地址
 * @param {*} method 请求方式
 * @param {*} params 请求参数
 * @param {*} token  秘钥
 * @param {*} fileName  自定义的文件名  默认是获取后台
 * @description: 
 * 单前只支持get和post
 * @LastEditors: Seven
 * @LastEditTime: Do not edit
 */
function exportFile({url,method,params,token,fileName}) {
    return new Promise((resolve,reject)=>{
        if (params instanceof Object ) {
            // 处理参数
            let str = '';
            for (const key in params) {
                str += key + '=' + params[key] + '&';
            }
            str = str.substring(0, str.length - 1);
            let newUrl = url + '?' + str
            // 新建ajax
            var xhr = new XMLHttpRequest();
            if (method.toLocaleLowerCase() === 'post') {
                newUrl = url
            }
            xhr.open(
                method,
                newUrl,
                true
            );
            xhr.withCredentials = true;
            if (method.toLocaleLowerCase() === 'post') {
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
            }
            xhr.setRequestHeader('token', token)
            xhr.responseType = 'blob'; // 返回类型blob
            // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            xhr.onload = function() {
                // 请求完成
                if (this.status === 200) {
                    // 返回200
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
                    reader.onload = function(e) {
                        // console.log(xhr.getAllResponseHeaders());
                        // Refused to get unsafe header "Content-Disposition" 请后台加上：
                        // response.Content.Headers.Add("Access-Control-Expose-Headers", "Content-Disposition");
                        // 获取文件格式
                        let fileType = xhr.getResponseHeader('Content-Disposition')
                        // 转换完成，创建一个a标签用于下载
                        let a = document.createElement('a');
                        // Content-disposition: attachment;filename=å€¼ç­æŽ’ç­è¡¨.xlsx
                        let nameArr = fileType.substring(fileType.lastIndexOf('=')+1).split('.')
                        let lastStr = fileType.substring(fileType.lastIndexOf('.'))
                        // 转码后的中文字符 å€¼ç­æŽ’ç­è¡¨(ISO_8859_1编码) => 转为中文  
                        let tfFileName = decodeURIComponent(escape(nameArr[0]))
                        
                        // 如果有自己设定的名字就用自定义的，否则就使用服务端返回的
                        let downloadFileName = fileName?fileName: (tfFileName + lastStr).trim()

                        a.download = downloadFileName
                        a.setAttribute('target', '_blank');
                        a.setAttribute('target', '_self');
                        a.href = e.target.result;
                        document.body.append(a); // 修复firefox中无法触发click
                        a.click();
                        // document.body.remove(a);
                        resolve({download:'success'})
                    };
                }
            };
            // 发送ajax请求
            if (method.toLocaleLowerCase() === 'post') {
                xhr.send(str);
            }else{
                xhr.send();
            }
        }else{
            reject({err:'params is not a Object'})
        }
    })
}

export default exportFile