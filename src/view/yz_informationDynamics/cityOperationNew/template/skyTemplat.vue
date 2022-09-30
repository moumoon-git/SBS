<template>
    <div class="skyTemplat_wrap" >
        <div class="skyTemplat_header" >
            <h3><img src="../../../../../static/img/blackboard.png" alt="">{{titleName}}</h3>
            <el-button @click="outOffinfo" type="primary">导出报告/.doc</el-button>
        </div>
        <div class="skyTemplat_content">

            <div class="skyTemplat_content_list" v-for="(item,index) in litsData" :key="index"  >
                <div class="skyTemplat_content_list_left" >
                    <p>{{item.date}}</p>
                    <span>{{titleName}}:</span>
                </div>
                <div contenteditable="true" class="skyTemplat_content_list_right" >
                    <textarea class="allTextInput" v-model="item.content" ></textarea>
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
            titleName:"空气质量",
            changeData:[]
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
        outOffinfo () {
            this.$emit('outOffinfo','')
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



</style>