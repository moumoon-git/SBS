<template>
    <el-dialog
        :showClose="false"
        :visible.sync="getContactorVisible"
        width="600px"
        append-to-body
        :before-close="cancel">
        <div slot="title" class="dialog-title">
            <span class="title-text">工单负责人</span>
            <span class="title-cancel-button el-icon-close" @click="getContactorVisible=false"></span>
        </div>
        <div class="contactor-list-container">
            <!-- 1. 搜索栏 -->
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="keyword">
            </el-input>
            <!-- 2. 树形列表 -->
            <el-tree
                :data="this.contactorListData"
                :props="this.contactorListProps"
                :filter-node-method="this.filterNode"
                ref="tree"
                show-checkbox
                :check-strictly="true"
                node-key="id"
                @check-change="checkOpration"
                :default-checked-keys="[this.contactorId]">
            </el-tree>
            <el-pagination
                small
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-count="totalPage"
                :current-page="pageIndex"
            >
            </el-pagination>
        </div>
        <el-button style="position:absolute;bottom:2%; right:18%" @click="cancel">取消</el-button>
        <el-button style="position:absolute;bottom:2%; right:2%" @click="ok" type="primary">确定</el-button>
    </el-dialog>
</template>

<script>
export default {
    name: 'getContactorList',
    props: [
        "contactorId",
        "depId",
    ],
    watch: {
        keyword(val) {
            // this.$refs.tree.filter(val);
            this.getContactorList();
        },
        depId(val) {
            this.getContactorList();
        }
    },
    methods: {
        // 获取负责人列表
        getContactorList() {
            let url = window.SITE_CONFIG['baseUrl'] + '/mail/mailcontactor/list';
            let that = this;
            let send = {
                groupId: that.depId ? [that.depId] : [],
                limit: 10,
                page: this.pageIndex,
                search: this.keyword
            };
            this.$http
            .post(url, send, {emulateJSON:true})
            .then(
                function(res) {
                    console.log("/mail/mailcontactor/list res",res)
                    if(res.data.code==0) {
                        that.contactorListData = res.data.data.list;
                        console.log("获取到的负责人信息：", res.data.data.list, res.data.data.totalPage);
                        that.totalPage = res.data.data.totalPage;
                    // console.log(that.$refs.tree.getCheckedNodes);
                    // console.log(that.$refs);
                    // that.idToName(that.contactorId, that.contactorListData);
                    }else{
                    
                        that.$message.error(res.data.msg)
                    }
                    
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
                this.checkedPosition = checkedNode.position;
                this.checkedMobile1 = checkedNode.mobile1;
                this.$refs.tree.setCheckedKeys([checkedNode.id]);
            } else {
                if (this.checkedId == checkedNode.id) {
                    this.checkedId = '';
                    this.checkedName = '';
                    this.checkedPosition = '';
                    this.checkedMobile1 = '';
                }
            }
            console.log(this.checkedId, this.checkedName, this.checkedPosition, this.checkedMobile1);
        },
        // idToName(contactorId, listData) {
        //     for(item of listData) {
        //         if(item.children != undefined) {
        //             idToName(contactorId, item.children)
        //         }
        //     }
        // },
        // 确认选择
        ok() {
            this.$emit("checkContactorId", this.checkedId, this.checkedName, this.checkedPosition, this.checkedMobile1);
            this.getContactorVisible = false;
        },
        // 取消选择
        cancel() {
            this.checkedId = this.contactorId;
            this.getContactorVisible = false;
            this.keyword = '';
            this.pageIndex= 1;
            this.getContactorList();
        },
        handleCurrentChange(val) {
            this.pageIndex = val;
            this.getContactorList();
        }
    },
    mounted() {
        // 加载获取部门列表
        this.getContactorList();
    },
    data() {
        return {
            // 弹窗是否显示
            getContactorVisible: false,
            // 搜索关键词
            keyword: '',
            // 负责人列表数据
            contactorListData: [],
            // 树形配置参数
            contactorListProps: {
                value: 'id',
                label: 'name',
                children: 'children'
            },
            // 选中的负责人的id
            checkedId: '',
            checkedName: '',
            checkedPosition: '',
            checkedMobile1: '',
            pageIndex: 1,
            totalPage: 1
        }
    },
}
</script>

<style scoped>
    .contactor-list-container {
        min-height: 600px;
        margin-left:10px
    }
</style>