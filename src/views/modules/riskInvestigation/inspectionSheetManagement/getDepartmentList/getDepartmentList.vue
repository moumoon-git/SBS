<template>
    <el-dialog
        :showClose="false"
        :visible.sync="getDepVisible"
        width="600px"
        append-to-body
        :before-close="cancel">
        <!-- 弹窗标题 -->
        <div slot="title" class="dialog-title">
            <span class="title-text">处置部门</span>
            <span class="title-cancel-button el-icon-close" @click="getDepVisible=false"></span>
        </div>
        <!-- 内容主体 -->
        <div class="dep-list-container">
            <!-- 1. 搜索栏 -->
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="keyword">
            </el-input>
            <!-- 2. 树形列表 -->
            <el-tree
                :data="this.departmentListData"
                :props="this.departmentListProps"
                :filter-node-method="this.filterNode"
                ref="tree"
                show-checkbox
                :check-strictly="true"
                node-key="id"
                @check-change="checkOpration"
                :default-checked-keys="[this.depId]">
            </el-tree>
        </div>
        <!-- 底部按钮 -->
        <el-button style="position:absolute;bottom:2%; right:18%" @click="cancel">取消</el-button>
        <el-button style="position:absolute;bottom:2%; right:2%"  @click="ok" type="primary">确定</el-button>
    </el-dialog>
</template>

<script>
export default {
    name: 'getDepartmentList',
    props: [
        "depId",
    ],
    watch: {
        keyword(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        // 获取处置部门列表
        getDepartmentList() {
            let url = window.SITE_CONFIG['baseUrl'] + '/mail/mailgroup/list';
            let that = this;
            this.$http
            .get(url)
            .then(
                function(res) {
                    that.departmentListData = res.data.data;
                    console.log("获取到的部门信息：", that.departmentListData);
                },
                function(res) {
                    console.log("错误信息：", res);
                }
            );
        },
        // 关键词过滤规则
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 树形单选操作，赋值checkedId
        checkOpration(checkedNode, isChecked) {
            if(isChecked) {
                this.checkedId = checkedNode.id;
                this.checkedName = checkedNode.name;
                this.$refs.tree.setCheckedKeys([checkedNode.id]);
            } else {
                if (this.checkedId == checkedNode.id) {
                    this.checkedId = '';
                    this.checkedName = '';
                }
            }
            console.log(this.checkedId, this.checkedName);
        },
        // 确认选择
        ok() {
            this.$emit("checkDepId", this.checkedId, this.checkedName);
            this.getDepVisible = false;
        },
        // 取消选择
        cancel() {
            this.checkedId = this.depId;
            this.getDepVisible = false;
        }
    },
    mounted() {
        // 加载获取部门列表
        this.getDepartmentList();
    },
    data() {
        return {
            // 弹窗是否显示
            getDepVisible: false,
            // 搜索关键词
            keyword: '',
            // 部门列表数据
            departmentListData: [],
            // 树形配置参数
            departmentListProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            // 选中的部门的id
            checkedId: '',
            checkedName: ''
        }
    },
}
</script>

<style scoped>
    .dep-list-container {
        min-height: 600px;
        margin:10px
    }
</style>