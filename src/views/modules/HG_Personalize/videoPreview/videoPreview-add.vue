<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1000px"
  >
    <el-container class="newvideos" style="display:flex;justify-content:center;">
      <el-aside width="300px">
        <el-tree
          class="tree"
          @node-click="handleNodeClick"
          default-expand-all
          :data="menuList"
          :check-strictly="checkstrictly"
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
        <el-form
          :model="dataForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
          
          </el-row>
        </el-form>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelnewadditions" plain size="small">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
    </span>
 

    <!-- 单选联系人弹窗 -->
    <LinkmanRadio ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></LinkmanRadio>
  </el-dialog>
</template>

<script>
import LinkmanRadio from "@/views/common/LinkmanRadio";
import { treeDataTranslate } from "@/utils";
import Icon from "@/icons";
export default {
  components: {
    LinkmanRadio
  },
  data() {
    let self = this;
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
      sexOptions: [
        {
          value: "0",
          label: "男"
        },
        {
          value: "1",
          label: "女"
        }
      ],
      wxUserOptions: [
        {
          value: 0,
          label: "不关联"
        },
        {
          value: 1,
          label: "关联"
        }
      ],
      value: "",
      // 被勾选的树形节点的id
      Iidoftreenode: [],
      // 高德地图
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156]
      ],
      searchOption: {
        city: "广州",
        citylimit: false
      },
      plugin: [
        {
          pName: "Geolocation"
        }
      ],
      lng: 0,
      lat: 0,
      count: 1,
      slotStyle: {
        padding: "2px 8px",
        background: "#eee",
        color: "#333",
        border: "1px solid #aaa"
      },
      zoom: 12,
      center: [113.3245904, 23.1066805],
      address: "",
      loaded: false,
      // 标记点的位置
      mapCenter: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.position = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
      /// //////////////////////////////////
      // 联系人数据
      dataForm: {
        // 性别
        sex: "",
        // id
        id: 0,
        parentId: 0,
        parentName: "",
        wxUser: 0,
        // 姓名
        name: "",
        // 办公室电话
        officeTel: "",
        // 手机
        mobile1: "",
        // 职务
        position: "",
        // 单位
        workUnit: "",
        // 其他号码
        mobile2: "",
        // 家庭电话
        homeTel: "",
        // 邮箱地址
        email: "",
        // 备注
        remark: "",
        // 年龄
        age: 1,
        // 是否为常用联系人
        importance: "",
        // 是否为重要联系人
        commonlyUsed: 0,
        // 经度
        longitude: "",
        // 纬度
        latitude: "",
        // 人物地点
        address: "",
        urgentContactorId: "",
        urgentContactorNameMobile: "",
        fax: "",
        randomPassword: ''
      },
      // 表单必填绑定
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字符", trigger: "blur" }
        ],
        email: [
          {
            required: false,
            pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: "邮箱格式不对",
            trigger: "blur"
          }
        ],
        mobile1: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
          {
            pattern: /^1[345789]\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        mobile2: [
          {
            min: 11,
            max: 11,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
          {
            required: false,
            pattern: /^1[34578]\d{9}$/,
            message: "手机号格式不对",
            trigger: "blur"
          }
        ],
        officeTel: [
          {
            required: false,
            pattern: /^[\d-]+$/,
            // message: "请输入手机号码或者座机号码",
            // type: 'number',
            message: '请输入正确的手机号码或者座机号码',
            trigger: "blur"
          }
        ],
        homeTel: [
          {
            required: false,
            pattern: /^[\d-]+$/,
            // message: "请输入正确的座机号如:0000-0000000",
            trigger: "blur",
            // type: 'number',
            message: '请输入正确的座机号如:0000-0000000'
          }
        ],
        position: [{ required: true, message: "请输入职务", trigger: "blur" }],
        commonlyUsed: [
          { required: true, message: "请选择紧急联系人", trigger: "change" }
        ]
      },
      // 树形
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      imageUrl: ""
    };
  },
  created() {
    this.iconList = Icon.getNameList();
  },
  methods: {
    //重新生成随机验证码
    resetRandom(){
      var num =  Math.ceil(Math.random()*100000);
      this.dataForm.randomPassword = num;
      this.$forceUpdate()
    },
    // 选择结果
    handelLinkdata({ linkman }) {
      // console.log(linkman);
      this.dataForm.urgentContactorId = linkman[0]["id"];
      this.dataForm.urgentContactorNameMobile =
        linkman[0]["name"] + "," + linkman[0]["mobile1"];
    },
    // 触发单选组件
    handleInform() {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择",
        this.dataForm.notificationMethod
      );
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.$http({
        url: this.$http.adornUrl("/mail/mailgroup/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
           if (data && data.code === 0) {
              //  console.log(data.tree);
              // 权限数据
              this.menuList = treeDataTranslate(data.data, "id");
            } else {
              that.$message.error(data.msg)
            }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
            // this.dataForm ={}
            // this.dataForm.commonlyUsed=0
            // this.dataForm.importance=0
          }
        });
    },
    // 请求数据刷新视图
    TestReques() {
      this.$http({
        url: this.$http.adornUrl("/mail/mailgroup/list"),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          //  console.log("树形", data);
          // this.modifiedUserList = treeDataTranslate(data.data, 'id')
          // 请求表格数据
          this.$http({
            url: this.$http.adornUrl("/mail/mailcontactor/list"),
            method: "POST"
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log("表格", data);
              // this.platShareMenuList = treeDataTranslate(data.data.list, 'id')
            } else {
              // this.$message.error(data.msg)
            }
          });    
        } else {
          this.$message.error(data.msg)
        }
      });
    },
    // 监听树形复选框的勾选id
    checkGroupNode(id, arr) {
      // console.log(id, arr);
      this.treecheckbox = arr.checkedKeys;
      // console.log(this.treecheckbox);
      // console.log("监听树形复选框的勾选",this.treecheckbox)
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      // console.log("树形结点点击事件", obj);
      var arr = [];
      arr.push(obj.id);
      // console.log("点击树形节点事件",this.currentTreeObject)
      this.currentTreeObject = arr;
      // 查询对就的预案
    },
    // 地图搜索回调事件
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.center = [poi.lng, poi.lat];
          this.lng = poi.lng;
          this.lat = poi.lat;
          this.address = pois[0].name;
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.position = [center.lng, center.lat];
        this.center = [center.lng, center.lat];
      }
    },
    // 地图事件
    mounted() {
      loadPromise.then(() => {
        // console.log("-----");
        this.map = new AMap.Map("amap-demo1", {
          center: [121.59996, 31.197646],
          zoom: 12
        });
        AMapUI.loadUI(["overlay/SimpleMarker"], SimpleMarker => {
          const marker = new SimpleMarker({
            iconLabel: "A",
            iconStyle: "red",
            map: this.map,
            position: this.map.getCenter()
          });
        });
      });
    },
    // 地图提交
    LongitudeandLatitude() {
      // 经度赋值
      this.dataForm.longitude = this.lng;
      // 纬度赋值
      this.dataForm.latitude = this.lat;
      this.dataForm.address = this.address;
      this.dialogVisible = false;
    },
    // 表单提交
    cancelnewadditions() {
      this.$message("新增取消");
      this.dataForm = {
        id: 0,
        parentId: 0,
        age: 1,
        importance: 0,
        commonlyUsed: 0
      };
      this.visible = false;
    },
    // 表单提交
    dataFormSubmit() {
      if (this.treecheckbox.length == 0 && this.currentTreeObject == null) {
        this.$message({
          message: "请选择一个分组",
          type: "warning"
        });
      } else {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(
                `/mail/mailcontactor/${!this.dataForm.id ? "save" : "update"}`
              ),
              method: "post",
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
                  message: "操作成功",
                  type: "success",
                  duration: 1500
                });
                this.visible = false;
                this.TestReques();
                this.dataForm = {
                  id: 0,
                  parentId: 0,
                  age: 1,
                  importance: 0,
                  commonlyUsed: 0
                };
                this.$emit("refreshDataList");
                this.imageUrl = "";
                this.treecheckbox = []
              } else {
                this.$message({
                  message: `${data.msg}`,
                  type: "error",
                  duration: 1500
                });
              }
            });
          }
        });
      }
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      let form = new FormData();
      form.append("file", file);
      this.$http({
        url: this.$http.adornUrl(`/upload/file`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.imageUrl = window.SITE_CONFIG.cloudUrl + data.url;
            this.dataForm.images = this.imageUrl;
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => {});
    },
    wxUserHandle(val){
      if(val == 0){
        this.dataForm.randomPassword = ''
      }
    }
  }
};
</script>

<style scoped>
.newvideos {
  height: 500px;
}
.search-box {
  z-index: 55;
  position: absolute;
  top: 100px;
  left: 50px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 165px;
  line-height: 165px;
  text-align: center;
  margin-bottom: 15px;
}
.avatar {
  width: 165px;
  height: 165px;
  display: block;
}
.newvideos /deep/ .el-button--medium{
    height: 39px;
    margin-left: 30px;
}
</style>
