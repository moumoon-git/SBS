<template>
  <el-dialog title="修改物资仓库" :close-on-click-modal="false" :visible.sync="visible">
    <el-container>
      <el-header>
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="110px"
        >
          <el-form-item label="物资库名称" prop="name">
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>

          <el-form-item label="请选择分组" prop="eventTypeParentName">
            <el-dialog title="请选择要新增到的分组节点" :visible.sync="newgroups" width="30%" append-to-body>
              <el-tree
                :data="eventTypeList"
                :props="eventTypeListTreeProps"
                node-key="id"
                ref="eventTypeTree"
                @current-change="eventTypeListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="newgroups = false">取 消</el-button>
                <el-button type="primary" @click="newgroups = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-input
              v-model="dataForm.eventTypeParentName"
              @focus="gettingfocus"
              v-popover:eventTypeListPopover
              placeholder="选择分组"
              :readonly="true"
            ></el-input>
            <el-input v-show="false" v-model="dataForm.responsibleUnitId" :readonly="true"></el-input>
          </el-form-item>

          <el-form-item label="人物所在地" prop="address">
            <el-input
              type="textarea"
              :rows="1"
              resize="none"
              style="width: 90%"
              :placeholder="contactor.address"
              v-model="dataForm.address"
            ></el-input>
            <el-button
              @click="mapDialogVisible = true"
              style="width:8%"
              type="text"
              icon="el-icon-location-outline"
            >定位</el-button>
          </el-form-item>

          <!--地图弹窗-->
          <el-dialog title="地图" :visible.sync="mapDialogVisible" append-to-body>
            <div style="height:580px;">
              <div :style="{width:'100%',height:'500px',float: 'right'}">
                <el-amap-search-box
                  class="search-box"
                  :search-option="searchOption"
                  :on-search-result="onSearchResult"
                ></el-amap-search-box>
                <el-amap
                  id="amapDemo"
                  :center="center"
                  :zoom="12"
                  class="amap-demo"
                  :events="events"
                  :plugin="plugin"
                  v-if="mapDialogVisible"
                >
                  <el-amap-marker :position="position" :events="events"></el-amap-marker>
                  <!-- <el-amap-marker v-for="(position,index) in markers" :position="position" :key="index"></el-amap-marker> -->
                </el-amap>
                <div class="toolbar">
                  position: [{{ lng }}, {{ lat }}] address: {{ address }}
                  <div style="text-align: center">
                    <el-button @click="mapDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="LongitudeandLatitude()">确定</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-dialog>

          <!-- <el-form-item label="传真" prop="fax">
            <el-input v-model="dataForm.fax"  ></el-input>
          </el-form-item>-->

          <el-form-item label="主管单位地址" prop="responsibleUnitAddress">
            <el-input v-model="dataForm.responsibleUnitAddress"></el-input>
          </el-form-item>

          <el-form-item label="请选择联系人" prop="contactor_ids">
            <Linkman ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></Linkman>
            <el-input
              size="mini"
              class="right-input"
              @focus="handelVerify('verify')"
              v-model="dataForm.contactor_names"
            ></el-input>
          </el-form-item>

          <el-form-item label="周边交通" prop="aroundTraffic">
            <el-input v-model="dataForm.aroundTraffic"></el-input>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-footer class="foor">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import Linkman from "@/views/common/Linkman";
