<!--
 * @Author: el
 * @Date: 2020-12-04 10:35:56
 * @LastEditTime: 2020-12-04 13:42:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \华为Eos2.7.1.ucs\src\view\integratedCommunication\icpPhone\icpPhonePage\meetingSep\editWindPupop.vue
-->
<template>
  <div class="editWindPupop" >
    <header class="header" >
        <span>会议模板编辑</span>
        <i @click="closeThat" class="el-icon-close" ></i>
    </header>

    <aside class="contnet" >
        <span>模板名称</span>
        <el-input v-model.trim="val" ></el-input>
    </aside>

    <footer class="footer" >
        <el-button @click="closeThat" >取消</el-button>
        <el-button type="primary" @click="returnVal" >确认</el-button>
    </footer>

  </div>
</template>

<script>
export default {
    name:'editWindPupop',
    data(){
        return{
            val:''
        }
    },
    methods:{
        /**
         * @Description: el
         * @Date: 2020-12-04 13:40:22
         * @param {*}
         * @description: 获取输入框的值
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        returnVal(){
            this.$emit('returnVal',this.val)
        },
        /**
         * @Description: el
         * @Date: 2020-12-04 13:40:13
         * @param {*}
         * @description: 关闭窗口
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        closeThat(){
            this.$emit('closeEditWindPupopVis')
        }
    }
}
</script>

<style lang="scss" scoped >
.editWindPupop{
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    margin: auto;
    width: 400px;
    height: 250px;
    background: #FFFFFF;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    z-index: 9999999;
    overflow: hidden;
    display: flex;
    flex-direction:column;
    .header{
        width: 100%;
        display: flex;
        height: 56px;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 10px;
        box-sizing: border-box;
        font-weight: 400;
        color: #333333;
        font-size:18px;
        background: #F1F4F6;
        align-items: center;
        i{
            cursor: pointer;
        }
    }
    .contnet{
        display: flex;
        height: 120px;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F2F2F2;
        div{
            margin-left: 28px;
            width: 60%;
        }
    }
    .footer{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        padding-right: 26px;
        box-sizing: border-box;
        align-items: center;
    }
}


</style>