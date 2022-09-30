<!--
 * @Author: el
 * @Date: 2020-12-04 13:57:36
 * @LastEditTime: 2021-02-19 14:20:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \华为Eos2.7.1.ucs\src\view\integratedCommunication\icpPhone\icpPhonePage\meetingSep\editMettingTemplate.vue
-->
<template>
  <div class="editMettingTemplate">
    <div class="editMettingTemplateWrap" >
        <header class="header">
            <span>会议模板</span>
            <i @click="closeThat" class="el-icon-close" ></i>
        </header>
        <aside class="content">
            <div class="content_left">
                <!-- 模板名称列表 -->
                <ul>
                    <li :class="item.flag?'content_left_li  content_left_li_active':'content_left_li'" v-for="(item,index) in meetinglistData" :key="index" @click="activeThatMeeting(item)" >
                        <span></span>
                        <p>{{item.name}}</p>
                        <div class="content_left_li_flex" >
                            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top"> -->
                                <div class="img_wrap" @click="editWindPupopVis=true" >
                                    <img class="wjh" src="@/assets/image/sort/redact.png" alt="">
                                    <img class="yjh" src="@/assets/image/sort/redact1.png" alt="">
                                </div>
                            <!-- </el-tooltip> -->
                            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top"> -->
                                <div class="img_wrap" @click="openTC(item)">
                                    <img class="wjh" src="@/assets/image/sort/sc.png" alt="">
                                    <img class="yjh" src="@/assets/image/sort/sc1.png" alt="">
                                </div>
                            <!-- </el-tooltip> -->
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content_right">
                <header class="content_right_header" >
                    <span></span> 会议成员
                </header>
                <aside class="content_right_content" >
                    <!-- 排序的DOM -->
                    <ul ref="sortEle" class="main_content_ul" >
                        <li class="main_content_li" v-for="(item,index) in allDataList" :key="index" :data="index" :style="{left:(index<5?'65px':'60px')}" style="position:static;" >
                            <div class="main_content_li_leftWrap">
                                <!-- 摄像头 -->
                                <img v-if="item.numberType == '9'" src="@/assets/image/sort/jk.png" alt="">
                                <!-- 终端 -->
                                <img v-else-if="item.numberType == '8'"  src="@/assets/image/sort/hc.png" alt="">
                                <!-- 对讲 -->
                                <img v-else-if="item.numberType == '1'"  src="@/assets/image/sort/dj.png" alt="">
                                <!-- 人 -->
                                <img v-else  src="@/assets/image/sort/r.png" alt="">
                                <span>{{item.name}}</span>
                            </div>
                            <img v-if="index==0" src="@/assets/image/sort/xs2.png" alt="">
                            <div v-else class="img_wrap" @click="upward(item,index,$event)" >
                                <img class="wjh" src="@/assets/image/sort/xs.png" alt="">
                                <img class="yjh" src="@/assets/image/sort/xs1.png" alt="">
                            </div>
                            <img v-if="index==allDataList.length-1" src="@/assets/image/sort/xx2.png" alt="">
                            <div v-else class="img_wrap" @click="downward(item,index,$event)" >
                                <img class="wjh" src="@/assets/image/sort/xx.png" alt="">
                                <img class="yjh" src="@/assets/image/sort/xx1.png" alt="">
                            </div>
                            <div class="img_wrap" @click="vdcpDeleteMember(item,index)" >
                                <img class="wjh" src="@/assets/image/sort/sc.png" alt="">
                                <img class="yjh" src="@/assets/image/sort/sc1.png" alt="">
                            </div>
                        </li>
                    </ul>

                </aside>
            </div>
        </aside>
        <footer class="footer">
            <!-- <el-button @click="closeThat" >取消</el-button> -->
            <el-button type="primary" @click="affirm" >启动会议</el-button>
        </footer>
    </div>
    <!-- 编辑模板名称弹窗 -->
    <editWindPupop 
        @returnVal="returnVal" 
        @closeEditWindPupopVis="closeEditWindPupopVis" 
        v-if="editWindPupopVis" >
    </editWindPupop>
    <!-- 删除弹窗 -->
    <promptDialogBox 
      v-if="promptConfig.visible"
      :prompt-dialog-config="promptConfig"
      @confirm="promptConfirm"
      @cancel="promptCanCel"
    ></promptDialogBox>
  </div>
