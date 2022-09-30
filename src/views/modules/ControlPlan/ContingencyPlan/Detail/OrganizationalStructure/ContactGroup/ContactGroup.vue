<!--<template>
  <div class="addGroup">
    <div class="groupData">
      <div class="addGroup" @click="addGroup(null,1)">添加分组</div>
      <ul class="main">
        <li class="main-video" v-for="(city,index) in tableList.incidentMailgroup" :key="index">
          <div class="top">
            <div class="audio-name">
              <div class="zhiwu">{{city.name}}</div>
              <button class="addUnit" @click="addUnit(city,2)">添加单位</button>
            </div>
            <div class="operation">
              <div style="margin-bottom:5px;">
                <button class="addUnit" @click="editGroupHandle(city,1)">编辑分组</button>
              </div>
              <div>
                <button class="addUnit" @click="delGroup(city,1)">删除分组</button>
              </div>
            </div>
            <div class="img-r" @click="showHide(index,city.id)" ref="arrow">
              <img
                src="../../../../../../../assets/img/triangle-left.png"
                ref="iconfont1"
                class="icon1"
                alt
              />
              <img
                src="../../../../../../../assets/img/triangle.png"
                ref="iconfont2"
                class="icon2"
                alt
              />
            </div>
          </div>
          <div class="audio-body" ref="child" style="display:none;">
            <ul class="teamMember">
              <li
                class="oneTeam"
                v-for="(item,index) in city.rpIncidentUnitEntityList"
                :key="index"
                :class="{'bgc':idx === index && groupId === item.id}"
                @click="detailHandle(index,item.id)"
              >
                <div>{{item.name}}</div>
                <div v-if="idx === index">
                  <i class="el-icon-edit" @click="editGroupHandle(item,2)"></i>
                  <i class="el-icon-delete" @click="delGroup(item,2)"></i>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      :visible.sync="delGroupView"
      width="410px"
      :title="'删除'+(type===1?'分组':'单位')"
      center
      append-to-body
    >
      <p style="text-align:center;">是否删除-{{name}}?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <add-group-or-unit ref="groupUnitView" @saveGroup="saveGroup" @editGroup="editGroup"></add-group-or-unit>
  </div>
</template> -->

<template>
  <!-- <div>
    <div :class="$style.container">
      顶部添加分组按钮
      <div
        :class="$style.header"
        @click="addGroup(null,1)"
      >
        <span>添加分组</span>
      </div>
      分组列表
      <ul :class="$style.list">
        <li
          v-for="(group, groupIndex) in tableList.incidentMailgroup"
          :key="`group_${groupIndex}`"
        >
          分组项
          <div
            :class="[$style.group, { [$style.groupActive]: activeGroupIndex === groupIndex }]"
            @click="activeGroupIndex = groupIndex"
          >
            <div :class="[$style.groupArrow, 'el-icon-arrow-right']"></div>
            <div :class="$style.groupLabel">
              <el-tooltip
                :content="group.name"
                placement="top"
                effect="dark"
              >
                <span>{{ group.name }}</span>
              </el-tooltip>
            </div>
            <sv-table-operation
              :class="$style.groupOperation"
              :display="['cross', 'edit', 'delete']"
              @cross="addUnit(group, 2)"
              @edit="editGroupHandle(group, 1)"
              @delete="delGroup(group, 1)"
            />
          </div>
          分组项的子项目
          <div :class="$style.unit">
            <ul :class="$style.unitItem">
              <li
                v-for="(item,index) in group.rpIncidentUnitEntityList"
                :key="index"
                :class="{ [$style.unitItemActive]: idx === index && groupId === item.id }"
                @click="detailHandle(index,item.id,item.name)"
              >
                <div>{{item.name}}</div>
                <div :class="$style.unitOperation">
                  <i @click="editGroupHandle(item,2)"></i>
                  <i @click="delGroup(item,2)"></i>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      :visible.sync="delGroupView"
      width="410px"
      :title="'删除'+(type===1?'分组':'单位')"
      center
      append-to-body
    >
      <p style="text-align:center;">是否删除-{{name}}?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <add-group-or-unit ref="groupUnitView" @saveGroup="saveGroup" @editGroup="editGroup"></add-group-or-unit>
  </div> -->
  <div class="contingency-plan-plan-type">
    <div class="main">
      <div class="contingency-plan__title">
        <span>部门管理</span>
        <span
          class="contingency-plan__title__add"
          @click="addGroup(null,1)"
        />
      </div>
    </div>

    <div
      id="tree"
      class="sv-tree"
    >
      <el-tree
        ref="tree"
        draggable
        :default-expand-all="false"
        :data="tableList ? tableList.incidentMailgroup : []"
        :props="listProps"
        :default-expanded-keys="checkedIds"
        node-key="id"
        :current-node-key="checkedIds[0]"
        :highlight-current="true"
        @node-click="handleNodeClick"
      >
        <div
          slot-scope="{node}"
          class="sv-tree-node"
        >
          <el-tooltip
            :content="node.label"
            effect="dark"
            placement="top"
          >
            <div class="label">
              {{ node.label }}
            </div>
          </el-tooltip>
          <div class="button">
            <sv-table-operation
              :display="['edit', 'delete']"
              @edit="editGroupHandle(node, 1)"
              @delete="delGroup(node, 1)"
            />
          </div>
        </div>
      </el-tree>
    </div>
    <el-dialog
      :visible.sync="delGroupView"
      width="410px"
      :title="'删除'+(type===1?'部门':'职务')"
      center
      append-to-body
    >
      <p style="text-align:center;">是否删除-{{name}}?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增预案类型组 -->
    <!-- <add-plan-type ref="addPlanTypeView" @delGroup="delGroup" @saveOrEditGroup="saveOrEditGroup"></add-plan-type> -->
    <add-group-or-unit ref="groupUnitView" @saveGroup="saveGroup(arguments)" @editGroup="editGroup(arguments)"></add-group-or-unit>
  </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";
