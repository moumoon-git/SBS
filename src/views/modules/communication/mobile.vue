<template>
    <div >

      <el-row :gutter="20">
        <el-row style="padding: 0 10px;">
          <el-tabs v-model="activeName" @tab-click="handleClick($event)">
            <el-tab-pane label="通讯中心" name="first"></el-tab-pane>
            <el-tab-pane label="通讯历史" name="second"></el-tab-pane>
            <el-tab-pane label="常用联系人" name="three"></el-tab-pane>
          </el-tabs>
        </el-row>
          <el-col :span="18" v-if="tabFlag=='first'">
            <el-row  :gutter="20">
              <el-col :span="8" style="height: 100%;">
                <div class="grid-content bg-purple" style="height: 100%;" >
                  <!--            组织架构-->
                  <communication-mobile-list class="zzjg"></communication-mobile-list>
                </div>
              </el-col>

              <el-col :span="16">
                <div class="grid-content bg-purple-light">
                  <!--            联系人-->
                  <communication-mobile-human  class="content_human_list"></communication-mobile-human>
                </div>
              </el-col>
            </el-row>

          <el-row>
<!--             历史联系人-->
            <communication-history-human  class="history_human" style="margin-top: 10px" v-on:childByValue="childByValues" >

            </communication-history-human>
          </el-row>

        </el-col>

<!--        查看历史联系人-->
        <el-col :span="18" v-if="tabFlag=='second'">
          <communication-history-human-all v-on:tow="tow">

          </communication-history-human-all>
        </el-col>

<!--        常用联系人-->
        <el-col :span="18" v-if="tabFlag=='three'">
          <div>
            <mobile-common></mobile-common>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="grid-content bg-purple" >
<!--            拨号-->
          <communication-clla-mobile></communication-clla-mobile>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import Bus from '@/utils/bus'
  import communicationMobileList from './mobile_list'   // 联系人架构
  import communicationMobileHuman from './mobile_human'  // 联系人列表
  import communicationCllaMobile from './clla_mobile'   // 拨打电话
  // eslint-disable-next-line camelcase
  import communicationHistory_human from './history_human'  // 历史联系人
  // eslint-disable-next-line camelcase
  import communicationHistory_human_all from './history_human_all' // 所有历史联系人
  // eslint-disable-next-line camelcase
  import mobile_common from './mobile_common/mobile_common' // 常用联系人


  export default {
    name: 'mobile',
    data () {
      return {
        tabFlag: 'first',
        activeName: 'first'
      }
    },
    methods: {
      childByValues (value) {
        // console.log(value)
        this.tabFlag = value
      },
      tow (value) {
        // console.log(value)
        this.tabFlag = value
      },
      handleClick (e) {
        // 标签页
        // console.log('选择', e.label, e.index, e.name)
        this.tabFlag = e.name
        // eslint-disable-next-line camelcase,eqeqeq
        if (e.index == 0) {
          // Bus.$emit('mobile_human_data', { num: 4 })
          // Bus.$emit('common', {url: '/mail/mailcontactor/commonContactorList'})
          localStorage.common = true
        }else{
          localStorage.common = false
        }
      }
    },
    components: {
      'communication-mobile-list': communicationMobileList,
      'communication-mobile-human': communicationMobileHuman,
      'communication-clla-mobile': communicationCllaMobile,
      'communication-history-human': communicationHistory_human,
      'communication-history-human-all': communicationHistory_human_all,
      'mobile-common': mobile_common
    },
    mounted () {
      Bus.$emit('mobile_human_data', {num: 6})
      localStorage.common = true
    }

  }
</script>

<style scoped lang="less">
.zzjg{
  height: 100%;
  border: 1px solid #999;
}
.content_human_list{
  border: 1px solid #999;
}
.history_human{
  border: 1px solid #999;
}
.human_list{
  width: 100%;
  height: 100%;
}
</style>