</template>

<script>
import editWindPupop from "./editWindPupop.vue"; // 编辑模板名称弹窗
import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox.vue"; // 编辑模板名称弹窗

export default {
    name:'editMettingTemplate',
    data(){
        return{
            promptConfig: { // 提示弹窗的配置
                visible: false, // 是否显示弹窗
                promptType: 'delete', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
                promptTitle: '敏感信息发送提醒', // 弹窗标题
                promptText: '即将通过非密网络发送信息，请勿发送泄密信息', // 弹窗文本
                cancelButtonText: '取消', // 取消操作按钮文本
                confirmButtonText: '确定', // 确认操作按钮文本
                isNeedIcon: true  // 是否需要显示左边的图标
            },
            editWindPupopVis:false, // 编辑会议模板
            // 排序
            allDataList:[],
            // 排序
            fangdou:true,
            // 会议名称列表
            meetinglistData:[],
            delectId:''
        }
    },
    components:{
        editWindPupop,
        promptDialogBox
    },
    methods:{
        /**
         * @Description: el
         * @Date: 2020-12-05 16:31:33
         * @param {*}
         * @description: 获取会议列表
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        reqMeetingListData(){
            let data = {}
            this.$api.vdcpMeetingList(data).then(res =>{
                console.log(res.data)
                if (res.errorcode !== 0){
                    return
                }
                res.data.map(x=>{
                    x.flag = false
                    return x
                })
                this.meetinglistData = res.data
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:31:40
         * @param {*} val
         * @description: 修改模板名字
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        returnVal(val){
            // 拿到模板名称
            console.log(val);
            this.closeEditWindPupopVis()
            let data = {
                data:{
                    id:this.delectId,
                    name:val
                }
            }
            this.$api.vdcpMeetingUpdate(data).then(res =>{
                console.log(res.data)
                if (res.errorcode !== 0){
                    return
                }
                this.reqMeetingListData()
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:31:59
         * @param {*} members = [first,last]
         * @description: 成员排序 
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        vdcpMeetingOrderMembers (members){
            let firstInd = members[1].order,lastInd = members[0].order
            members[0].order = firstInd
            members[1].order = lastInd
            members.map((x,index)=>{
                x.videoTemplateId = this.delectId
                return x
            })
            let data = {
                members
            }
            this.$api.vdcpMeetingOrderMember(data).then(res =>{
                console.log(res.data)
                if (res.errorcode !== 0){
                    return
                }
                // 获取成员列表
                // this.activeThatMeeting({id:this.delectId})
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:32:17
         * @param {*} item
         * @param {*} index
         * @description: 删除成员
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        vdcpDeleteMember(item,index){
            this.allDataList.splice(index,1)
            let data = {
                videoTemplateId:this.delectId,
                memberType:item.memberType,
                memberId:item.memberId
            }
            this.$api.vdcpMeetingDeleteMember(data).then(res =>{
                console.log(res.data)
                if (res.errorcode !== 0){
                    return
                }
                // 获取成员列表
                this.activeThatMeeting({id:this.delectId})
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:32:26
         * @param {*}
         * @description: 确认删除这个模板
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        promptConfirm () {
            this.promptConfig.visible = false; 
            let data = {
                ids:[this.delectId]
            }
            this.$api.vdcpMeetingDelete(data).then(res =>{
                console.log(res.data)
                if (res.errorcode !== 0){
                    return
                }
                this.reqMeetingListData()
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:32:32
         * @param {*} item
         * @description: 查询当前模板的会议成员 激活这个会议名称的样式 
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        activeThatMeeting (item) {
            this.meetinglistData.forEach(ele=>{
                ele.flag = false
            })
            item.flag = true
            this.delectId = item.id
            // 根据ID获取这个模板下 成员
            let data = {
                videoTemplateId:item.id
            }
            this.$api.vdcpMeetingListById(data).then(res =>{
                let data = res.data.memberList.reduce((pre,ele) => {
                    let obj = {...ele.member,...ele.memberRel}
                    obj.content = {
                        call: (obj.extend1?obj.extend1:(obj.extend2?obj.extend1:(obj.extend3?obj.extend3:obj.indexCode))),
                        meetingType: obj.meetingType,
                        name: obj.name,
                        numType: obj.numberType
                    }
                    pre.push(obj)
                    return pre
                }, [])
                this.allDataList = data
                console.log(data);
                if (res.errorcode !== 0){
                    return
                }
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:32:43
         * @param {*} item
         * @param {*} index
         * @param {*} e
         * @description: 向上
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        upward(item,index,e){
            let members = [item,this.allDataList[index-1]]
            this.vdcpMeetingOrderMembers(members)
            this.conmmFun(item,index,e,'upward')
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:32:50
         * @param {*} item
         * @param {*} index
         * @param {*} e
         * @description: 向下
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        downward(item,index,e){
            let members = [this.allDataList[index+1],item]
            this.vdcpMeetingOrderMembers(members)
            this.conmmFun(item,index,e,'')
            
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:33:04
         * @param {*} item
         * @param {*} index
         * @param {*} e
         * @param {*} type
         * @description: 位移方法
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        conmmFun (item,index,e,type){
            const that = this
            // 单前元素
            let slefEle = e.currentTarget.parentNode
            let nextElement = ''
            if(type == 'upward'){
                nextElement = e.currentTarget.parentNode.previousElementSibling
            }else{
                nextElement = e.currentTarget.parentNode.nextElementSibling
            }
            // 父元素
            let parseEle = this.$refs.sortEle
            let left = slefEle.offsetLeft
            let top = slefEle.offsetTop
            let parentTop = nextElement.offsetTop
            let newHidele = document.createElement('div')
            newHidele.style.height = ((slefEle.offsetHeight)*2) +'px'
            if(type == 'upward'){
                setTimeout(()=>{
                    slefEle.style.top = (slefEle.offsetTop - slefEle.offsetHeight)+'px'
                    nextElement.style.top = (nextElement.offsetTop + nextElement.offsetHeight)+'px'
                },10)
            }else{
                setTimeout(()=>{
                    slefEle.style.top = (slefEle.offsetTop + slefEle.offsetHeight)+'px'
                    nextElement.style.top = (nextElement.offsetTop - nextElement.offsetHeight)+'px'
                },10)
            }
            if(nextElement.nextElementSibling){
                let nextEle = nextElement.nextElementSibling
                parseEle.insertBefore(newHidele,nextEle)
            }else if(type == 'upward'){
                parseEle.insertBefore(newHidele,parseEle.children[0])
            }else{
                parseEle.appendChild(newHidele)
            }

            if(!this.fangdou){
                return
            }
            this.fangdou = false
            slefEle.style.cssText = 'left:'+left+'px;transition: all .3s;position:absolute;top:'+top+'px;z-index:3;'
            nextElement.style.cssText = 'left:'+left+'px;transition: all .3s;position:absolute;top:'+parentTop+'px;z-index:1;'
            setTimeout(()=>{
                slefEle.style.cssText = 'left:'+left+'px;transition: all .3s;position:static;top:'+top+'px;z-index:0;'
                nextElement.style.cssText = 'left:'+left+'px;transition: all .3s;position:static;top:'+parentTop+'px;z-index:0;'
                parseEle.removeChild(newHidele)
                let data = []
                if(type == 'upward'){
                    data = that.allDataList[index-1]
                    that.allDataList[index-1] = item
                }else{
                    data = that.allDataList[index+1]
                    that.allDataList[index+1] = item
                }
                that.allDataList[index] = data
                that.allDataList.push(item)
                that.allDataList.pop()
                that.fangdou = true
            },300)
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:33:12
         * @param {*} item
         * @description: 打开弹窗
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        openTC(item){
            this.promptConfig.visible = true; 
            setTimeout(()=>{
                // 隐藏遮罩
                document.querySelector('.v-modal').style.display = 'none'
            })
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:33:33
         * @param {*}
         * @description: 关闭
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        closeThat(){
            this.$emit('cancel')
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:33:39
         * @param {*}
         * @description: 确认
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        affirm(){
            this.$emit('affirm',this.allDataList)
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:33:43
         * @param {*}
         * @description: 关闭弹窗
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        closeEditWindPupopVis(){
            this.editWindPupopVis = false
        },
        /**
         * @Description: el
         * @Date: 2020-12-05 16:33:48
         * @param {*}
         * @description: 隐藏弹窗
         * @LastEditors: Seven
         * @LastEditTime: Do not edit
         */
        promptCanCel() {
            this.promptConfig.visible = false; 
        },
    }
}
</script>

