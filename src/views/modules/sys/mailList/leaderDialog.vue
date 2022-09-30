<template>
  <el-dialog :title="dataForm.id ? '查看负责人' : '联系人新增'" :close-on-click-modal="false" :visible.sync="visible" :width="dataForm.id?'1000px':'800px'" @close="$parent.leaderDialogVisible=false;visible=false;">
    <el-container class="newcontacts">
      <el-aside width="300px" v-if="dataForm.id">
        <el-tree
          class="tree"
          @node-click="handleNodeClick"
          default-expand-all
          :data="menuList"
          :check-strictly="checkstrictly"
          :default-checked-keys="dataForm.groups"
          :props="menuListTreeProps"
          :show-checkbox="showcheckbox"
          ref="DeviceGroupTree"
          @check="checkGroupNode"
          node-key="id"
          style="background: #cccccc47;
                 margin-top: 10px;
                 padding-top: 10px;"
        ></el-tree>
      </el-aside>
      <el-main>
        <el-form :model="dataForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-row :gutter="20">
            <!--左边复选框-->
            <el-col :span="12">
              <el-form-item label="姓名" prop="name" size="large">
                <el-input v-model="dataForm.name" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <!-- <el-form-item label="年龄" size="large">
                <el-input-number v-model="dataForm.age" :min="1" :max="150" style="width: 170px" disabled="disabled"></el-input-number>
              </el-form-item> -->
              <el-form-item label="工作单位" size="large">
                <el-input v-model="dataForm.workUnit" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="家庭电话" size="large" prop="homeTel">
                <el-input v-model="dataForm.homeTel" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="办公室电话" size="large" prop="officeTel">
                <el-input v-model="dataForm.officeTel" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="传真号码" size="large" prop="mobile2">
                <el-input v-model="dataForm.mobile2" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <!-- <el-form-item label="紧急联系人">
               
                <el-input @focus="handleInform()" :readonly="true" v-model="dataForm.urgentContactorNameMobile" disabled="disabled"></el-input>
              </el-form-item> -->
              <!-- <el-form-item label="常用联系人" size="large" prop="commonlyUsed">
                <el-radio v-model="dataForm.commonlyUsed" :label=1>是</el-radio>
                <el-radio v-model="dataForm.commonlyUsed" :label=0>否</el-radio>
              </el-form-item>-->
            </el-col>
            <!--右边复选框-->
            <el-col :span="12">
              <el-form-item label="性别" size="large" prop="sex">
                <el-select v-model="dataForm.sex" placeholder="请选择" disabled="disabled">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="手机号" size="large" prop="mobile1">
                <el-input v-model="dataForm.mobile1" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="职务" size="large" prop="position">
                <el-input v-model="dataForm.position" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" size="large" prop="email">
                <el-input v-model="dataForm.email" style="min-width: 50px" disabled="disabled"></el-input>
              </el-form-item>
              
              <!-- <el-form-item label="传真" size="large">
                <el-input v-model="dataForm.fax" disabled="disabled"></el-input>
              </el-form-item> -->
            </el-col>
          </el-row>
          <!-- <el-form-item label="人物所在地">
            <el-input type="textarea" :rows="1" resize="none" style="width: 90%" :placeholder="dataForm.address" v-model="dataForm.address" disabled="disabled"></el-input>
           
          </el-form-item> -->
        </el-form>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancelnewadditions">取消</el-button> -->
      <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
      <el-button type="primary" @click="handleInform()" size="small">选择其他责任人</el-button>
    </span>
    <!--地图弹窗-->
    <el-dialog title="地图" :visible.sync="dialogVisible" append-to-body>
      <div style="height:580px;">
        <div :style="{width:'100%',height:'500px',float: 'right'}">
          <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
          <el-amap vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo" :events="events" :plugin="plugin">
            <el-amap-marker :position="position" :events="events"></el-amap-marker>
            <el-amap-marker v-for="{position,index} in markers" :position="position" :key="index"></el-amap-marker>
          </el-amap>
          <div class="toolbar">
            position: [{{ lng }}, {{ lat }}] address: {{ address }}
            <div style="text-align: center">
              <el-button @click="dialogVisible = false" plain size="small">取消</el-button>
              <el-button type="primary" @click="LongitudeandLatitude()" size="small">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--地图弹窗-->

    <!-- 单选联系人弹窗 -->
    <LinkmanRadio ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></LinkmanRadio>
    <!-- 选择责任人 -->
    
  </el-dialog>
