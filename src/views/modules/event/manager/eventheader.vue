<template>
  <div style="min-width: 1344px;">
    <el-form>
      <el-form-item style="display: flex;justify-content: space-between;">

        <el-select v-model="shareTownId"
                   filterable
                   default-first-option
                   clearable
                   @change="handleChangeTown"
                   placeholder="请选择镇街" style="width:120px;">
          <el-option v-for="item in shareTown"
                     :key="item.id"
                     :label="item.townName"
                     :value="item.id"
          ></el-option>
        </el-select>

        <el-select v-model="sharePlatformId"
                   filterable
                   default-first-option
                   clearable
                   @change="handleChangePlatform"
                   placeholder="请选择小区" style="width:120px;">
          <el-option v-for="item in sharePlatform"
                     :key="item.linkagePlatformId"
                     :label="item.platformName"
                     :value="item.linkagePlatformId"
          ></el-option>
        </el-select>

        <el-cascader
          :props="eventtypeProps"
          :options="eventtypelist"
          v-model="eventTypeId"
          clearable
          placeholder="请选择事件类型"
        >
        </el-cascader>


        <el-date-picker v-model="value3" unlink-panels value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>

        <el-input style="width:300px;" v-model="value4" placeholder="请输入内容"></el-input>
        <el-button  @click="searchHandle()" style="background: #409eff;color: #fff;">搜索</el-button>

        <el-button style="background: #409eff;color: #fff;margin-left: initial;" @click="addOrUpdateHandle()">新增</el-button>

      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    // headFlag = 1显示新增按钮，事件要接报，其他不显示
    props: ['headData', 'headFlag'],
    data () {
      return {

        //搜索数据
        value3: '',
        value4: '',

        //共享镇街
        shareTown: [],

        //共享平台数据
        sharePlatform: [],

        //工单类型数据
        eventtypelist: [],
        eventtypeProps: {
          children: 'children',
          label: 'name',
          value:'id'
        },

        //共享镇街id
        shareTownId: '',

        // 共享平台id
        sharePlatformId: '',

        //共享平台与其他平台共用的平台id
        myAndSharePlatformId: '',

        // 类型id
        eventTypeId: ''
      }
    },


    mounted () {
      // 表格数据
      //this.getSharePlatformList()
      // 表格数据
      this.getTownList()
    },

    methods: {
      addOrUpdateHandle () {
        this.$emit('addOrUpdateHandle', null, 2)
      },
      searchHandle () {
        this.$emit(
          'searchHandle',
          this.value3,
          this.value4,
          this.sharePlatformId,
          this.eventTypeId,
          this.shareTownId
        )
      },
      getTownList () {
        //console.log('本平台用户信息:', this.$store.state.user)
        // console.log('本平台的路由:',this.$route.meta.menuId)
        this.$http({
          url: this.$http.adornUrl(
            '/sys/systown/list'
          ),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          
          // 说明有共享数据
          if (data.code === 0) {
            // console.log('getTownList', data)
            this.shareTown = data.list
          } else {
            this.$message.error(data.msg)
          }
        }).then(() => {


        })
      },

      handleChangeTown(){
        // console.log("shareTownId",this.shareTownId)
        if(this.shareTownId != null && this.shareTownId != ''){

          this.$http({
            url: this.$http.adornUrl(
              '/event/eventShare/selectShareMenuByTownId'
            ),
            method: 'post',
            params: this.$http.adornParams({
              townId: this.shareTownId,
              myPlatformId: this.$store.state.user.platformId,
              platformMenuId: this.$route.meta.menuId
            })
          }).then(({ data }) => {
            // console.log('getSharePlatformList', data)

            // 说明有共享数据
            if (data.code === 0) {
              this.sharePlatform = data.list
            }else{
              this.sharePlatformId = '';
              this.sharePlatform = [];
              //重新初始化事件类型
              this.eventTypeId = '';
              this.eventtypelist = [];
              this.$message.error(data.msg)
            }
          }).then(() => {


          })
        }else{
          this.sharePlatformId = '';
          this.sharePlatform = [];
          //重新初始化事件类型
          this.eventTypeId = '';
          this.eventtypelist = [];
        }


      },

      //平台决定事件类型
      handleChangePlatform(){

        // console.log("sharePlatformId",this.sharePlatformId)

        if(this.sharePlatformId != null && this.sharePlatformId != ''){

          this.$http({
            url: this.$http.adornUrl('/event/eventType/selectEventTypeList'),
            method: 'post',
            params: this.$http.adornParams({
              platformId: this.sharePlatformId,
            })

          }).then(({data}) => {
            //请求的事件类型数据
            if(data.code === 0){
              this.eventtypelist = data.list;
            }else{
              //this.sharePlatformId = '';
              this.eventTypeId = '';
              this.eventtypelist = [];
              this.$message.error(data.msg)
            }

          })

        }else{
          //this.sharePlatformId = '';
          this.eventTypeId = '';
          this.eventtypelist = [];
        }

      },


    }
  }
</script>

<style scoped>
</style>