<style lang="scss" scupod>
ul{
    margin: 0;
    padding: 0;
}
.editMettingTemplate{
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom: 0;
    margin: auto;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background: rgba(0,0,0,.5);
}
.editMettingTemplateWrap{
    width: 776px;
    height: 804px;
    // height: 720px;
    background: #FFFFFF;
    box-shadow: 0px 0px 21px 3px rgba(0,0,0,0.27);
    border-radius: 7px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    .content{
        height: 663px;
        overflow: hidden;
        display: flex;
        border-bottom: 1px solid #E9ECF1;
        .content_left{
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            width: 243px;
            border-right: 1px solid #E9ECF1;
        }
        .content_right{
            flex: 1;
            .content_right_header{
                height: 56px;
                border-bottom: 1px solid #E9ECF1;
                font-size: 20px;
                font-weight: 500;
                color: #333333;
                line-height: 56px;
                span{
                    display: inline-block;
                    width: 3px;
                    height: 18px;
                    background: #0091FF;
                    margin: 0 5px 0 17px;
                }
            }
            .content_right_content{
                height: 606px;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
    .footer{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        padding-right: 27px;
        box-sizing: border-box;
        align-items: center;
    }
}
.content_left_li{
    padding-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
    list-style: none;
    height: 45px;
    display: flex;
    align-items: center;
    position: relative;
    span{
        position: absolute;
        top:0;
        left: 0;
        display: block;
        height: 100%;
        width: 3px;
        background: #0091FF;
        visibility: hidden;
    }
    p{
        flex: 1;
        margin-left: 25px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
    }
    .content_left_li_flex{
        display: none;
    }
}
.content_left_li_active>span{
    visibility: visible;
}
.content_left_li_active>.content_left_li_flex{
    display: flex;
}
.content_left_li:hover,.content_left_li_active{
    background: rgba(0, 145, 255, .1);
}

.main_content_ul{
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
}
.main_content_li{
    transition: all .3s;
    height:59px;
    min-width: 531px;
    margin: auto;
    padding: 0px 7px 0px 14px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #E9ECF1;
}
.main_content_li_leftWrap{
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    display: flex;
    align-items: center;
    img{
        margin-right: 10px;
    }
}
.main_content_li>img{
    width: 22px;
    height: 22px;
    margin-left: 7px;
}
.footer{
    height: 84px;
    border-top: 1px solid #E9ECF1;
    display: flex;
    justify-content: flex-end;
    padding: 0 27px;
    box-sizing: border-box;
    align-items: center;
}

.main_content_li .img_wrap{
    cursor: pointer;
    width: 22px;
    height: 22px;
    margin-left: 7px;
}
.main_content_li .img_wrap>img{
    width: 100%;
    height: 100%;
}
.wjh{
    display: block;
}
.yjh{
    display: none
}
.main_content_li .img_wrap:hover .yjh{
    display: block;
}
.main_content_li .img_wrap:hover .wjh{
    display: none;
}

</style>