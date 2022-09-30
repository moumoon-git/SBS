<template>
    <div>
      <mail-list ref="addOrUpdate"  class="mail_del" ></mail-list>
        <div>
          <!--          human_sache-->
          <div class="human_sache">
            <el-row>
              <!--联系人图片-->
              <el-col :span="6">
                <img src="" alt="">
              </el-col>
              <!--搜索-->
              <el-col :span="12">
               <div class="seach">
                 <input type="text" v-model="val" placeholder="输入姓名/单位/职位/号码"  >
                 <button  @click="search">查找</button>
               </div>
              </el-col>
              <el-col :span="6">

              </el-col>
            </el-row>

          </div>

          <!--          human_list-->
          <div class="human_list">
            <el-row style="display: flex;justify-content: flex-start;flex-wrap: wrap;" v-if="!conmmHuman" >
<!--              :offset="index > 0 ? 0 : 0"-->
              <!-- 联系人分组-->
              <el-col :span="num" v-for="(item, index) in dataList" :key="index"  style="margin-bottom:8px">
                <el-card :body-style="{ padding: '0px' }"   >
                  <div style="padding: 20px 14px 14px;" @click="details(item)" >

                    <div class="human_title">{{item.name}}<i class="el-icon-view more"  @click.stop="ckDetil(item)"></i> </div>
                    <div class="bottom clearfix">
                      <!--  <time class="time">{{ currentDate }}</time>-->
                      <img v-if="item.images" :src="item.images.indexOf('http') === -1?baseUrl+item.images:item.images" alt="">
                      <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFb0lEQVRYR81Xb0xTVxS/9/FaoDzg1SExQyaJzGkysR/mAi5uzf5E/mSxCnXxA1olCIiL1Y1PLlCd0y0zGSTMv1nscAmLlA2SASZDrXGTDYyWxcyoMB9ikSGOB7R9hbbv7t7XFCuWvodblt2kH/reuef8zu/87jn3QTCPpTeYWI1K3AoQ0M7eJgLKfs5mtc/DnWQKlW7IKzQZACXqj5dNdr6wCBYCgHR4L4t/HECoZcexeJ9zRJXq8VO19hYrr9SvIgD5xmJT2kK/5uROrxFj1kd0jhD/YBzsKqlNfEfwU2alIGQB5BpMGZAOGNotLhMOvkous3vD6N2K44mvtNsaLHK2ikqQZ9xS217t4nGxapQ4xKXhdhyN+3xwKLb9XIuVk9sTlQEiung6YGqvcVswgGQ5Z6H3j1ygcssRJlUJC1EB5BaZ9JvWCpnb3vKdUho8aIdaCyyJjmcGQAKTI0WU/2GhK+XNLHF+ABC6VLA/0f7sALDwpERokFG2TtAZcnxf/KcMkNrH0UAH/ICjVAF9W7W7dj4awGD3FFgY9pkZINnmG0269iarI79oi6XNMokZgVsVsYDAeMUxTSU3QjuVdMY5RUgAeHyAI0wsTfMx9aVCPQawRA4EOQHFR5hXO2wNuG/Ir6ingIiwo9naQlgoWSfc3JgT+CwqCAT25x9gWMFHWf6VTki6IBEioZKASEv1jZysmErFeiDZhbGBWq/ejvm2ulGTDQFlJaWTzz1oEZUBUgZiFHJIjieEokHaiMBFBBEPAdSFpqMS0c0GFhFAMHBAJ/pi7OHtlDxHICB1RARAJhIhA5DYR8VAF3km+GJ6lVIfAvIUAFJ3SAGOZB0cRGg3ThfijHmEKIchXZ2ijYEJszO59HC6/w+PPxMzwiIIWCSC6+eaG76WK8UMgOBlA2SQwNIMUIkWPOe5ppznMM1oPS6WRL2CxSEEWurueH79aXQqF2FNRDuOEgApYAzQS4qXaBZN9auSexZpqIP4dYZcUM4dAHcm/KM5C9UpDB1GKgJWc+9Yz30PUnfYztRG8iNZE9qFALDH4RsOVIlmWzaLxy9UNH5HvCI4PIBOT7/2tk31Y8v27RkJuVlaOrxEjtOce1/b0NSySCAgyVj0Ad4LAE9on09wAv5kv/vWwPZ9n2KZnEYAWt11NYkHVyYVPsEEAI4Prk0eGRBEN2E5nIkZvvKKis0frUga1mnpRjnKw9/vvMp3L9hjETBjb5Dnw5c7S8389VMvJ9NPuMGnxm7sGuud3aQeawBfPGw5WhN2JHvtCvf81V0Pd4OfrqdL9gqxTNKhwR++L69C/Y2zAZA9jjH/5oM3JxaFl0ICQC6dnyxPUi/T0ifmk33IttUpeL9LXL4tvWBDOTx6YPjjlUnvRfaDWou6eK6jqcEcunMEAeA227SGxWqPPvGI4M6PePuHPIH7qxeol7yeGptBTkDtbVczs7vG9eeFtrN5w799s3Fx/FPfDSFAZsdYpVOgrpD/ZNjNADi7htXjJiLVMdLqGp32NDs9R+G2vXfVDLvaX2+BhufjjM1O74W496v7BZ7vyWyur6p4kYlawsuj06V1t4RRFADSvHgMIIc1QwjnvHg2DQrO7vWVh2KZ5C/Jxom+vs10VyfSFJflTbkmujVn6nZVvcSsmKX+p3MR4QbjL3/pRD9lfQJA0xpt1HNP6D/0++QJxlyTTb4PsKoxfWj80dWfDy+9drGmPDNBPjiJiNB+YxcPogK4Me4HkVTc8cB777xH1Tq91nDFxw+jlO7OtVnJaoMxPT5trtIR4GSlxlFBEyUAzg4KYFN6fESfxOGlh1POxfE0u5KlE+QoJ8mQNZPQPwUwV6ZzPf/fA/gbt2ma5/oaMmMAAAAASUVORK5CYII=" alt="">
                      <p style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">单位:{{item.workUnit}}</p>
                      <p >职务:{{item.position}}</p>
                      <el-button type="text" class="button absBtnLet" :class="item.importance==1?'absBtnLet2':''" @click.stop="commonlyUsed(item)" >{{item.importance==1?'重要':'普通'}}</el-button>
                      <el-button type="text" class="button absBtnRight" :class="item.commonlyUsed==1?'absBtnRight2':''" @click.stop="collect(item,index)">收藏</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>

            </el-row>

            <el-row style="display: flex;justify-content: flex-start;flex-wrap: wrap;" v-if="conmmHuman" >
              <!--常用联系人-->
              <el-col :span="num" v-for="(item, index) in dataList" :key="index" v-if="item.commonlyUsed==1" style="margin-bottom:8px">
                <el-card :body-style="{ padding: '0px' }"  >
                  <div style="padding: 20px 14px 14px;" @click="details(item)" >
                    <div class="human_title">{{item.name}} <i class="el-icon-view more"  @click.stop="ckDetil(item)"></i> </div>
                    <div class="bottom clearfix">
                      <!--  <time class="time">{{ currentDate }}</time>-->
                      <img v-if="item.images" :src="item.images?baseUrl+item.images:item.images" alt="">
                      <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFb0lEQVRYR81Xb0xTVxS/9/FaoDzg1SExQyaJzGkysR/mAi5uzf5E/mSxCnXxA1olCIiL1Y1PLlCd0y0zGSTMv1nscAmLlA2SASZDrXGTDYyWxcyoMB9ikSGOB7R9hbbv7t7XFCuWvodblt2kH/reuef8zu/87jn3QTCPpTeYWI1K3AoQ0M7eJgLKfs5mtc/DnWQKlW7IKzQZACXqj5dNdr6wCBYCgHR4L4t/HECoZcexeJ9zRJXq8VO19hYrr9SvIgD5xmJT2kK/5uROrxFj1kd0jhD/YBzsKqlNfEfwU2alIGQB5BpMGZAOGNotLhMOvkous3vD6N2K44mvtNsaLHK2ikqQZ9xS217t4nGxapQ4xKXhdhyN+3xwKLb9XIuVk9sTlQEiung6YGqvcVswgGQ5Z6H3j1ygcssRJlUJC1EB5BaZ9JvWCpnb3vKdUho8aIdaCyyJjmcGQAKTI0WU/2GhK+XNLHF+ABC6VLA/0f7sALDwpERokFG2TtAZcnxf/KcMkNrH0UAH/ICjVAF9W7W7dj4awGD3FFgY9pkZINnmG0269iarI79oi6XNMokZgVsVsYDAeMUxTSU3QjuVdMY5RUgAeHyAI0wsTfMx9aVCPQawRA4EOQHFR5hXO2wNuG/Ir6ingIiwo9naQlgoWSfc3JgT+CwqCAT25x9gWMFHWf6VTki6IBEioZKASEv1jZysmErFeiDZhbGBWq/ejvm2ulGTDQFlJaWTzz1oEZUBUgZiFHJIjieEokHaiMBFBBEPAdSFpqMS0c0GFhFAMHBAJ/pi7OHtlDxHICB1RARAJhIhA5DYR8VAF3km+GJ6lVIfAvIUAFJ3SAGOZB0cRGg3ThfijHmEKIchXZ2ijYEJszO59HC6/w+PPxMzwiIIWCSC6+eaG76WK8UMgOBlA2SQwNIMUIkWPOe5ppznMM1oPS6WRL2CxSEEWurueH79aXQqF2FNRDuOEgApYAzQS4qXaBZN9auSexZpqIP4dYZcUM4dAHcm/KM5C9UpDB1GKgJWc+9Yz30PUnfYztRG8iNZE9qFALDH4RsOVIlmWzaLxy9UNH5HvCI4PIBOT7/2tk31Y8v27RkJuVlaOrxEjtOce1/b0NSySCAgyVj0Ad4LAE9on09wAv5kv/vWwPZ9n2KZnEYAWt11NYkHVyYVPsEEAI4Prk0eGRBEN2E5nIkZvvKKis0frUga1mnpRjnKw9/vvMp3L9hjETBjb5Dnw5c7S8389VMvJ9NPuMGnxm7sGuud3aQeawBfPGw5WhN2JHvtCvf81V0Pd4OfrqdL9gqxTNKhwR++L69C/Y2zAZA9jjH/5oM3JxaFl0ICQC6dnyxPUi/T0ifmk33IttUpeL9LXL4tvWBDOTx6YPjjlUnvRfaDWou6eK6jqcEcunMEAeA227SGxWqPPvGI4M6PePuHPIH7qxeol7yeGptBTkDtbVczs7vG9eeFtrN5w799s3Fx/FPfDSFAZsdYpVOgrpD/ZNjNADi7htXjJiLVMdLqGp32NDs9R+G2vXfVDLvaX2+BhufjjM1O74W496v7BZ7vyWyur6p4kYlawsuj06V1t4RRFADSvHgMIIc1QwjnvHg2DQrO7vWVh2KZ5C/Jxom+vs10VyfSFJflTbkmujVn6nZVvcSsmKX+p3MR4QbjL3/pRD9lfQJA0xpt1HNP6D/0++QJxlyTTb4PsKoxfWj80dWfDy+9drGmPDNBPjiJiNB+YxcPogK4Me4HkVTc8cB777xH1Tq91nDFxw+jlO7OtVnJaoMxPT5trtIR4GSlxlFBEyUAzg4KYFN6fESfxOGlh1POxfE0u5KlE+QoJ8mQNZPQPwUwV6ZzPf/fA/gbt2ma5/oaMmMAAAAASUVORK5CYII=" alt="">
                      <p style="width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">单位:{{item.workUnit}}</p>
                      <p >职务:{{item.position}}</p>
                      <el-button type="text" class="button absBtnLet" :class="item.importance==1?'absBtnLet2':''" @click.stop="commonlyUsed(item)" >{{item.importance==1?'重要':'普通'}}</el-button>
                      <el-button type="text" class="button absBtnRight" :class="item.commonlyUsed==1?'absBtnRight2':''" @click.stop="collect(item,index)">收藏</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <div class="block">
              <span class="demonstration"></span>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage3"
                :page-size="16"
                :page-count="5"
                layout="prev, pager, next, jumper"
                :total="listLength">
              </el-pagination>
            </div>
          </div>


        </div>
    </div>
