let get=function(url,param){
    var temporaryStr
    Promise.resolve(Object.keys(param).forEach(item=>{
        if(temporaryStr){
            temporaryStr+=`&${item}=${param[item]}`
        }else{
            temporaryStr=`${item}=${param[item]}`
        }    
    })).then(()=>{
        window.open(`${url}?${temporaryStr}`)
    })  
}

let post=function(url,data){
    this.$http({
        url: url,
        method: "post",
        data: this.$http.adornData(data)
    }).then(({ data }) => {
        const blob = new Blob([res.data]);//,{type: 'application/vnd.ms-excel;charset=utf-8'}

        const elink = document.createElement('a');

        elink.style.display = 'none';

        elink.href = URL.createObjectURL(blob);

        document.body.appendChild(elink);

        elink.click();

        URL.revokeObjectURL(elink.href); // 释放URL 对象

        document.body.removeChild(elink);
    })
}

export {get,post}