import { setTimeout } from "timers";
export default {
  data() {
    let self = this;
    return {
      plugin: [{ pName: "Geolocation" }],
      //联系人数据
      contactor: {
        //性别
        sex: "",
        //id
        id: 0,
        parentId: 0,
        parentName: "",
        //姓名
        name: "",
        //办公室电话
        officeTel: "",
        //手机
        mobile1: "",
        //职务
        position: "",
        //单位
        workUnit: "",
        //其他号码
        mobile2: "",
        //家庭电话
        homeTel: "",
        //邮箱地址
        email: "",
        //备注
        remark: "",
        //年龄
        age: 1,
        //是否为常用联系人
        importance: 0,
        //是否为重要联系人
        commonlyUsed: 0,
        //经度
        longitude: "",
        //纬度
        latitude: "",
        //人物地点
        address: ""
      },
      lng: 0,
      lat: 0,
      address: "",
      //高德地图
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156]
      ],
      position: [113.3245904, 23.1066805],
      center: [113.3245904, 23.1066805],
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

      searchOption: {
        city: "广州",
        citylimit: false
      },
      //地图弹窗
      mapDialogVisible: false,

      showcommonLink: false, // 获取多人联系人弹窗
      newgroups: false,
      visible: false,
      type: 0,
      dataForm: {
        id: 0,
        parentId: "",
        name: "",
        platformId: "",
        createUserId: "",
        gmtCreate: "",
        groupingdescription: "",
        modifiedUserId: "",
        gmtModified: "",
        isDeleted: "",
        eventTypeParentId: "",
        eventTypeParentName: "",
        contactor_ids: "[]",
        contactor_names: "",
        //经度
        longitude: "",
        //纬度
        latitude: "",
        //人物地点
        address: "",
        fax: "",
        remark: "",
        aroundTraffic: "",
        responsibleUnitAddress: "",
        responsibleUnitId: ""
      },
      eventTypeList: [], //树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      dataRule: {
        eventTypeParentName: [{ required: true, message: "请选择一个分组" }],
        responsibleUnitId: [
          { required: true, message: "主管单位不能为空", trigger: "blur" }
        ],
        contactor_ids: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        fax: [{ required: true, message: "传真不能为空", trigger: "blur" }],
        responsibleUnitAddress: [
          { required: true, message: "主管单位地址不能为空", trigger: "blur" }
        ],
        aroundTraffic: [
          { required: true, message: "周边交通不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10字左右", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    Linkman
  },
  mounted() {},
  methods: {
    //地图提交
    LongitudeandLatitude() {
      //经度赋值
      this.contactor.longitude = this.lng;
      //纬度赋值
      this.contactor.latitude = this.lat;
      this.contactor.address = this.address;
      this.dataForm.longitude = this.lng;
      this.dataForm.latitude = this.lat;
      this.dataForm.address = this.address;
      this.mapDialogVisible = false;
    },
    //地图搜索回调事件
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
    init(id, currenTreeObject, type) {
      var that = this;
      this.dataForm.id = id || 0;
      // console.log("init this.dataForm.id", this.dataForm.id);
      this.visible = true;
      this.type = type;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();

        // console.log("mounted this.dataForm.id", this.dataForm.id);
        this.$http({
          url: this.$http.adornUrl(
            `/resoure/resourearticlestorehouse/info/${this.dataForm.id}`
          ),
          method: "get"
          // data: this.$http.adornData({
          //     'id':this.dataForm.id
          // })
        }).then(res => {
          if (data && data.code === 0) {
                // console.log("/resoure/resourearticlestorehouse/info", res);
          Object.keys(that.dataForm).forEach(key => {
            if (res.data.resoureArticleStorehouse[key]) {
              that.dataForm[key] = res.data.resoureArticleStorehouse[key];
            }
          });
          that.dataForm.contactor_names = "";
          that.dataForm.contactor_ids = JSON.parse(that.dataForm.contactor_ids);
          res.data.resoureArticleStorehouse.contactorList.forEach(item => {
            that.dataForm.contactor_names +=
              item.name + ",电话:" + item.mobile1 + "";
            that.dataForm.contactor_ids.push(item.id);
            // console.log("item.id", item.id);
            // console.log("this.dataForm", that.dataForm);
          });
          that.dataForm.contactor_ids = JSON.stringify(
            that.dataForm.contactor_ids
          );
          that.dataForm.eventTypeParentName =
            res.data.resoureArticleStorehouse.groupName;
            } else {
              this.$message.error(data.msg);
            }
        
        });

        /* if (type === 2) {
            this.$http({
              url: this.$http.adornUrl('/mail/mailgroup/list'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.eventTypeParentName=''
              // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
              this.eventTypeList = treeDataTranslate(data.data, 'id')
              console.log(data.data)
              // console.log(this.eventTypeList)
            }).then(() => {
              this.visible = true
            }).then(() => {
              // 新增
              this.dataForm.name=''
              this.dataForm.gmtCreate=''
              this.eventTypeListTreeSetCurrentNode()
            })
          }*/
      });
    },
    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl("/mail/mailgroup/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
           if (data && data.code == 0) {
                this.eventTypeParentName = "";
                data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
                this.eventTypeList = treeDataTranslate(data.data, "id");
          }else{
            this.$message.error(data.msg)
          }
        
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          this.dataForm.gmtCreate = "";
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    // 触发多选组件
    handelVerify(name) {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择",
        name
      );
    },
    // 多选组件 返回数据
    handelLinkdata({ linkman, name }) {
      var that = this;
      // console.log("handelLinkdata", linkman);
      that.dataForm.contactor_ids = JSON.parse(that.dataForm.contactor_ids);
      that.dataForm.contactor_names = "";
      linkman.forEach(element => {
        that.dataForm.contactor_ids.push(element.id);
        that.dataForm.contactor_names += element.name + " ";
        // console.log(
        //   "linkmanlinkmanlinkmanlinkmanlinkmanlinkmanlinkmanlinkmanlinkmanlinkmanlinkmanlinkman",
        //   that.dataForm.contactor_names
        // );
      });

      that.dataForm.contactor_ids = JSON.stringify(that.dataForm.contactor_ids);
    },

    //分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      this.dataForm.responsibleUnitId = data.id;
      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.eventTypeParentName = data.name;
    },

    // 表单提交
    dataFormSubmit() {
      var that = this;
      this.$refs["dataForm"].validate(valid => {
        if (valid && (this.type === 2 || this.type === 3)) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticlestorehouse/${
                this.type === 2 ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id,
              name: this.dataForm.name,
              remark: this.dataForm.remark,
              contactorStringIds: that.dataForm.contactor_ids,
              fax: this.dataForm.fax,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              coordinateType: 1,
              responsibleUnitId: this.dataForm.responsibleUnitId,
              responsibleUnitAddress: this.dataForm.responsibleUnitAddress,
              aroundTraffic: this.dataForm.aroundTraffic,
              address: this.dataForm.address
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
              this.$emit("refreshTreeData");
            } else {
              this.$message.error("请选择你要新增到的分组节点");
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.foor {
  margin-top: 500px;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