</template>

<script>
// 引入中间件
  import Bus from '../../../utils/bus.js'
  import mailList from '@/views/modules/sys/mailList/mailList-See-or-update'

  export default {
    name: 'mobile_human',
    data () {
      return {
        val: '',
        currentDate: new Date(),
        currentPage1: 0,
        currentPage2: 0,
        currentPage3: 0,
        currentPage4: 5,
        listLength: 0,
        // 获取联系人
        searchx: '',
        page: 1,
        dataList: '',
        groupId: [],
        limit: 16,
        Paramsx: true,
      //  改卡片的span
        num: 6,
        conmmHuman: false,
        url: '',
        typeCommn: 'zc',
        baseUrl: window.SITE_CONFIG['cloudUrl'],
      }
    },
    components:{
      'mail-list': mailList,
    },
    mounted () {
      var that = this
      Bus.$off('mobile_human_data')
      Bus.$on('mobile_human_data', (data) => {
        // data 为对象array类型必传参数
        // {num:6,url,data}
        that.num = data.num
        // console.log(data)
      })
      Bus.$off('listVal')
      Bus.$on('listVal', (data) => {
        // 用$on事件来接收参数
        //   data为对象array{}类型  必须包含字段id,url
        // console.log(data.id)
        // 避免多次请求
        that.searchx = ''
        if (that.Paramsx) {
          that.groupId = [data.id]
          that.httpHuman([data.id], this.searchx, this.limit, this.page, data.url)
          that.Paramsx = false
        }
      })
      Bus.$off('common')
      Bus.$on('common', (data) => {
        //  常用联系人
        // console.log(data.url, data)
        that.typeCommn = 'cy'
        that.url = data.url
        that.conmmHuman = true
        that.httpscontacts(that.url)

      })
      setTimeout(function () {
        if(that.conmmHuman){
          that.httpscontacts(that.url)
        }else{
          // 第一次加载默认地址
          that.httpHuman(that.groupId, that.searchx, that.limit, that.page, '/mail/mailcontactor/list')
        }
      },100)
    },
    methods: {
      // eslint-disable-next-line no-dupe-keys
      httpscontacts (url) {
          var that = this
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'POST',
            data: this.$http.adornParams({
              page: this.page,
              limit: 24,
              search: this.searchx
            })
          }).then(({ data }) => {
            if (data.code === 0) {
              // console.log(data, '常用联系人')
              that.dataList = data.data.list
              that.listLength = data.data.totalCount
              that.conmmHuman = true
            } else {
              this.$message.error(data.msg);
            }
          })
      },
      init (num) {
        // console.log(num, '元素的宽度和个数改变')
      //  元素的宽度和个数改变，用栅格系统 24份
        this.num = num
      },
      // 分页
      handleSizeChange (val) {
        // console.log(`每页 ${val} 条`)
        this.page = val
      },
      handleCurrentChange (val) {
        // console.log(`当前页: ${val}`)
        this.page = val
        if(this.typeCommn == 'zc'){
          this.httpHuman(this.groupId, this.searchx, this.limit, this.page, '/mail/mailcontactor/list')
        }else{
          this.httpscontacts(this.url)
        }
      },
      search () {
        // console.log(this.val, this.searchx,localStorage.common)
        this.searchx = this.val
        if(localStorage.common == 'true'){
          this.httpHuman(this.groupId, this.searchx, 20, 1, '/mail/mailcontactor/list')
        }else{
          this.page = 1
          this.httpscontacts ('/phone/phoneinfo/list')
        }
      },
      collect (item, index) {
        var data = {
          contactId: String(item.id),
          // eslint-disable-next-line eqeqeq
          isCommonlyUsed: item.commonlyUsed == 0 ? 1 : 0
        }
        // console.log('点击了收藏', data, item.commonlyUsed)
        this.https(`/mail/mailcontactor/updateIsCommonlyUsed`, data)
        // eslint-disable-next-line eqeqeq
        item.commonlyUsed = item.commonlyUsed == 0 ? 1 : 0
      },
      commonlyUsed (item) {
        var that = this
        var data = {}
        data.contactId = String(item.id)
          // eslint-disable-next-line eqeqeq
        data.isImportance = item.importance == 0 ? 1 : 0
        // console.log('点击了普通', data,item.importance)
        that.https(`/mail/mailcontactor/updateIsImportance`, data,false)
        // eslint-disable-next-line eqeqeq
        item.importance = item.importance == 0 ? 1 : 0
      },
      details (data) {
        // console.log('点击了div')
        Bus.$emit('cllaVal', {data, type: 'human'})
      },

      https (url, data, type=true) {
        // console.log(data)
        this.$http({
          url: this.$http.adornUrl(url,type),
          method: 'POST',
          data: this.$http.adornParams(data)
        }).then(({ data }) => {
          if (data.code === 0) {
            // console.log(data)
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      httpHuman (groupId, search, limit, page, url) {
        if(!this.conmmHuman){
          var that = this
          // 获取联系人
          this.$http({
            url: this.$http.adornUrl(url),
            method: 'POST',
            data: this.$http.adornParams({
              groupId,
              search,
              limit,
              page
            })
          }).then(({ data }) => {
             if (data.code === 0) {
                // console.log(data)
                that.dataList = data.data.list
                that.listLength = data.data.totalCount
                this.Paramsx = true
              } else {
                this.$message.error(data.msg);
              }
          })
        }
      },
      ckDetil (item) {
        // console.log('查看联系人')
        this.addOrUpdateHandle(item.id, 0)//实时的数据
        // this.addOrUpdateHandle(530, 0)// 测试的数据
      },
      addOrUpdateHandle (id, staus) {
        this.addOrUpdateVisible = true
        // eslint-disable-next-line eqeqeq
        if (staus == 0) {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id, 0)
          })
          // eslint-disable-next-line eqeqeq
        } else if (staus == 1) {
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id, 0)
          })
        }
      },
    }
  }