</template>

<script>

import LinkmanRadio from '@/views/common/LinkmanRadio';
import { treeDataTranslate } from '@/utils';
import Icon from '@/icons';
export default {
  components: {
    LinkmanRadio
  },
  data () {
    let self = this
    return {
      
      showcommonLink: false,
      // 地图弹窗
      dialogVisible: false,
      // 被勾选的树形复选框数组
      treecheckbox: [],
      checkstrictly: true,
      // 父子不互相关联的做法
      showcheckbox: true,
      visible: false,
      // 表单验证
      options: [
        {
          value: '0',
          label: '男'
        },
        {
          value: '1',
          label: '女'
        }
      ],
      value: '',
      // 被勾选的树形节点的id
      Iidoftreenode: [],
      // 高德地图
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156]
      ],
      searchOption: {
        city: '广州',
        citylimit: false
      },
      plugin: [
        {
          pName: 'Geolocation'
        }
      ],
      lng: 0,
      lat: 0,
      count: 1,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa'
      },
      zoom: 12,
      center: [113.3245904, 23.1066805],
      address: '',
      loaded: false,
      // 标记点的位置
      mapCenter: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      events: {
        click (e) {
          let { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          self.position = [lng, lat]
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress
                self.$nextTick()
              }
            }
          })
        }
      },
      /// //////////////////////////////////
      // 联系人数据
      dataForm: {
        // 性别
        sex: '',
        // id
        id: 0,
        parentId: 0,
        parentName: '',
        // 姓名
        name: '',
        // 办公室电话
        officeTel: '',
        // 手机
        mobile1: '',
        // 职务
        position: '',
        // 单位
        workUnit: '',
        // 其他号码
        mobile2: '',
        // 家庭电话
        homeTel: '',
        // 邮箱地址
        email: '',
        // 备注
        remark: '',
        // 年龄
        age: 1,
        // 是否为常用联系人
        importance: '',
        // 是否为重要联系人
        commonlyUsed: 0,
        // 经度
        longitude: '',
        // 纬度
        latitude: '',
        // 人物地点
        address: '',
        urgentContactorId: '',
        urgentContactorNameMobile: '',
        fax: ''
      },
      // 表单必填绑定
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: false,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '邮箱格式不对',
            trigger: 'blur'
          }
        ],
        mobile1: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ],
        mobile2: [
          {
            min: 11,
            max: 11,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          },
          {
            required: false,
            pattern: /^1[34578]\d{9}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ],
        officeTel: [
          {
            required: false,
            pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
            message: '请输入手机号码或者座机号码',
            trigger: 'blur'
          }
        ],
        homeTel: [
          {
            required: false,
            pattern: /0\d{2,3}-\d{7,8}/,
            message: '请输入正确的座机号如:0000-0000000',
            trigger: 'blur'
          }
        ],
        position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        commonlyUsed: [
          { required: true, message: '请选择紧急联系人', trigger: 'change' }
        ]
      },
      // 树形
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.iconList = Icon.getNameList()
    
  },
  mounted(){
    this.getPeople()
    
      
  },
  methods: {
    
    getPeople(){
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/getPersonnel'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
          // console.log("/mail/mailcontactor/getPersonnel",data)
          if(data.data){
            // if(data.data.sex==0){
            //   data.data.sex='男'
            // }else {
            //   data.data.sex='女'
            // }
            data.data.sex=String(data.data.sex)
            this.dataForm=data.data
          }else {
              
                 this.$confirm('当前没有选择责任人, 是否去选择?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.handleInform()
                }).catch(() => {
                           
                });
                setTimeout(()=>{
                  document.querySelector("body > div.el-message-box__wrapper").setAttribute("style","display:inline-block;z-index:99999!important;")
                })
              
                  
            }
          
        })
    },
    // 选择结果
    handelLinkdata ({ linkman }) {
      // console.log('责任人责任人',linkman)

      // this.dataForm.urgentContactorId = linkman[0]['id']
      // this.dataForm.urgentContactorNameMobile =
      //   linkman[0]['name'] + ',' + linkman[0]['mobile1']

      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/replacePersonnel'),
        method: 'post',
        data: this.$http.adornData({
          personnelId:linkman[0].id
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
            // console.log('切换责任人',data)
            this.getPeople()
          this.$emit('refreshDataList');
        } else {
          that.$message.error(data.msg)
        }
        
      })
    },
    // 触发单选组件
    handleInform () {
      setTimeout(()=>{
        document.querySelector("body > div.v-modal").setAttribute("style","z-index:1;")
      })
      this.showcommonLink = true
      this.$refs.commonLink.handleAddContacts(
        '/mail/mailgroup/list',
        '请选择',
        this.dataForm.notificationMethod
      )
    },
    init (id) {
      this.dataForm.id = id || 0
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get',
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data.tree)
            // 权限数据
            this.menuList = treeDataTranslate(data.data, 'id')
          } else {
            that.$message.error(data.msg)
          }
        })
        .then(() => {
          this.visible = true
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
            // this.dataForm ={}
            // this.dataForm.commonlyUsed=0
            // this.dataForm.importance=0
          }
        })
    },
    // 请求数据刷新视图
    TestReques () {
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 0) {
            // console.log('树形', data)
          // this.modifiedUserList = treeDataTranslate(data.data, 'id')
          // 请求表格数据
          this.$http({
            url: this.$http.adornUrl('/mail/mailcontactor/list'),
            method: 'POST'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log('表格', data)
            } else {
              // that.$message.error(data.msg)
            }
            // this.platShareMenuList = treeDataTranslate(data.data.list, 'id')
          })     
        } else {
          that.$message.error(data.msg)
        }
        
      })
    },
    // 监听树形复选框的勾选id
    checkGroupNode (id, arr) {
      // console.log(id, arr)
      this.treecheckbox = arr.checkedKeys
      // console.log(this.treecheckbox)
    },
    // 点击树形节点事件
    handleNodeClick (obj) {
      // console.log('树形结点点击事件', obj)
      var arr = []
      arr.push(obj.id)
      this.currentTreeObject = arr
      // 查询对就的预案
    },
    // 地图搜索回调事件
    onSearchResult (pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.center = [poi.lng, poi.lat]
          this.lng = poi.lng
          this.lat = poi.lat
          this.address = pois[0].name
        })
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.position = [center.lng, center.lat]
        this.center = [center.lng, center.lat]
      }
    },
    // 地图事件
    mounted () {
      
      

      loadPromise.then(() => {
        // console.log('-----')
        this.map = new AMap.Map('amap-demo1', {
          center: [121.59996, 31.197646],
          zoom: 12
        })
        AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
          const marker = new SimpleMarker({
            iconLabel: 'A',
            iconStyle: 'red',
            map: this.map,
            position: this.map.getCenter()
          })
        })
      })
    },
    // 地图提交
    LongitudeandLatitude () {
      // 经度赋值
      this.dataForm.longitude = this.lng
      // 纬度赋值
      this.dataForm.latitude = this.lat
      this.dataForm.address = this.address
      this.dialogVisible = false
    },
    // 表单提交
    cancelnewadditions () {
      this.$message('新增取消')
      this.dataForm = {
        id: 0,
        parentId: 0,
        age: 1,
        importance: 0,
        commonlyUsed: 0
      }
      this.$parent.leaderDialogVisible=false;
      this.visible = false
    },
    // 表单提交
    dataFormSubmit () {
      // alert(222222222222)
      if (this.treecheckbox.length == 0 && this.currentTreeObject == null) {
        this.$message({
          message: '请选择一个分组',
          type: 'warning'
        })
      } else {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `/mail/mailcontactor/${!this.dataForm.id ? 'save' : 'update'}`
              ),
              method: 'post',
              data: this.$http.adornData(
                {
                  groups: this.treecheckbox || this.currentTreeObject,
                  ...this.dataForm
                },
                false
              )
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
                this.$parent.leaderDialogVisible=false;
                this.visible = false
                this.TestReques()
                this.dataForm = {
                  id: 0,
                  parentId: 0,
                  age: 1,
                  importance: 0,
                  commonlyUsed: 0
                }
                this.$emit('refreshDataList')
              } else {
                this.$message({
                  message: `${data.msg}`,
                  type: 'error',
                  duration: 1500
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.newcontacts {
  height: 500px;
}
.search-box {
  z-index: 55;
  position: absolute;
  top: 100px;
  left: 50px;
}
</style>