import AddGroupOrUnit from "./AddGroupOrUnit";

export default {
  name: "AddGroup",
  components: {
    AddGroupOrUnit
  },
  data() {
    return {
      // 自定义树的对象属性
      listProps: {
        children: 'children',
        label: 'name',
      },
      checkedIds: [1],
      id: "",
      type: 0,
      idx: 0, //判断单位是否选中
      groupId: "", //判断选中哪个单位
      tableList: {},
      ReservePlanId: "",

      unitId: "", //当前单位Id

      delGroupView: false, //删除分组视图
      name: '', // 删除对象
      // 当前选中的分组
      activeGroupIndex: ''
    };
  },
  mounted() {
    bus.$off('getContactGroup');
    bus.$on('getContactGroup', (val) => {
      this.activeGroupIndex = '';
      if (val) {
        this.ReservePlanId = val.id;
      }
      // 预案下存在部门
      if (val && val.incidentMailgroup && val.incidentMailgroup.length) {
        // 设置当前key值
        this.checkedIds = [val.incidentMailgroup[0].id];
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(val.incidentMailgroup[0].id);
        });
        // 渲染部门列表
        this.handleNodeClick(val.incidentMailgroup[0]);
      }
      // console.log('valvalvalvalvalval', val);
      this.tableList = val;
      // if (
      //   val.incidentMailgroup
      //   && val.incidentMailgroup.length
      //   && val.incidentMailgroup[0].rpIncidentUnitEntityList
      //   && val.incidentMailgroup[0].rpIncidentUnitEntityList.length
      // ) {
      //   this.groupId = val.incidentMailgroup[0].rpIncidentUnitEntityList[0].id;
      // }
    });
  },
  methods: {
    // 删除分组
    delHandle() {
      this.$http({
        url: this.$http.adornUrl(
          `/incidentplan/${
            this.type === 1 ? "rpIncidentMailgroup" : "rpIncidentUnit"
          }/delete`
        ),
        method: 'post',
        data: this.$http.adornData({
          ids: [this.id.toString()],
        }),
      }).then(({ data }) => {
        // console.log(data);
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: '成功删除',
            duration: 1500,
            onClose: () => {
              bus.$emit('showDetail', this.ReservePlanId);
            },
          });
        } else {
          this.$message.error(data.msg);
        }
        this.delGroupView = false;
      });
    },
    handleNodeClick(obj) {
      // console.log(obj);
      // bus.$emit('getContactList', obj);
      bus.$emit('addContact', obj);
    },
    // 添加分组
    addGroup(obj, type) {
      if (this.ReservePlanId) {
        this.type = type;
        // this.$refs.groupUnitView.getDataList(null, "添加", 1);
        this.$refs.groupUnitView.getDataList(null, '新增', 1);
        // this.$nextTick(()=>{
        //   bus.$emit('getAddGroupUnit', this.ReservePlanId);
        // })
        this.$refs.groupUnitView.reservePlanId = this.ReservePlanId;
      } else {
        this.$message.error("请选择预案");
      }
    },
    // saveGroup(name,responsibility) {
    saveGroup(saveArguments) {
      // console.log(saveArguments);
      const [name, responsibility, parentId, responsibilities] = saveArguments;
      // 添加分组
      if (this.type === 1) {
        this.$http({
          url: this.$http.adornUrl("/incidentplan/rpIncidentMailgroup/save"),
          method: "post",
          data: this.$http.adornData({
            name,
            parentId: parentId || 0,
            responsibilities,
            incidentPlanId: this.ReservePlanId,
          })
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: "success",
              message: "成功添加分组"
            });
            bus.$emit("showDetail", this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      } else {
        // 添加单位
        this.$http({
          url: this.$http.adornUrl("/incidentplan/rpIncidentUnit/save"),
          method: "post",
          data: this.$http.adornData({
            name,
            responsibility,
            incidentMailgroupId: this.unitId
          })
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: "success",
              message: "成功添加单位"
            });
            bus.$emit("showDetail", this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    editGroup(editArguments) {
      // console.log(editArguments);
      const [name, responsibility, parentId, responsibilities] = editArguments;
      // 编辑分组
      if (this.type === 1) {
        this.$http({
          url: this.$http.adornUrl(
            '/incidentplan/rpIncidentMailgroup/update',
          ),
          method: 'post',
          data: this.$http.adornData({
            name,
            parentId,
            responsibilities,
            id: this.id,
          })
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '成功编辑分组',
            });
            bus.$emit('showDetail', this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      } else {
        // 编辑职责
        this.$http({
          url: this.$http.adornUrl(
            '/incidentplan/rpIncidentUnit/update',
          ),
          method: 'post',
          data: this.$http.adornData({
            name,
            parentId,
            responsibility,
            id: this.id,
          }),
        }).then(({ data }) => {
          // console.log(data);
          if (data.code === 0) {
            this.$message({
              type: 'success',
              message: '成功编辑单位',
            });
            bus.$emit('showDetail', this.ReservePlanId);
          } else {
            this.$message.error(data.message);
          }
        });
      }
    },
    // 添加单位
    addUnit(obj, type) {
      this.unitId = obj.id;
      this.type = type;
      // this.$refs.groupUnitView.getDataList(null, "添加", 2);
      this.$refs.groupUnitView.getDataList(null, '新增', 2);
    },
    // 编辑
    editGroupHandle(obj, type) {
      // console.log(obj);
      this.id = obj.data.id;
      this.type = type;
      this.$refs.groupUnitView.getDataList(obj.data, '编辑', type);
    },
    // 删除分组
    delGroup(obj, type) {
      // console.log(obj);
      this.id = obj.data.id;
      this.type = type;
      this.name = obj.data.name;
      this.delGroupView = true;
    },
    // 删除分组
    delGroupHandle() {
      this.$http({
        url: this.$http.adornUrl(
          `/incidentplan/${
            this.type === 1 ? "rpIncidentMailgroup" : "rpIncidentUnit"
          }/delete`
        ),
        method: "post",
        data: this.$http.adornData({
          ids: [this.id.toString()]
        })
      }).then(({ data }) => {
        // console.log(data);
        if (data.code === 0) {
          this.$message({
            type: "success",
            message: "成功删除",
            duration: 1500,
            onClose: () => {
              bus.$emit("showDetail", this.ReservePlanId);
            }
          });
        } else {
          this.$message.error(data.msg);
        }
        this.delGroupView = false;
      });
    },
    detailHandle(index, id, name) {
      this.idx = index;
      this.groupId = id;
      // bus.$emit("addContact", { id, name });
    }
  }
};
</script>

<style lang="scss">
.contingency-plan-plan-type{
  width: 300px;
}
// .contingency-plan-plan-type {
//   width: 50%;
//   .groupOperation {
//     display: none;
//     width: 80px;
//     &:hover{
//       display: flex;
//     }
// }
//   &__tree__label {
//     margin-right: 50px;
//     overflow: hidden;
//     text-overflow: ellipsis;
//   }

//   .bianji,
//   .del {
//     width: 24px;
//     height: 24px;
//     display: inline-block;
//     vertical-align: middle;

//     &:active {
//       position: relative;
//       top: 1px;
//     }
//   }

//   .bianji {
//     background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM5My4wMDAwMDAsIC0zMDEuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk5LjAwMDAwMCwgMTY3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzkuNzY2Miw1LjExMDggQzM5LjkxNTMxNDksNC45Njg4OTE2NyAzOS45OTk3MjAxLDQuNzcyMDQ3NjEgMzkuOTk5NzIwMSw0LjU2NjIgQzM5Ljk5OTcyMDEsNC4zNjAzNTIzOSAzOS45MTUzMTQ5LDQuMTYzNTA4MzMgMzkuNzY2Miw0LjAyMTYgTDM3Ljk3ODQsMi4yMzM4IEMzNy44MzY0OTE3LDIuMDg0Njg1MDcgMzcuNjM5NjQ3NiwyLjAwMDI3OTkyIDM3LjQzMzgsMi4wMDAyNzk5MiBDMzcuMjI3OTUyNCwyLjAwMDI3OTkyIDM3LjAzMTEwODMsMi4wODQ2ODUwNyAzNi44ODkyLDIuMjMzOCBMMzUuNDg5MiwzLjYzMzggTDM4LjQ0MzIsNi41ODc4IEwzOS43NjYyLDUuMTEwOCBMMzkuNzY2Miw1LjExMDggWiBNMjYsMTMuMDQ2IEwyNiwxNiBMMjguOTU1NCwxNiBMMzcuNTEwOCw3LjM2NjIgTDM0LjU1NjgsNC40MTIyIEwyNiwxMy4wNDMyIEwyNiwxMy4wNDYgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
    
//     &:hover {
//       background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1NS4wMDAwMDAsIC0xOTYuMDAwMDAwKSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk2LjAwMDAwMCwgOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTM5Ljc2NjIsNS4xMTA4IEMzOS45MTUzMTQ5LDQuOTY4ODkxNjcgMzkuOTk5NzIwMSw0Ljc3MjA0NzYxIDM5Ljk5OTcyMDEsNC41NjYyIEMzOS45OTk3MjAxLDQuMzYwMzUyMzkgMzkuOTE1MzE0OSw0LjE2MzUwODMzIDM5Ljc2NjIsNC4wMjE2IEwzNy45Nzg0LDIuMjMzOCBDMzcuODM2NDkxNywyLjA4NDY4NTA3IDM3LjYzOTY0NzYsMi4wMDAyNzk5MiAzNy40MzM4LDIuMDAwMjc5OTIgQzM3LjIyNzk1MjQsMi4wMDAyNzk5MiAzNy4wMzExMDgzLDIuMDg0Njg1MDcgMzYuODg5MiwyLjIzMzggTDM1LjQ4OTIsMy42MzM4IEwzOC40NDMyLDYuNTg3OCBMMzkuNzY2Miw1LjExMDggTDM5Ljc2NjIsNS4xMTA4IFogTTI2LDEzLjA0NiBMMjYsMTYgTDI4Ljk1NTQsMTYgTDM3LjUxMDgsNy4zNjYyIEwzNC41NTY4LDQuNDEyMiBMMjYsMTMuMDQzMiBMMjYsMTMuMDQ2IFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
//     }
//   }

//   .del {
//     background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2OS4wMDAwMDAsIC0zMDEuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTkuMDAwMDAwLCAxNjcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41MDExNzE0LDYgQzEzLjc3NzcwOTMsNi4wMDA5MTg1NSAxNC4wMDA4Njg3LDYuMjM3MTE3NTYgMTQsNi41Mjg2NzU3MiBMMTQsNi41Mjg2NzU3MiBMMTQsMTQuNDM1ODE0OSBDMTQsMTUuMzA4NjUyMiAxMy4zMjg3NzY3LDE2LjAxODE2NzggMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEwxMi41MDE3OTI0LDE2LjAxODE2NzggTDUuNTAwODM0MjksMTYuMDE4MTY3OCBDNC42NzM4NSwxNi4wMTgxNjc4IDQsMTUuMzA4NjUyMiA0LDE0LjQzNTgxNDkgTDQsMTQuNDM1ODE0OSBMNCw2LjUyMDM3NTk1IEM0LDYuMzc5MjE0MjMgNC4wNTMzOTM5Nyw2LjI0OTEyNDM1IDQuMTQ2MTQ4ODksNi4xNTAzOTY0NCBDNC4yNDA2NjE4Myw2LjA1MjU4NzA5IDQuMzY3NTUwMyw2IDQuNTAwNTY4NTEsNiBMNC41MDA1Njg1MSw2IFogTTEwLjUwMDc3Niw4IEMxMC4yMjM2NDEyLDggMTAsOC4yMDUyMzE4MiAxMCw4LjQ2MDU1MDY3IEwxMCw4LjQ2MDU1MDY3IEwxMCwxMy41NDAyNjgxIEMxMCwxMy43OTU1ODY5IDEwLjIyMzY0MTIsMTQgMTAuNTAwNzc2LDE0IEMxMC43NzYxNjQ2LDE0IDExLjAwMDY3ODksMTMuNzk1NTg2OSAxMS4wMDA2Nzg5LDEzLjU0MDI2ODEgTDExLjAwMDY2MzMsMTMuNTQwMjY4MSBMMTEuMDAwNjYzMyw4LjQ2MDU1MDY3IEMxMS4wMDA2NjMzLDguMjA2MDM2MiAxMC43NzcwMzc3LDggMTAuNTAwNzc2LDggWiBNNy41MDA3NzU5OSw4IEM3LjIyMzY0MTE3LDggNyw4LjIwNTIzMTgyIDcsOC40NjA1NTA2NyBMNyw4LjQ2MDU1MDY3IEw3LDEzLjU0MDI2ODEgQzcsMTMuNzk1NTg2OSA3LjIyMzY0MTE3LDE0IDcuNTAwNzc1OTksMTQgQzcuNzc2MTY0NTgsMTQgOC4wMDA2Nzg4NiwxMy43OTU1ODY5IDguMDAwNjc4ODYsMTMuNTQwMjY4MSBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY2MzI3LDguNDYwNTUwNjcgQzguMDAwNjYzMjcsOC4yMDYwMzYyIDcuNzc3MDM3NjksOCA3LjUwMDc3NTk5LDggWiBNMTEuMzM4MTcxMywyIEMxMi4xNjA5Njg2LDIgMTIuNTA0NjY0NSwyLjM1NTQ2ODkzIDEyLjUwNTUzNjksMy4wNjM2NDUxOSBMMTIuNTA1NTM2OSwzLjA2MzY0NTE5IEwxMi41MDU1MzY5LDMuOTkyNDE5MDggTDE1LjUwOTgzOTksMy45OTI0MTkwOCBDMTUuODM2NjEzMyw0LjA5NDEyNjIzIDE2LDQuMjU5MjY2NzMgMTYsNC40ODc4NDA2IEMxNiw0LjgzMDcwMTQgMTUuNzg0OTg4NCw1IDE1LjUwODk2NzUsNSBMMTUuNTA4OTY3NSw1IEwyLjQ5MTQ4MTEsNSBDMi4yMTU0NjAyMyw1IDIsNC43MjQ4OTk2IDIsNC40ODc4NDA2IEMyLDQuMjUxNTI4NDUgMi4yMTQ1ODc4OCwzLjk5MjQxOTA4IDIuNDkxNDgxMSwzLjk5MjQxOTA4IEwyLjQ5MTQ4MTEsMy45OTI0MTkwOCBMNS40OTg4NTQ2OCwzLjk5MjQxOTA4IEw1LjQ5ODg1NDY4LDMuMDYzNjQ1MTkgQzUuNDk4ODU0NjgsMi4zNTU0Njg5MyA1LjkxMDY3MzEyLDIgNi43Mzg3MjAxNiwyIEw2LjczODcyMDE2LDIgWiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');

//     &:hover {
//       background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYzMS4wMDAwMDAsIC0xOTYuMDAwMDAwKSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTYuMDAwMDAwLCA5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuNTAxMTcxNCw2IEMxMy43Nzc3MDkzLDYuMDAwOTE4NTUgMTQuMDAwODY4Nyw2LjIzNzExNzU2IDE0LDYuNTI4Njc1NzIgTDE0LDYuNTI4Njc1NzIgTDE0LDE0LjQzNTgxNDkgQzE0LDE1LjMwODY1MjIgMTMuMzI4Nzc2NywxNi4wMTgxNjc4IDEyLjUwMTc5MjQsMTYuMDE4MTY3OCBMMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEw1LjUwMDgzNDI5LDE2LjAxODE2NzggQzQuNjczODUsMTYuMDE4MTY3OCA0LDE1LjMwODY1MjIgNCwxNC40MzU4MTQ5IEw0LDE0LjQzNTgxNDkgTDQsNi41MjAzNzU5NSBDNCw2LjM3OTIxNDIzIDQuMDUzMzkzOTcsNi4yNDkxMjQzNSA0LjE0NjE0ODg5LDYuMTUwMzk2NDQgQzQuMjQwNjYxODMsNi4wNTI1ODcwOSA0LjM2NzU1MDMsNiA0LjUwMDU2ODUxLDYgTDQuNTAwNTY4NTEsNiBaIE0xMC41MDA3NzYsOCBDMTAuMjIzNjQxMiw4IDEwLDguMjA1MjMxODIgMTAsOC40NjA1NTA2NyBMMTAsOC40NjA1NTA2NyBMMTAsMTMuNTQwMjY4MSBDMTAsMTMuNzk1NTg2OSAxMC4yMjM2NDEyLDE0IDEwLjUwMDc3NiwxNCBDMTAuNzc2MTY0NiwxNCAxMS4wMDA2Nzg5LDEzLjc5NTU4NjkgMTEuMDAwNjc4OSwxMy41NDAyNjgxIEwxMS4wMDA2NjMzLDEzLjU0MDI2ODEgTDExLjAwMDY2MzMsOC40NjA1NTA2NyBDMTEuMDAwNjYzMyw4LjIwNjAzNjIgMTAuNzc3MDM3Nyw4IDEwLjUwMDc3Niw4IFogTTcuNTAwNzc1OTksOCBDNy4yMjM2NDExNyw4IDcsOC4yMDUyMzE4MiA3LDguNDYwNTUwNjcgTDcsOC40NjA1NTA2NyBMNywxMy41NDAyNjgxIEM3LDEzLjc5NTU4NjkgNy4yMjM2NDExNywxNCA3LjUwMDc3NTk5LDE0IEM3Ljc3NjE2NDU4LDE0IDguMDAwNjc4ODYsMTMuNzk1NTg2OSA4LjAwMDY3ODg2LDEzLjU0MDI2ODEgTDguMDAwNjYzMjcsMTMuNTQwMjY4MSBMOC4wMDA2NjMyNyw4LjQ2MDU1MDY3IEM4LjAwMDY2MzI3LDguMjA2MDM2MiA3Ljc3NzAzNzY5LDggNy41MDA3NzU5OSw4IFogTTExLjMzODE3MTMsMiBDMTIuMTYwOTY4NiwyIDEyLjUwNDY2NDUsMi4zNTU0Njg5MyAxMi41MDU1MzY5LDMuMDYzNjQ1MTkgTDEyLjUwNTUzNjksMy4wNjM2NDUxOSBMMTIuNTA1NTM2OSwzLjk5MjQxOTA4IEwxNS41MDk4Mzk5LDMuOTkyNDE5MDggQzE1LjgzNjYxMzMsNC4wOTQxMjYyMyAxNiw0LjI1OTI2NjczIDE2LDQuNDg3ODQwNiBDMTYsNC44MzA3MDE0IDE1Ljc4NDk4ODQsNSAxNS41MDg5Njc1LDUgTDE1LjUwODk2NzUsNSBMMi40OTE0ODExLDUgQzIuMjE1NDYwMjMsNSAyLDQuNzI0ODk5NiAyLDQuNDg3ODQwNiBDMiw0LjI1MTUyODQ1IDIuMjE0NTg3ODgsMy45OTI0MTkwOCAyLjQ5MTQ4MTEsMy45OTI0MTkwOCBMMi40OTE0ODExLDMuOTkyNDE5MDggTDUuNDk4ODU0NjgsMy45OTI0MTkwOCBMNS40OTg4NTQ2OCwzLjA2MzY0NTE5IEM1LjQ5ODg1NDY4LDIuMzU1NDY4OTMgNS45MTA2NzMxMiwyIDYuNzM4NzIwMTYsMiBMNi43Mzg3MjAxNiwyIFoiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
//     }
//   }
// }
// .container {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
// }

// // 添加分组
// .header {
//   height: 50px;
//   line-height: 50px;
//   cursor: pointer;
//   color: #666666;
//   text-align: center;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   &:before {
//     margin-right: 10px;
//     content: '';
//     display: inline-block;
//     width: 16px;
//     height: 16px;
//     background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5b2i54q257uT5ZCIPC90aXRsZT4KICAgIDxnIGlkPSLnu7zlkIjkv53pmpwiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlupTmgKXpooTmoYjlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MDMuMDAwMDAwLCAtMTEwLjAwMDAwMCkiIHN0cm9rZT0iIzlGQzhGRSIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIzMy4wMDAwMDAsIDEyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDYgTDEyLDYgTTYsNy4xMDU0MjczNmUtMTUgTDYsMTIiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
//   }

//   &:hover {
//     color: #333333;

//     &:before {
//       background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTIgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5b2i54q257uT5ZCIPC90aXRsZT4KICAgIDxnIGlkPSLnu7zlkIjkv53pmpwiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlupTmgKXpooTmoYjlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NjYuMDAwMDAwLCAtMTEwLjAwMDAwMCkiIHN0cm9rZT0iIzAwOTFGRiIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ5Ni4wMDAwMDAsIDEyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0wLDYgTDEyLDYgTTYsNy4xMDU0MjczNmUtMTUgTDYsMTIiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
//     }
//   }
// }

// // 分组列表
// .list {
//   flex-grow: 1;
//   overflow-y: auto;
//   list-style-type: none;
//   margin: 0;
//   padding: 0;

//   &::-webkit-scrollbar {
//     background: transparent;
//     width: 5px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: #d5d5d5;
//     border-radius: 5px;
//   }

//   // 单个分组
//   & > li {
//     & > .group {
//       background: #F7F8FA;
//       height: 43px;
//       line-height: 43px;
//       cursor: pointer;
//       display: flex;
//       align-items: center;

//       .groupArrow {
//         width: 20px;
//         height: 20px;
//         margin: 10px;
//         color: #C0C0C0;
//         font-size: 16px;
//         font-weight: bold;
//         transition: transform 0.5s;
//       }

//       .groupLabel {
//         overflow: hidden;
//         text-overflow: ellipsis;
//         flex-grow: 1;
//       }

//       .groupOperation {
//         display: none;
//         width: 80px;
//       }

//       &:hover .groupOperation {
//         display: flex;
//       }

//       // 单位
//       & + .unit {
//         height: 0;
//         overflow: hidden;
//         transform: height 0.5s;

//         .unitItem {
//           padding: 0;
//           margin: 0;

//           li {
//             border: 1px solid #E4E4E4;
//             border-radius: 4px;
//             margin: 10px;
//             padding: 10px;
//             cursor: pointer;
//             position: relative;

//             .unitOperation {
//               display: none;
//               position: absolute;
//               right: 10px;
//               top: 50%;
//               transform: translateY(-50%);

//               i {
//                 width: 24px;
//                 height: 24px;
//                 display: inline-block;
//                 vertical-align: middle;

//                 &:active {
//                   position: relative;
//                   top: 1px;
//                 }

//                 &:first-child {
//                   background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM5My4wMDAwMDAsIC0zMDEuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk5LjAwMDAwMCwgMTY3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzkuNzY2Miw1LjExMDggQzM5LjkxNTMxNDksNC45Njg4OTE2NyAzOS45OTk3MjAxLDQuNzcyMDQ3NjEgMzkuOTk5NzIwMSw0LjU2NjIgQzM5Ljk5OTcyMDEsNC4zNjAzNTIzOSAzOS45MTUzMTQ5LDQuMTYzNTA4MzMgMzkuNzY2Miw0LjAyMTYgTDM3Ljk3ODQsMi4yMzM4IEMzNy44MzY0OTE3LDIuMDg0Njg1MDcgMzcuNjM5NjQ3NiwyLjAwMDI3OTkyIDM3LjQzMzgsMi4wMDAyNzk5MiBDMzcuMjI3OTUyNCwyLjAwMDI3OTkyIDM3LjAzMTEwODMsMi4wODQ2ODUwNyAzNi44ODkyLDIuMjMzOCBMMzUuNDg5MiwzLjYzMzggTDM4LjQ0MzIsNi41ODc4IEwzOS43NjYyLDUuMTEwOCBMMzkuNzY2Miw1LjExMDggWiBNMjYsMTMuMDQ2IEwyNiwxNiBMMjguOTU1NCwxNiBMMzcuNTEwOCw3LjM2NjIgTDM0LjU1NjgsNC40MTIyIEwyNiwxMy4wNDMyIEwyNiwxMy4wNDYgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
                  
//                   &:hover {
//                     background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1NS4wMDAwMDAsIC0xOTYuMDAwMDAwKSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk2LjAwMDAwMCwgOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTM5Ljc2NjIsNS4xMTA4IEMzOS45MTUzMTQ5LDQuOTY4ODkxNjcgMzkuOTk5NzIwMSw0Ljc3MjA0NzYxIDM5Ljk5OTcyMDEsNC41NjYyIEMzOS45OTk3MjAxLDQuMzYwMzUyMzkgMzkuOTE1MzE0OSw0LjE2MzUwODMzIDM5Ljc2NjIsNC4wMjE2IEwzNy45Nzg0LDIuMjMzOCBDMzcuODM2NDkxNywyLjA4NDY4NTA3IDM3LjYzOTY0NzYsMi4wMDAyNzk5MiAzNy40MzM4LDIuMDAwMjc5OTIgQzM3LjIyNzk1MjQsMi4wMDAyNzk5MiAzNy4wMzExMDgzLDIuMDg0Njg1MDcgMzYuODg5MiwyLjIzMzggTDM1LjQ4OTIsMy42MzM4IEwzOC40NDMyLDYuNTg3OCBMMzkuNzY2Miw1LjExMDggTDM5Ljc2NjIsNS4xMTA4IFogTTI2LDEzLjA0NiBMMjYsMTYgTDI4Ljk1NTQsMTYgTDM3LjUxMDgsNy4zNjYyIEwzNC41NTY4LDQuNDEyMiBMMjYsMTMuMDQzMiBMMjYsMTMuMDQ2IFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
//                   }
//                 }

//                 &:last-child {
//                   background: no-repeat center/100% 100% url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2OS4wMDAwMDAsIC0zMDEuMDAwMDAwKSIgZmlsbD0iIzlGQzhGRSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTkuMDAwMDAwLCAxNjcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy41MDExNzE0LDYgQzEzLjc3NzcwOTMsNi4wMDA5MTg1NSAxNC4wMDA4Njg3LDYuMjM3MTE3NTYgMTQsNi41Mjg2NzU3MiBMMTQsNi41Mjg2NzU3MiBMMTQsMTQuNDM1ODE0OSBDMTQsMTUuMzA4NjUyMiAxMy4zMjg3NzY3LDE2LjAxODE2NzggMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEwxMi41MDE3OTI0LDE2LjAxODE2NzggTDUuNTAwODM0MjksMTYuMDE4MTY3OCBDNC42NzM4NSwxNi4wMTgxNjc4IDQsMTUuMzA4NjUyMiA0LDE0LjQzNTgxNDkgTDQsMTQuNDM1ODE0OSBMNCw2LjUyMDM3NTk1IEM0LDYuMzc5MjE0MjMgNC4wNTMzOTM5Nyw2LjI0OTEyNDM1IDQuMTQ2MTQ4ODksNi4xNTAzOTY0NCBDNC4yNDA2NjE4Myw2LjA1MjU4NzA5IDQuMzY3NTUwMyw2IDQuNTAwNTY4NTEsNiBMNC41MDA1Njg1MSw2IFogTTEwLjUwMDc3Niw4IEMxMC4yMjM2NDEyLDggMTAsOC4yMDUyMzE4MiAxMCw4LjQ2MDU1MDY3IEwxMCw4LjQ2MDU1MDY3IEwxMCwxMy41NDAyNjgxIEMxMCwxMy43OTU1ODY5IDEwLjIyMzY0MTIsMTQgMTAuNTAwNzc2LDE0IEMxMC43NzYxNjQ2LDE0IDExLjAwMDY3ODksMTMuNzk1NTg2OSAxMS4wMDA2Nzg5LDEzLjU0MDI2ODEgTDExLjAwMDY2MzMsMTMuNTQwMjY4MSBMMTEuMDAwNjYzMyw4LjQ2MDU1MDY3IEMxMS4wMDA2NjMzLDguMjA2MDM2MiAxMC43NzcwMzc3LDggMTAuNTAwNzc2LDggWiBNNy41MDA3NzU5OSw4IEM3LjIyMzY0MTE3LDggNyw4LjIwNTIzMTgyIDcsOC40NjA1NTA2NyBMNyw4LjQ2MDU1MDY3IEw3LDEzLjU0MDI2ODEgQzcsMTMuNzk1NTg2OSA3LjIyMzY0MTE3LDE0IDcuNTAwNzc1OTksMTQgQzcuNzc2MTY0NTgsMTQgOC4wMDA2Nzg4NiwxMy43OTU1ODY5IDguMDAwNjc4ODYsMTMuNTQwMjY4MSBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY2MzI3LDguNDYwNTUwNjcgQzguMDAwNjYzMjcsOC4yMDYwMzYyIDcuNzc3MDM3NjksOCA3LjUwMDc3NTk5LDggWiBNMTEuMzM4MTcxMywyIEMxMi4xNjA5Njg2LDIgMTIuNTA0NjY0NSwyLjM1NTQ2ODkzIDEyLjUwNTUzNjksMy4wNjM2NDUxOSBMMTIuNTA1NTM2OSwzLjA2MzY0NTE5IEwxMi41MDU1MzY5LDMuOTkyNDE5MDggTDE1LjUwOTgzOTksMy45OTI0MTkwOCBDMTUuODM2NjEzMyw0LjA5NDEyNjIzIDE2LDQuMjU5MjY2NzMgMTYsNC40ODc4NDA2IEMxNiw0LjgzMDcwMTQgMTUuNzg0OTg4NCw1IDE1LjUwODk2NzUsNSBMMTUuNTA4OTY3NSw1IEwyLjQ5MTQ4MTEsNSBDMi4yMTU0NjAyMyw1IDIsNC43MjQ4OTk2IDIsNC40ODc4NDA2IEMyLDQuMjUxNTI4NDUgMi4yMTQ1ODc4OCwzLjk5MjQxOTA4IDIuNDkxNDgxMSwzLjk5MjQxOTA4IEwyLjQ5MTQ4MTEsMy45OTI0MTkwOCBMNS40OTg4NTQ2OCwzLjk5MjQxOTA4IEw1LjQ5ODg1NDY4LDMuMDYzNjQ1MTkgQzUuNDk4ODU0NjgsMi4zNTU0Njg5MyA1LjkxMDY3MzEyLDIgNi43Mzg3MjAxNiwyIEw2LjczODcyMDE2LDIgWiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');

//                   &:hover {
//                     background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGcgaWQ9Iue7vOWQiOS/nemanCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuW6lOaApemihOahiOWkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYzMS4wMDAwMDAsIC0xOTYuMDAwMDAwKSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2NS4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTYuMDAwMDAwLCA5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuNTAxMTcxNCw2IEMxMy43Nzc3MDkzLDYuMDAwOTE4NTUgMTQuMDAwODY4Nyw2LjIzNzExNzU2IDE0LDYuNTI4Njc1NzIgTDE0LDYuNTI4Njc1NzIgTDE0LDE0LjQzNTgxNDkgQzE0LDE1LjMwODY1MjIgMTMuMzI4Nzc2NywxNi4wMTgxNjc4IDEyLjUwMTc5MjQsMTYuMDE4MTY3OCBMMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEw1LjUwMDgzNDI5LDE2LjAxODE2NzggQzQuNjczODUsMTYuMDE4MTY3OCA0LDE1LjMwODY1MjIgNCwxNC40MzU4MTQ5IEw0LDE0LjQzNTgxNDkgTDQsNi41MjAzNzU5NSBDNCw2LjM3OTIxNDIzIDQuMDUzMzkzOTcsNi4yNDkxMjQzNSA0LjE0NjE0ODg5LDYuMTUwMzk2NDQgQzQuMjQwNjYxODMsNi4wNTI1ODcwOSA0LjM2NzU1MDMsNiA0LjUwMDU2ODUxLDYgTDQuNTAwNTY4NTEsNiBaIE0xMC41MDA3NzYsOCBDMTAuMjIzNjQxMiw4IDEwLDguMjA1MjMxODIgMTAsOC40NjA1NTA2NyBMMTAsOC40NjA1NTA2NyBMMTAsMTMuNTQwMjY4MSBDMTAsMTMuNzk1NTg2OSAxMC4yMjM2NDEyLDE0IDEwLjUwMDc3NiwxNCBDMTAuNzc2MTY0NiwxNCAxMS4wMDA2Nzg5LDEzLjc5NTU4NjkgMTEuMDAwNjc4OSwxMy41NDAyNjgxIEwxMS4wMDA2NjMzLDEzLjU0MDI2ODEgTDExLjAwMDY2MzMsOC40NjA1NTA2NyBDMTEuMDAwNjYzMyw4LjIwNjAzNjIgMTAuNzc3MDM3Nyw4IDEwLjUwMDc3Niw4IFogTTcuNTAwNzc1OTksOCBDNy4yMjM2NDExNyw4IDcsOC4yMDUyMzE4MiA3LDguNDYwNTUwNjcgTDcsOC40NjA1NTA2NyBMNywxMy41NDAyNjgxIEM3LDEzLjc5NTU4NjkgNy4yMjM2NDExNywxNCA3LjUwMDc3NTk5LDE0IEM3Ljc3NjE2NDU4LDE0IDguMDAwNjc4ODYsMTMuNzk1NTg2OSA4LjAwMDY3ODg2LDEzLjU0MDI2ODEgTDguMDAwNjYzMjcsMTMuNTQwMjY4MSBMOC4wMDA2NjMyNyw4LjQ2MDU1MDY3IEM4LjAwMDY2MzI3LDguMjA2MDM2MiA3Ljc3NzAzNzY5LDggNy41MDA3NzU5OSw4IFogTTExLjMzODE3MTMsMiBDMTIuMTYwOTY4NiwyIDEyLjUwNDY2NDUsMi4zNTU0Njg5MyAxMi41MDU1MzY5LDMuMDYzNjQ1MTkgTDEyLjUwNTUzNjksMy4wNjM2NDUxOSBMMTIuNTA1NTM2OSwzLjk5MjQxOTA4IEwxNS41MDk4Mzk5LDMuOTkyNDE5MDggQzE1LjgzNjYxMzMsNC4wOTQxMjYyMyAxNiw0LjI1OTI2NjczIDE2LDQuNDg3ODQwNiBDMTYsNC44MzA3MDE0IDE1Ljc4NDk4ODQsNSAxNS41MDg5Njc1LDUgTDE1LjUwODk2NzUsNSBMMi40OTE0ODExLDUgQzIuMjE1NDYwMjMsNSAyLDQuNzI0ODk5NiAyLDQuNDg3ODQwNiBDMiw0LjI1MTUyODQ1IDIuMjE0NTg3ODgsMy45OTI0MTkwOCAyLjQ5MTQ4MTEsMy45OTI0MTkwOCBMMi40OTE0ODExLDMuOTkyNDE5MDggTDUuNDk4ODU0NjgsMy45OTI0MTkwOCBMNS40OTg4NTQ2OCwzLjA2MzY0NTE5IEM1LjQ5ODg1NDY4LDIuMzU1NDY4OTMgNS45MTA2NzMxMiwyIDYuNzM4NzIwMTYsMiBMNi43Mzg3MjAxNiwyIFoiIGlkPSLlvaLnirbnu5PlkIgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
//                   }
//                 }
//               }
//             }

//             &:hover {
//               background: rgba(0, 145, 255, 0.1);

//               .unitOperation {
//                 display: block;
//               }
//             }

//             &.unitItemActive {
//               border-color: #0091FF;
//               background: rgba(0, 145, 255, 0.1);
//             }
//           }
//         }
//       }
//     }

//     & > .groupActive {
//       .groupArrow {
//         transform: rotate(90deg);
//       }

//       // 显示单位列表
//       & + .unit {
//         height: unset;
//       }
//     }
//   }
// }
</style>