</script>

<style scoped lang="less">
.human_sache{
  height: 68px;
  padding-top: 11px;
  border-bottom: 1px solid #ccc;
}
.seach{
  height: 100%;
  input{
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,0);
    width: 75%;
    height: 40px;
    outline: none;
    color: rgb(168,168,168);
    box-sizing: border-box;
    padding: 10px ;
    border: 1px solid #ccc;
  }
  input::-webkit-input-placeholder{
    color:rgb(168,168,168);
  }
  button{
    height: 40px;
    outline: none;
    border: none;
    width: 20%;
    padding: 10px 0;
    border-radius:5px;
    background: rgb(0,121,166);
    color: #ffff;
    border: 1px solid #0e8ebe;
  }
}

  .human_list{
    padding:15px 0 ;
    max-height: 665px;
    min-height: 665px;
    position: relative;
  }


/*卡片*/
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}
.clearfix{
  position: relative;
  img{
    position: absolute;
    width: 30%;
    height: 75%;
    right: 0;
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}


  .human_list /deep/ .bottom[data-v-10c4ef8b]{
     margin-top: 0;
    /*p{*/
    /*  margin: 0;*/
    /*}*/
  }
.human_list /deep/ .el-card{
    position: relative;
}
  .absBtnLet{
    position: absolute;
    bottom: 0px;
    left: 15px;
    background: rgb(216,178,117);
    color: #fff;
    font-size: 12px;
    padding: 3px;
  }
  .absBtnLet2{
    background: rgba(219,86,44);
  }
.absBtnRight{
  font-size: 12px;
  padding: 3px;
  color: #fff;
  background: rgb(120,120,120);
}
.absBtnRight2{
  background: rgba(219,86,44);
}

.human_title{
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: rgb(172,172,172);
}
  .more{
    float: right;
    height:15px;
    width: 20px;
    font-weight: bold;
    /*color: rgba(89,187,210);*/
    background: #fff;
    margin-top: 8px;
    margin-right: 20px;
    /*border: 1px solid rgba(89,187,210);*/
  }
.block{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
/*查看编辑联系人*/
.mail_del{
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,.5);
  z-index: 2004;
}

</style>
