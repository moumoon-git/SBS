<template>
  <div class="contingency-plan-plan-type">
    <div v-for="(item, index) in sort_typeData" :key="index" class="type-tree">
      <div class="type-search">
        <sv-input-search
          v-model="item.search"
          placeholder="按enter搜索"
          width="100%"
          @change="searchTree(item.name, item.search)"
        />
      </div>
      <div class="type-tree-title">
        <div :class="item.name !== '物资类型' && item.name !== '装备类型'?'contingency-plan__title__flex':'contingency-plan__title'">
          <span>{{ item.name }}</span>
          <div v-if="item.name !== '物资类型' && item.name !== '装备类型'" >
            <img v-show="handleObj.typeNum[item.name].assistIcon" :src=" handleObj.typeNum[item.name].assistIcon?cloudUrl + handleObj.typeNum[item.name].assistIcon.iconUrl:'' "/>
            <img v-show="handleObj.typeNum[item.name].assistIcon" @click="deleteDefaultStyle(item.name)" src="./assets/img/close.svg"/>
            <span v-show="!handleObj.typeNum[item.name].assistIcon"  @click="setDefaultStyle(item,item.name)" >设置默认样式</span>
          </div>
        </div>
        <div class="deleteOptionDiv">
          <sv-button
            class="contingency-plan__title__add"
            type="primary"
            @click="businessManagementType(item.name)"
          >新增类型</sv-button>
          <sv-button
            class="contingency-plan__title__add"
            type="primary"
            @click="deleteSelect(index, item.name)"
          >删除</sv-button>
        </div>
      </div>
      <div id="tree" class="sv-tree">
        <el-tree
          ref="treeRef"
          :props="treeProps"
          class="treeGroup"
          :default-expand-all="false"
          :data="item.list"
          :default-checked-keys="checkedIds"
          node-key="id"
          current-node-key
          highlight-current
          show-checkbox
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
            @mouseenter="showTree(data)"
            @mouseleave="hiddenTree(data)"
          >
            <div>
              <img v-if="item.name !== '物资类型' &&  item.name !== '装备类型'" :src="(data.assistIcon?cloudUrl + data.assistIcon.iconUrl:handleObj.typeNum[item.name].assistIcon?cloudUrl + handleObj.typeNum[item.name].assistIcon.iconUrl:require('./assets/img/notAvailable.svg'))"/>
              <span>{{ node.label }}</span>
            </div>
            <span v-show="data.show" class="opearation editItem">
              <!-- 群防共治的平台类型不可修改 -->
              <sv-table-operation
                :display="item.name === '群防共治类型' && data.parentId === 0
                  ? [] : ['edit', 'add', 'delete']"
                @edit="editTreeNode(item.name, data, node)"
                @add="addTreeNode(item.name, data, node)"
                @delete="delTreeNode(item.name, data)"
              />
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <business-dialog-tree
      ref="businessNodeEdit"
      :api="{
        list: treeSetting.search,
        add: treeSetting.add,
        update: treeSetting.update,
        params: showPid,
        paramsIconId: handleObj.paramsIconId
      }"
      :tree-props="delTreeProps"
      @update="initTree(type)"
      @selectStyleFun="openPopup"
    />
    <businessDialogCoplotting :data="handleObj" style="z-index:9999" />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="batchDelete(type, delId)"
    />
    <sv-dialog-hint
      ref="deleteSelect"
      type="delete"
      @confirm="deleteSelectEmit(type)"
    />
  </div>
</template>

