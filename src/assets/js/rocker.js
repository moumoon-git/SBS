/*
    ele => EleDom 生成元素的容器   *必须
    className => 元素名字         *必须
    cb  => 触发事件操作函数  return {type,ele,index} type 为事件类型 index 1-8 按照上右下左方向
    customFun [
        {
            fun,   方法
            type   事件名  click mousedown 
        }
    ] => 自定义的事件  ele = 每个元素  eleParent = 父元素
    style:{
        width,
        height
    }
*/

function EL_rocker (ele,className,cb,customFun='',style={width:200,height:200},num=8){
this.ele = ele 
this.className = className
this.cb = cb
this.customFun = customFun
this.style = style
this.num = num
}
// 插入DOM
EL_rocker.prototype.loading = function (){
    if(this.ele.children.length!=0){
        Array.from(this.ele.children).forEach(ele=>{
            if(ele.className == this.className){
                return
            }
        })
    }
    let eleDom = ''
    for (let index = 0; index < this.num; index++) {
        eleDom+='<li data-index="'+(index+1)+'" ></li>'
    }
    let uls = document.createElement('ul')
    uls.className = this.className
    uls.innerHTML = eleDom
    this.ele.appendChild(uls)
    let ulWrap = document.querySelectorAll(`.${this.className} li`)
    let rotateNum = 360/ulWrap.length
    ulWrap.forEach((ele, index) => {
        ele.style.cssText = `transform: rotate(${index*rotateNum}deg) skew(-2deg,${this.num<8?0:-45}deg);z-index:${index+1}`
    })
    this.styleInterposition()
    this.DomEvent()
}
// 插入样式
EL_rocker.prototype.styleInterposition = function () {
    let styleCss = `*{
        margin: 0;
        padding: 0;
    }
    ${'.'+this.className}{
        width: ${this.style.width}px;
        height: ${this.style.height}px;
        border-radius: 50%;
        position: relative;
        box-shadow: 0px 0px 8px 5px #EDEDED;
        overflow: hidden;
        transform: rotate(${this.num<8?-45:-23}deg);
    }
    ${'.'+this.className + ' li'}{
        width: ${this.style.width/2}px;
        height: ${this.style.width/2}px;
        position: absolute;
        background-color: #fff;
        line-height: 65px;
        text-align: center;
        font-size: 12px;
        left: 50%;
        top: 0px;
        margin-top: 0px;
        transform-origin: 2px ${this.style.width/2}px;
        list-style: none;
        border: 1px solid #EDEDED;
        overflow: hidden;
        cursor: pointer;
        transform:skew(30deg,20deg);
    }
    ${'.'+this.className + ' li'}::before{
        content: '';
        width: ${this.style.width/13}px;
        height: ${this.style.width/13}px;
        display: block;
        background: skyblue;
        border-radius: 50%;
        margin-left: ${this.num<8?'50%':'25%'};
        margin-top: ${this.num<8?'35%':'55%'};
        transform: skew(1deg,${this.num<8?'0':'45'}deg);
    }
    ${'.'+this.className + ' li'}:hover {
        background: skyblue;
    }
    ${'.'+this.className + ' li'}:hover::before{
        background: #fff;
    }
    ${'.'+this.className}::after{
        content: '';
        width: ${this.style.width/3}px;
        height: ${this.style.width/3}px;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #EDEDED;
        z-index: 10;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        
    }`
    let styleEle = document.getElementsByTagName('style')[0]
    if(!styleEle){
        let style = document.createElement('style')
        style.innerText=styleCss
        document.getElementsByTagName('head')[0].appendChild(style)
    }else{
        styleEle.innerText = styleEle.innerText+=styleCss
    }
}
// 进行事件的监听
EL_rocker.prototype.DomEvent = function () {
    const that = this
    let eleAll = document.querySelectorAll(`.${this.className} li`)
    eleAll.forEach(ele=>{
        ele.addEventListener('mousedown', function(){
            that.cb({ele,type:'mousedown',index:this.getAttribute('data-index')})
        })
        ele.addEventListener('mouseup', function(){
            that.cb({ele,type:'mouseup',index:this.getAttribute('data-index')})
        })
    })
    // 自定义事件绑定
    if(that.customFun.constructor === Array){
        eleAll.forEach(ele=>{
            that.customFun.forEach(eleFun=>{
                ele.addEventListener(eleFun.type, eleFun.fun)
            })
        }) 
    }
}

export default EL_rocker