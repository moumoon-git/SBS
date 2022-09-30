<!--
 * @Author: yaoweixin
 * @Date: 2020-12-11 14:30:56
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-17 17:58:46
 * @Description: 返回弹框
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\components\returnDialog.vue
-->
<template>
    <div class="returnDialog">
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="562px"
            :show-close="false"
            :close-on-click-modal="false"
            >
           <div class="remarkContainer">
               <img :src="imgSrc" alt="" class="imgStyle">
               <div class="toastText">{{toastText}}</div>
           </div> 
           <slot name="buttonContainer">
               <div class="buttonWrapper" v-if="status == 'ret'">
                   <div class="quitButton" @click="closeDialog">取消</div>
                   <div class="sureButton" @click="saveDialog">确定</div>
               </div>
               <div class="buttonWrapper" v-else>
                   <div class="saveReturn" @click="returnTableList">
                       返回操作列表
                   </div>
               </div>
           </slot>
        </el-dialog>
    </div>
</template>
<script>
import returnRemark from '@/assets/img/specialTopicImg/returnRemark.png'
import saveRemark from '@/assets/img/specialTopicImg/saveRemark.png'
export default {
    name: 'returnDialog',
    data() {
        return {
             title: '',
             dialogVisible: false,
             imgSrc: '',
             toastText: '',
             status: ''
        }
       
    },
    methods: {
        /**
         * @description: 新增成功返回列表
         * @param {*}
         * @return {*}
         */
        returnTableList() {
            this.dialogVisible = false
            this.$emit('returnTableList')
        },
        init(status) {
        this.status = status
        let obj = this.getImgAndText(status)
        this.imgSrc = obj.imgSrc
        this.toastText = obj.toastText
        this.title = obj.title
        this.dialogVisible = true
    },
    getImgAndText(status) {
        let obj = {
            ret: {
                imgSrc: returnRemark,
                toastText: '数据尚未保存，是否继续返回？',
                title: '返回提示'
            },
            sav: {
                imgSrc: saveRemark,
                toastText: '恭喜，提交成功！',
                title: '保存提示'  
            }
        }
        return obj[status]
    },
    closeDialog() {
      this.$emit('close')  
      this.dialogVisible = false
    },
    saveDialog() {
       this.dialogVisible = false
       this.$emit('save') 
       
    }
    }
    
}
</script>
<style lang="less" scoped>
.returnDialog {
  .el-dialog {
    .remarkContainer {
        display: flex;
        align-items: center;
        padding-left: 74px;
        border-bottom: 1px solid #f2f2f2;
        padding-bottom: 62px;
      img.imgStyle {
          width: 65px;
          height: 67px;
      }

      .toastText {         
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #555555;
        margin-left: 24px;
      }
    }

      .buttonWrapper {
          display: flex;
          align-items: center;
          margin-top: 14px;
          margin-left: 387px;
        .quitButton {
            width: 73px;
            height: 42px;
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #DEE4EC;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            text-align: center;
            line-height: 42px;
            cursor: pointer;
        }

        .sureButton {
            cursor: pointer;
            width: 73px;
            height: 42px;
            background: #0091FF;
            border-radius: 4px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            margin-left: 8px;
            text-align: center;
            line-height: 42px;
        }
      }
      .buttonWrapper {
           margin-top: 14px;
          margin-left: 387px;
        .saveReturn {
            width: 141px;
            height: 42px;
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #DEDEDE; 
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            text-align: center;
            line-height: 42px;
        }
        }
  }
}
</style>