<template>
  <div>
    <div class="back">
      <el-form label-width="100px">
        <el-form-item
          label="预案名称:"
          required
        >
          <el-input
            v-model="name"
            class="input"
            :disabled="disabled"
            :maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="预案版本:"
          required
        >
          <el-input
            v-model="edition"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="所属分类:"
        >
          <el-cascader
            v-model="CategoryTypeId"
            :options="datas"
            :props="{
              value: 'id',
              label: 'name',
              checkStrictly: true,
            }"
            style="width: 300px;"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item
          label="编码:"
        >
          <el-input
            v-model="code"
            :maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="编制单位:"
        >
          <el-input
            v-model="company"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="发布单位:"
        >
          <el-input
            v-model="release"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="发布时间:"
        >
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 300px;"
          />
        </el-form-item>
        <el-form-item
          label="适用区域:"
        >
          <el-input
            v-model="region"
            :maxlength="500"
            show-word-limit
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item
          label="修订时间:"
        >
          <el-date-picker
            v-model="value2"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 300px;"
          />
        </el-form-item>
        <el-form-item
          label="备注:"
        >
          <el-input
            v-model="remarks"
            type="textarea"
            :rows="2"
            :maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button
        type="plain"
        class="sbs-button"
        @click="$router.push({
          path: '/organization',
          name: 'organization'
        });"
      >
        返回
      </el-button>
      <el-button
        type="primary"
        class="sbs-button"
        @click="next"
      >
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Organization',
  data() {
    const data = [{
      id: 0,
      name: '应急类型',
      children: null,
    }];
    return {
      versionId: '', // 预案版本ID
      preplanId: '', // 预案ID
      name: '', // 预案名称
      edition: '', // 版本号
      code: '', // 编码
      company: '', // 编制单位
      release: '', // 发布单位
      region: '', // 适用区域
      value1: '', // 发布时间
      value2: new Date(),
      remarks: '', // 备注
      CategoryTypeId: '', // 事件类型id
      datas: JSON.parse(JSON.stringify(data)), // 左树数据
      disabled: false,
    };
  },
  created() {
    this.getTree();
  },
  methods: {
    // 左树
    getTree() {
      this.$http({
        method: 'post',
        url: '/eos/caseClass/getTree',
        baseURL: window.g.ApiUrl,
      }).then((res) => {
        this.datas[0].children = res.data.data;
        this.getPreplanInfo();
      });
    },
    // 获取预案版本信息
    getPreplanInfo() {
      // 预案id
      this.preplanId = Number(sessionStorage.getItem('preplanId'));
      // 应急类型id
      this.CategoryTypeId = this.treeParentsFind(this.datas, (e) => e.id
        === Number(sessionStorage.getItem('preplanClassId')));
      // 新增版本
      if (Number(sessionStorage.getItem('preplanEditionid'))) {
        this.disabled = true;
        this.name = sessionStorage.getItem('preplanName');
      }
      // 修改预案
      if (this.preplanId && !Number(sessionStorage.getItem('preplanEditionid'))) {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/getPreplanInfo',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.preplanId, // 预案ID
          },
        }).then((res) => {
          const { data } = res.data;
          this.name = data.name; // 预案名称
          this.edition = data.version; // 版本号
          this.code = data.code; // 编码
          this.company = data.builder; // 编制单位
          this.release = data.publishUnit; // 发布单位
          this.value1 = data.publishDate; // 发布时间
          this.region = data.area; // 适用区域
          this.remarks = data.remark;
          this.versionId = data.versionId;
          sessionStorage.setItem('preplanVersionId', data.versionId);
          this.preplanId = data.preplanId;
          this.CategoryTypeId = this.treeParentsFind(this.datas, (e) => e.id === data.classId);
        });
      }
    },
    treeParentsFind(tree, func, path = []) {
      for (const data of tree) {
        path.push(data.id);
        if (func(data)) return path;
        if (data.children) {
          const findNode = this.treeParentsFind(data.children, func, path);
          if (findNode.length) return findNode;
        }
        path.pop();
      }
      return [];
    },
    next() {
      if (this.name === '') {
        this.$message({
          message: '预案名称不能为空',
          type: 'warning',
        });
        return;
      }
      if (this.edition === '') {
        this.$message({
          message: '预案版本不能为空',
          type: 'warning',
        });
        return;
      }
      // 判断是新增还是修改
      if (this.preplanId && !Number(sessionStorage.getItem('preplanEditionid'))) { // 修改
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/updatePreplanInfo',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              preplanId: this.preplanId, // 预案ID
              versionId: this.versionId, // 预案版本ID
              name: this.name, // 预案名称
              version: this.edition, // 版本号
              code: this.code, // 编码
              builder: this.company, // 编制单位
              publishUnit: this.release, // 发布单位
              publishDate: this.value1, // 发布时间
              area: this.region, // 适用区域
              remark: this.remarks, // 备注
              classId: this.CategoryTypeId instanceof Array
                ? this.CategoryTypeId[this.CategoryTypeId.length - 1]
                : this.CategoryTypeId, // 类别Id
            },
          },
        }).then((res) => {
          // 第八步下载的时候要用
          sessionStorage.setItem('preplanName', this.name);
          sessionStorage.setItem('preplanVersionId', res.data.data.versionId);
          this.$emit('refreshList');
          this.$message({
            message: '修改预案成功',
            type: 'success',
          });
        });
      } else if (Number(sessionStorage.getItem('preplanEditionid'))) { // 版本新增
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/add',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              id: Number(sessionStorage.getItem('preplanEditionid')), // 预案ID
              version: this.edition, // 版本号
              // 类型id
              classId: this.CategoryTypeId instanceof Array ? this.CategoryTypeId[this.CategoryTypeId.length - 1] : this.CategoryTypeId,
              code: this.code, // 编码
              builder: this.company, // 编制单位
              publishUnit: this.release, // 发布单位
              publishDate: this.value1, // 发布时间
              area: this.region, // 适用区域
              remark: this.remarks, // 备注
            },
          },
        }).then((res) => {
          // 第八步下载的时候要用
          sessionStorage.setItem('preplanName', this.name);
          sessionStorage.setItem('preplanVersionId', res.data.data.versionId);
          sessionStorage.setItem('preplanEditionid', 0); // 清空
          this.initCatalog();
          this.$emit('refreshList');
          this.$message({
            message: '新增版本成功',
            type: 'success',
          });
        });
      } else { // 预案新增
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/add',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              name: this.name, // 预案名称
              version: this.edition, // 版本号
              // 类型id
              classId: this.CategoryTypeId instanceof Array ? this.CategoryTypeId[this.CategoryTypeId.length - 1] : this.CategoryTypeId,
              code: this.code, // 编码
              builder: this.company, // 编制单位
              publishUnit: this.release, // 发布单位
              publishDate: this.value1, // 发布时间
              area: this.region, // 适用区域
              remark: this.remarks, // 备注
            },
          },
        }).then((res) => {
          // 第八步下载的时候要用
          sessionStorage.setItem('preplanName', this.name);
          sessionStorage.setItem('preplanVersionId', res.data.data.versionId);
          sessionStorage.setItem('preplanEditionid', 0); // 清空
          sessionStorage.setItem('preplanId', res.data.data.preplanId);// 赋值
          this.initCatalog();
          this.$emit('refreshList');
          this.$message({
            message: '新增预案成功',
            type: 'success',
          });
        });
      }
    },
    // 调用初始化预案文本目录。在第七步获取目录，没有这一步获取不了目录树
    initCatalog() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/initCatalog',
        baseURL: window.g.ApiUrl,
        data: {
          versionId: Number(sessionStorage.getItem('preplanVersionId')),
        },
      }).then(() => {});
    },
  },
};
</script>

<style scoped>
.back {
  display: flex;
  justify-content: center;
  height: 72vh;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 4px 4px 0px 0px;
  padding: 20px 10px;
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  position: relative;
  background: #fff;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 0px 0px 4px 4px;
}
</style>
