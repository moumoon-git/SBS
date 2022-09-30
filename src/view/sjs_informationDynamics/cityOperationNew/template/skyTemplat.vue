<template>
    <div class="skyTemplat_wrap" >
        <div class="skyTemplat_header" >
            <h3><img src="../../../../../static/img/blackboard.png" alt="">{{titleName}}</h3>
            <div class="skyTemplat_input_wrap" >
                <el-date-picker
                    v-model="monthVal"
                    @change=monthValchange
                    type="month"
                    placeholder="月份范围">
                </el-date-picker>
                <el-button @click="outOffinfo" type="primary">模板管理</el-button>
                <el-button type="primary" @click="exportDoc" >导出</el-button>
            </div>
        </div>
        <div class="skyTemplat_content">

            <div class="skyTemplat_content_list" v-for="(item,index) in litsData" :key="index"  >
                <!-- bug 11239 修改复选框样式 author:husiyue date:2021.04.08 -->
                <div class="skyTemplat_content_list_check" @click="getCheckDate(item.date,index)" ref="isCheck">
                    <!-- <span @click="getCheckDate(item.date,index)" ref="isCheck">.</span> -->
                </div>
                <div class="skyTemplat_content_list_left" >
                    <p>{{item.date}}</p>
                    <span>{{titleName}}:</span>
                </div>
                <div class="skyTemplat_content_list_right" >
                    <textarea class="allTextInput" v-model="item.content" disabled ></textarea>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name:'skyTemplat',
    data () {
        return{
            // 月份的val
            monthVal:'',
            monthValStr:'',
            titleName:"空气质量",
            changeData:[],
            checkDateList:[]
        }
    },
    props:['litsData'],
    mounted(){
        
    },
    methods:{
        /** 
         * @LastEditTime: 2020-09-25 16:18:50
         * @LastEditors: qinjiaqi
         * @param {Object} 所有有改动的日期的信息
         * @return {type} undefined
         * @Description: 把原来的id不同就flag=false改掉了
         */           
        observe(data){
            const _that = this
            data.forEach(ele=>{
                for (let key in ele) {
                    let val = ele[key]
                    console.log("ele[key]", ele[key]);
                    Object.defineProperty(ele, key, {
                        enumerable: true,
                        get() {
                            return val
                        },
                        set(newVal) {
                            // if (val !== newVal) {
                            val = newVal
                            let flag = true
                            _that.changeData.forEach(eles=>{
                                if(eles.id==ele.id){
                                    console.log("observe当中eles.id: ",eles.id);
                                    // flag = false
                                }
                            })
                            if(flag){
                                _that.changeData.push(ele) 
                            }
                            // console.log(_that.changeData);
                            //}
                        }
                    })
                }
            })
            
        },
        monthValchange () {
            let dateVal = new Date(this.monthVal)
            let str = dateVal.getFullYear() + '-' + ((dateVal.getMonth()+1)<10?'0'+(dateVal.getMonth()+1):(dateVal.getMonth()+1))
            console.log(str)
            this.monthValStr = str
            this.$emit('SkyTemplateMonthVal',str)
        },
        outOffinfo () {
            this.$emit('outOffinfo','')
        },
        /*
         *@Description: 
         *@MethodAuthor:  XRY
         *@date: 点击的行时间
         *@index: 点击的行索引
         *@Date: 2021-01-06 17:19:15
        */
        getCheckDate(date,index) {
            let nowDate = date
            if(this.$refs.isCheck[index].innerText == '✓') {
                this.$refs.isCheck[index].innerText = '.'
                this.$refs.isCheck[index].style.color = 'transparent'
                this.checkDateList.forEach((ele,index,arr)=>{
                    if(ele == nowDate) {
                        arr.splice(index,1)
                    }
                })
            }
            else{
                this.$refs.isCheck[index].innerText = '✓'
                this.$refs.isCheck[index].style.color = 'green'
                this.checkDateList.push(nowDate)
            }
        },
        /*
         *@Description: 导出
         *@MethodAuthor:  XRY
         *@param: {}
         *@Date: 2021-01-06 16:38:25
        */
        exportDoc() {
            // 排序
            this.checkDateList.sort((a,b)=> {
                return (new Date(a)) - (new Date(b))
            })
            console.log(this.checkDateList)
            this.$emit('newEduce',this.checkDateList)
        }

    },
    watch:{
        'litsData':function(val){
            this.changeData=[]
            this.observe(val)
        }
    }
}
</script>

<style scoped >
.skyTemplat_wrap{
    width: 100%;
    height: 100%;
    padding: 14px 20px ;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 0;
}
.skyTemplat_header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.skyTemplat_header>h3{
    margin: 0;
    font-size: 20px;
}
.skyTemplat_header /deep/ .el-button{
    font-size: 17px;
}
.skyTemplat_header>h3>img{
    vertical-align: middle;
    width: 28px;
    height: 22px;
    margin-right: 8px;
    margin-top: -2px;
}
.skyTemplat_content{
    flex: 1;
    padding-top: 54px;
    box-sizing: border-box;
    overflow: auto;
}
.skyTemplat_content>div:last-child{
    margin: 0;
}
.skyTemplat_content_list{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
/* .skyTemplat_content_list_check {
    width: 51px;
    line-height: 84px;
    text-align: center;
    height: 84px;
    font-size: 16px;
} */
.skyTemplat_content_list_check {
    margin: 6px 15px 0 13px;
    text-align:center;
    width:14px;
    height:14px;
    color:transparent;
    font-size:16px;
    border:1px solid #ccc;border-radius: 2px;
    overflow:initial;
    cursor:pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    /* padding: 10px;
    border-radius: 24%;
    border: 1px solid #000;
    color: #fff; */
}
.skyTemplat_content_list_left{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-right: 10px;
}
.skyTemplat_content_list_left>p{
    font-size:17px;
    font-weight:400;
    color:rgba(0,145,255,1);
    margin-top: 0;
}
.skyTemplat_content_list_left>span{
    font-size:17px;
    font-weight:400;
    color:rgba(85,85,85,1);
}
.skyTemplat_content_list_right{
    outline: none;
    flex: 1;
    height:84px;
    border-radius:4px;
    border:1px solid rgba(221,221,221,1);
    text-align: left;
    padding: 5px;
    box-sizing: border-box;
}
.allTextInput{
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    color: #666666;
    font-size: 14px;
}
.skyTemplat_input_wrap{
    height: 45px;
    line-height: 45px;
}


</style>