<script>
import businessDialogTree from './business_dialog_tree.vue';
import businessDialogCoplotting from './business_dialog_coplotting.vue';
var callback = function () {};
export default {
  components: {
    businessDialogTree,
    businessDialogCoplotting,
  },
  data() {
    return {
      cloudUrl: window.SITE_CONFIG["cloudUrl"],
      typeData: [],
      treeProps: {
        label: 'name',
        children: 'children',
      },
      delTreeProps: {
        children: 'children',
        label: 'name',
      },
      checkedIds: [],
      currentTreeId: 0, // 当前树Id
      parentId: 0, // 当前树父节点Id
      delId: 0, // 删除id
      type: '', // 当前删除类型
      treeSetting: {
        list: '', // 请求类型树接口
        add: '', // 新增接口
        update: '', // 修改接口
        params: '', // 新增/修改除了必传参数外还需要请求的参数
      },
      searchItem: [], // 搜索框
      // 初始化查询接口，改变接口位置可以改变渲染顺序
      initShowApi: [
        '/resoure/resourearticletype/businessType/tree', // 物资
        '/resoure/resoureequipmentclass/treeList', // 装备
        '/resoure/resoureteamtype/tree', // 队伍
        '/resoure/resoureexpertclass/tree', // 专家
        '/resoure/resoureProtectTargetclass/tree', // 防护目标类型
        // '/wechatMobile/selectTypeListByPlatformId', // 群防共治类型
        '/riskDangerType/tree', // 隐患类型
        '/resourceHealthDeptClass/treeList', // 医疗机构
        '/resoureAreaClass/treeList', // 避难场所
        '/resoureArticleStorehouseClass/treeList', // 物资库
        '/resoureEquipmentGroupClass/treeList', // 装备库
      ],
      deleteType: 0, // 删除的类型
      deleteIds: [],
      showPid: {
        apiVersion: '0.0.2',
        showParentId: false, // 区分传pid/parentId
      },
      // 设置样式点的弹窗
      handleObj: {
        paramsIconId: {iconId:undefined,src:""},
        type: '',
        typeNum: {
          '队伍类型': {type:3},
          '专家类型': {type:4},
          '防护目标类型': {type:5},
          '隐患类型': {type:7},
          '医疗机构类型': {type:6},
          '避难场所类型': {type:8},
          '物资库类型': {type:1},
          '装备库类型': {type:2},
        },
        $http: this.$http,
        saveType: 'style',
        handleFun(params){
          if(params.icon){
            this.paramsIconId = params.icon;
            this.paramsIconId.iconId = params.icon.id;
            this.paramsIconId.src = window.SITE_CONFIG["cloudUrl"] + params.icon.iconUrl;
            callback()
            // 弹窗保存时的数据
            // console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$http);
            if(this.saveType === 'style'){
              this.$http({
                url: this.$http.adornUrl('/resourceClassIconDefaultEntity/save'),
                method: 'post',
                headers: {
                  "Content-Type": 'application/x-www-form-urlencoded'
                },
                data: this.$http.adornData({
                  resourceClass:this.typeNum[this.type]['type'], //  综合保障分类的枚举id: (1:物资库,2:装备库,3:队伍,4:专家,5:防护目标,6:医疗机构,7:隐患,8:避难场所)
                  iconId: params.icon.id, //图标id
                },true,'form'),
              }).then((res)=>{
                callback('req')
                // console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', res);
              })
            }
          }
        },
      }
    };
  },
  computed: {
    // 排序类型数组
    sort_typeData() {
      return this.sortByKey(this.typeData, 'sort');
    },
  },
  mounted() {
    callback = this.callback;
    this.initTree('');
    this.getDefaultStyleFun();
  },
  methods: {
    callback(params){
      this.$refs.businessNodeEdit.graph = false;
      if(params){
        this.$nextTick(()=>{
          this.getDefaultStyleFun();
        })
      }
    },
    // 获取默认样式
    getDefaultStyleFun() {
      this.$nextTick(()=>{
        Object.keys(this.handleObj.typeNum).forEach(async e => {
          const type = this.handleObj.typeNum[e]['type'];
          const reust = await this.getDefaultStyle(type);
          if(reust){
            Object.keys(reust).forEach(x=>{
              this.handleObj.typeNum[e][x] = reust[x];
            })
          } else {
            this.handleObj.typeNum[e] = {type:this.handleObj.typeNum[e]['type']}
          }
        });
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.handleObj.typeNum);
      })
    },
    // 获取默认样式请求
    async getDefaultStyle(resourceClass) {
      const res = await this.$http({
        url: this.$http.adornUrl('/resourceClassIconDefaultEntity/getByResourceClass'),
        method: 'get',
        params: {
          resourceClass, //  综合保障分类的枚举id: (1:物资库,2:装备库,3:队伍,4:专家,5:防护目标,6:医疗机构,7:隐患,8:避难场所)
        },
      })
      return res.data.data
    },
    // 按照sort升序排序类型数组
    sortByKey(array, key) {
      return array.sort((a, b) => {
        let flag = 0;
        const x = a[key];
        const y = b[key];
        if (x < y) {
          flag = -1;
        } else if (x > y) {
          flag = 1;
        } else {
          flag = 0;
        }
        return flag;
      });
    },
    /**
     * @method
     * @desc 初始化树数据
     * @param
     */
    initTree(type) {
      // 初始化全部数据,循环调用类型搜索接口
      if (type === '') {
        this.typeData = [];
        for (let i = 0; i < this.initShowApi.length; i += 1) {
          this.$http({
            url: this.$http.adornUrl(this.initShowApi[i]),
            method: 'get',
            params: {
              apiVersion: '0.0.2',
            },
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.typeData.push({
                sort: i, // 用于排序，以免每次加载类型渲染排序混乱
                name: data.type, // 类型名字
                list: data.data, // 类型树数据
                search: '', // 搜索关键字
              });
            } else {
              this.$message.error(data.msg);
            }
          }).catch((err) => {
            this.$message.error(err);
          });
        }
      } else { // 更新对应类型数据，调用对应类型接口
        this.initInterface(type);
        this.$http({
          url: this.$http.adornUrl(`/${this.treeSetting.list}`),
          method: 'get',
          params: {
            apiVersion: '0.0.2',
          },
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // 根据不同类型获得对应数组，更新数组值
            this.typeData.map((item) => {
              if (item.name === type) {
                console.log(item.list);
                item.list = data.data;
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    /**
     * @method
     * @desc 根据不同的类型修改请求的接口
     * @param {String} type 类型
     */
    initInterface(type) {
      switch (type) {
        case '物资类型':
          this.treeSetting.list = 'resoure/resourearticletype/businessType/tree'; // 请求物资类型树接口
          this.treeSetting.add = 'resoure/resourearticletype/businessType/save'; // 新增物资类型接口
          this.treeSetting.update = 'resoure/resourearticletype/businessType/update'; // 修改物资类型接口
          this.treeSetting.delete = '/resoure/resourearticletype/businessType/delete'; // 删除物资类型接口
          this.treeSetting.search = '/resoure/resourearticletype/businessType/search'; // 搜索接口
          break;
        case '装备类型':
          this.treeSetting.list = 'resoure/resoureequipmentclass/treeList'; // 请求装备类型树接口
          this.treeSetting.add = 'resoure/resoureequipmentclass/save'; // 新增装备类型接口
          this.treeSetting.update = 'resoure/resoureequipmentclass/update'; // 修改装备类型接口
          this.treeSetting.delete = '/resoure/resoureequipmentclass/delete'; // 删除装备类型接口
          this.treeSetting.search = '/resoure/resoureequipmentclass/search'; // 搜索接口
          break;
        case '队伍类型':
          this.treeSetting.list = 'resoure/resoureteamtype/tree'; // 请求队伍类型树接口
          this.treeSetting.add = 'resoure/resoureteamtype/save'; // 新增队伍类型接口
          this.treeSetting.update = 'resoure/resoureteamtype/update'; // 修改队伍类型接口
          this.treeSetting.delete = '/resoure/resoureteamtype/deleteNew'; // 删除队伍类型接口
          this.treeSetting.search = '/resoure/resoureteamtype/search'; // 搜索接口
          break;
        case '专家类型':
          this.treeSetting.list = 'resoure/resoureexpertclass/tree'; // 请求专家类型树接口
          this.treeSetting.add = 'resoure/resoureexpertclass/save'; // 新增专家类型接口
          this.treeSetting.update = 'resoure/resoureexpertclass/update'; // 修改专家类型接口
          this.treeSetting.delete = '/resoure/resoureexpertclass/delete'; // 删除专家类型接口
          this.treeSetting.search = '/resoure/resoureexpertclass/search'; // 搜索接口
          break;
        case '防护目标类型':
          this.treeSetting.list = 'resoure/resoureProtectTargetclass/tree'; // 请求防护目标树接口
          this.treeSetting.add = 'resoure/resoureProtectTargetclass/save'; // 新增防护目标接口
          this.treeSetting.update = 'resoure/resoureProtectTargetclass/update'; // 修改防护目标接口
          this.treeSetting.delete = '/resoure/resoureProtectTargetclass/delete'; // 删除防护目标接口
          this.treeSetting.search = '/resoure/resoureProtectTargetclass/search'; // 搜索接口
          break;
        case '医疗机构类型':
          this.treeSetting.list = '/resourceHealthDeptClass/treeList'; // 请求防护目标树接口
          this.treeSetting.add = '/resourceHealthDeptClass/save'; // 新增防护目标接口
          this.treeSetting.update = '/resourceHealthDeptClass/update'; // 修改防护目标接口
          this.treeSetting.delete = '/resourceHealthDeptClass/delete'; // 删除防护目标接口
          this.treeSetting.search = '/resourceHealthDeptClass/search'; // 搜索接口
          break;
        case '避难场所类型':
          this.treeSetting.list = '/resoureAreaClass/treeList'; // 请求防护目标树接口
          this.treeSetting.add = '/resoureAreaClass/save'; // 新增防护目标接口
          this.treeSetting.update = '/resoureAreaClass/update'; // 修改防护目标接口
          this.treeSetting.delete = '/resoureAreaClass/delete'; // 删除防护目标接口
          this.treeSetting.search = '/resoureAreaClass/search'; // 搜索接口
          break;
        case '物资库类型':
          this.treeSetting.list = '/resoureArticleStorehouseClass/treeList'; // 请求防护目标树接口
          this.treeSetting.add = '/resoureArticleStorehouseClass/save'; // 新增防护目标接口
          this.treeSetting.update = '/resoureArticleStorehouseClass/update'; // 修改防护目标接口
          this.treeSetting.delete = '/resoureArticleStorehouseClass/delete'; // 删除防护目标接口
          this.treeSetting.search = '/resoureArticleStorehouseClass/search'; // 搜索接口
          break;
        case '装备库类型':
          this.treeSetting.list = '/resoureEquipmentGroupClass/treeList'; // 请求防护目标树接口
          this.treeSetting.add = '/resoureEquipmentGroupClass/save'; // 新增防护目标接口
          this.treeSetting.update = '/resoureEquipmentGroupClass/update'; // 修改防护目标接口
          this.treeSetting.delete = '/resoureEquipmentGroupClass/delete'; // 删除防护目标接口
          this.treeSetting.search = '/resoureEquipmentGroupClass/search'; // 搜索接口
          break;
        case '群防共治类型':
          this.treeSetting.list = '/wechatMobile/selectTypeListByPlatformId'; // 请求群防共治类型树接口
          this.treeSetting.add = 'event/eventType/save?apiVersion=0.0.2'; // 新增群防共治类型接口
          this.treeSetting.update = 'event/eventType/update?apiVersion=0.0.2'; // 修改群防共治类型接口
          this.treeSetting.delete = '/event/eventType/delete?apiVersion=0.0.2'; // 删除群防共治类型接口
          this.treeSetting.search = '/event/eventType/search'; // 搜索接口
          break;
        case '隐患类型':
          this.treeSetting.list = '/riskDangerType/tree'; // 请求隐患类型树接口
          this.treeSetting.add = 'riskDangerType/saveOrUpdate'; // 新增隐患类型接口
          this.treeSetting.update = 'riskDangerType/saveOrUpdate'; // 修改隐患类型接口
          this.treeSetting.delete = '/riskDangerType/deleteBatch'; // 删除隐患类型接口
          this.treeSetting.search = '/riskDangerType/tree'; // 搜索接口
          break;
        default:
          break;
      }
    },
    // 鼠标移入显示功能按钮
    showTree(data) {
      this.$set(data, 'show', true);
    },
    // 鼠标移出隐藏功能按钮
    hiddenTree(data) {
      this.$set(data, 'show', false);
    },
    // 修改树节点
    editTreeNode(type, data, nodes) {
      this.initInterface(type);
      this.handleObj.type = type;
      const node = data;
      if (type === '群防共治类型') {
        this.$http({
          url: this.$http.adornUrl(`/event/eventType/info/${node.id}?apiVersion=0.0.2`),
          method: 'get',
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data.eventType.parentName);
            node.parentName = data.eventType.parentName;
          }
        });
      } else {
        node.parentName = node.parentId === 0 ? '顶级分组' : node.parentName;
      }
      // 修改弹窗标题
      node.customizeTitle = `修改${type}`;
      // 该节点父id
      node.parentId = node.parentId === undefined ? data.pid : data.parentId;
      if (type === '隐患类型') {
        this.showPid.showParentId = true;
      } else {
        this.showPid.showParentId = false;
      }
      setTimeout(() => {
        if(nodes.level === 1 && (type !== '物资类型' && type !== '装备类型')) {
          this.$refs.businessNodeEdit.selectStyleFlag = true;
        }else{
          this.$refs.businessNodeEdit.selectStyleFlag = false;
        }
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$refs.businessNodeEdit.selectStyleFlag);
        if (!node.assistIcon && this.handleObj.typeNum[type]) {
          node.assistIcon = this.handleObj.typeNum[type].assistIcon;
        }
        this.$refs.businessNodeEdit.init('title_deatil_customize_edit', node);
      }, 100);
      this.type = type;
    },
    // 新增树节点
    addTreeNode(type, data) {
      this.initInterface(type);
      const node = data;
      const parID = node.parentId === undefined ? data.pid : data.parentId;
      if (type === '群防共治类型') {
        console.log(node, parID);
        node.parentName = '';
      } else {
        node.parentName = parID === 0 ? '顶级分组' : node.parentName;
      }
      // 新增弹窗标题
      node.customizeTitle = `新增${type}`;
      this.$refs.businessNodeEdit.init('title_deatil_customize_add', node);
      this.type = type;
    },
    // 添加类型按钮
    businessManagementType(type) {
      this.handleObj.saveType = 'addNewStyle';
      this.initInterface(type);
      if (type === '隐患类型') {
        this.showPid.showParentId = true;
      } else {
        this.showPid.showParentId = false;
      }
      const title = `新增${type}`;
      if(type !== '物资类型' && type !== '装备类型') {
        this.$refs.businessNodeEdit.selectStyleFlag = true;
      }else{
        this.$refs.businessNodeEdit.selectStyleFlag = false;
      }
      this.$refs.businessNodeEdit.init('title_deatil_root', title);
      this.type = type;
      this.handleObj.type = type;
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.handleObj);
    },
    // 删除确认弹窗显示
    delTreeNode(type, data) {
      this.$refs.delete_hint.visible = true;
      this.delId = data.id;
      this.type = type;
    },
    // 删除类型
    batchDelete(type, delId) {
      this.initInterface(type);
      this.$http({
        url: this.$http.adornUrl(this.treeSetting.delete),
        method: 'post',
        data: [delId],
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('删除成功');
          this.initTree(type);
        } else {
          this.$message.error(data.message ? data.message : data.msg);
        }
      });
    },
    // 搜索类型
    searchTree(type, search) {
      this.initInterface(type); // 获取对应类型的接口
      const searchData = {
        name: search,
        apiVersion: '0.0.2',
      };
      // this.$http.adornData(searchData),
      this.$http({
        url: this.$http.adornUrl(this.treeSetting.search),
        method: 'get',
        params: searchData,
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData.map((item) => {
            if (item.name === type) {
              item.list = data.data; // 改类型数组重新赋值
            }
            return this.typeData;
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 批量删除
    deleteSelect(index, type) {
      const ids = [];
      const allData = this.$refs.treeRef[index].getCheckedNodes(false, false);
      allData.forEach(element => {
        ids.push(element.id);
      });
      this.$refs.deleteSelect.visible = true;
      this.deleteType = index;
      this.deleteIds = ids;
      this.type = type;
    },
    deleteSelectEmit(type) {
      console.log(type);
      const deleteUrls = [
        '/resoure/resourearticletype/businessType/delete',
        '/resoure/resoureequipmentclass/delete',
        '/resoure/resoureteamtype/deleteNew',
        '/resoure/resoureexpertclass/delete',
        '/resoure/resoureProtectTargetclass/delete',
        '/event/eventType/delete?apiVersion=0.0.2',
        '/riskDangerType/deleteBatch',
        '/resourceHealthDeptClass/delete',
        '/resoureAreaClass/delete',
        '/resoureArticleStorehouseClass/delete',
        '/resoureEquipmentGroupClass/delete',
      ];
      this.$http({
        url: this.$http.adornUrl(deleteUrls[this.deleteType]),
        method: 'post',
        data: this.deleteIds,
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('删除成功');
          // this.sort_typeData = [];
          this.initTree(type);
        } else {
          this.$message.error(data.message ? data.message : data.msg);
        }
      });
    },
    openPopup(type='add'){
      if(type.indexOf('edit') !== -1){
        this.handleObj.saveType = 'addNewStyle';
      }
      this.handleObj.openPopup && this.handleObj.openPopup();
    },
    // 设置默认样式
    setDefaultStyle(params,type) {
      this.handleObj.type = type;
      this.handleObj.saveType = 'style';
      // 那个类型点击的弹窗
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', params,this.handleObj);
      // 打开弹窗
      this.openPopup();
    },
    // 删除默认样式
    deleteDefaultStyle(params){
      this.$http({
        url: this.$http.adornUrl('/resourceClassIconDefaultEntity/delete'),
        method: 'POST',
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        data: this.$http.adornData({
          resourceClass: this.handleObj.typeNum[params].type,
        },true,'form'),
      }).then(()=>{
        this.getDefaultStyleFun();
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.contingency-plan-plan-type {
  width: 100%;
  display: flex;
  justify-content: space-between;
  &__tree__label {
    margin-right: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type-tree {
    width: 25%;
    margin: 0 10px;
    height: calc(100vh - 125px);
    background: white;

    .type-search {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px;

      .message-tree-search-inner {
        border: none;
        outline: none;
        // width: 260px;
        width: calc(100% - 70px);
        font-size: 16px;
      }
    }

    .type-tree-title {
      display: flex;
      flex-direction: column;
    }

    .sv-tree {
      height: 692px;
    }

    .contingency-plan__title {
      line-height: 40px;
      height: 40px;
      text-align: center;
      margin-top: 5px;
    }

    .contingency-plan__title__flex{
      line-height: 40px;
      height: 40px;
      text-align: center;
      margin-top: 5px;
      display: flex;
      position: relative;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      justify-content: space-between;
      &::after{
        content:'';
        position: absolute;
        top: 0;
        left: 5px;
        bottom: 0;
        height: 50%;
        width: 3px;
        background: #0091ff;
        margin: auto;
      }
      &>div{
        position:relative;
        &>img{
          &:nth-child(1){
            width: 25px;
            height: 25px;
          }
          &:nth-child(2){
            width: 10px;
            height: 10px;
            cursor: pointer;
            position:absolute;
            top: 5px;
            right: -5px;
          }
        }
        &>span{
          color: #0091ff;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }

    .contingency-plan__title__add {
      margin: 8px;
      height: 30px !important;
      line-height: 30px;
      padding: 0;
    }

    .editItem {
      right: 10px;
      font-size: 0;
    }

    .custom-tree-node {
      width: 100%;
      display: flex;
      &>div>img{
        width: 20px;
        height: 20px;
        margin: 0 5px;
      }
      justify-content: space-between;
    }
  }
}
.deleteOptionDiv {
  display: flex;
  width: 100%;
  justify-content: space-around;
  .sv-button-primary:nth-child(1) {
    width: 150px !important;
  }
  .sv-button-primary:nth-child(2) {
    width: 100px !important;
  }
}
.el-tree-node__children .custom-tree-node img{
  display: none;
}
</style>
