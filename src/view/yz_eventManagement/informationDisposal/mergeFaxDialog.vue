<template>
<div>
    <!-- 传真预览对话框 -->
    <el-dialog :visible.sync="isMergeFaxDialog" width="1126px" class="dialog-style" :close-on-click-modal="false" @close="faxMergeClose" top="2vh">
        <div slot="title" class="dialog-header" v-text="'合并传真'"></div>
        <div style="height:750px;">
            <el-row>
                <el-col :span="8" style="border-right: 1px solid #ddd">
                    <div style="padding:12px;">
                        <div style="width: 100%;margin: 0 auto">
                            <el-date-picker style="width: 100%;margin: 15px auto" v-model="faxTimeDate" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                        <div style="display: flex;">
                            <el-input placeholder="请输入关键字" v-model="faxSearch" class="input-with-select">
                                <el-button slot="append" icon="el-icon-search" type="primary" @click='seachResult'></el-button>
                            </el-input>
                        </div>
                        <!--传真列表-->
                        <div style="width: 100%;height: 100%">
                            <div style="height: 550px;">
                                <el-scrollbar style="height: 100%">
                                    <div style="margin-top: 10px;text-align: left;" v-for="(item,index) in  faxList" :key="index" @click="faxListIndexClick(item,index)">
                                        <el-card :class="{ cardModelDiv:changeIndex == index}" shadow="hover" :body-style="bodyStyle" style="box-shadow:0 11px 56px -11px rgba(54, 121, 225, 0.16)">
                                            <div slot="header">
                                                <div style="font-weight:bold;font-size:17px;color:#555555;">{{`${item.unit?item.unit:item.phone}`}}</div>
                                                <el-button @click="addFaxListIndex(item, index)" size="small" type="text" :disabled="item.addOkIsNo =='添加' ? false:true" :class="item.addOkIsNo =='添加' ? 'add':'added'">{{item.addOkIsNo}}</el-button>
                                                <div style="font-size:14px;color:#999999;padding-top: 10px">{{item.time}}</div>
                                            </div>

                                            <div v-if="item.event">
                                                <div style="font-size:17px;color:#666666;margin-bottom:8px;">{{item.title}}</div>
                                                <div style="font-size:17px;color:#999999;">
                                                    {{item.event}}
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div style="font-size:17px;color:#666666;width:130px;margin:0 auto;">
                                                    暂无关联事件
                                                    <div class="icon-smile"></div>
                                                </div>
                                            </div>
                                        </el-card>
                                    </div>
                                </el-scrollbar>
                            </div>
                            <div style="margin: 10px 0;position: relative;height: 28px;display: flex;justify-content: center;">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15 , 20]" :page-size="pageSize" layout=" prev, pager, next,sizes, jumper" :total="faxTotal">
                                </el-pagination>
                            </div>
                            <div style="display: flex;width: 100%;align-items: center;">
                                <div style="flex: 1;text-align: left">
                                    已选中传真
                                    <span style="
                      display: inline-block;margin-left: 10px;
                      color: #333333;font-weight:600;width:34px;height:31px;line-height: 31px;text-align: center;
                      background:rgba(243,243,247,1);border-radius:6px;">{{addIndexList.length}}</span>
                                </div>
                                <div style="flex: 1;text-align: right">
                                    <el-button type="primary" size="small" @click="combineFax">合并传真</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div style="width: 100%;height: 230px;border-bottom: 1px solid #EDEDED">
                        <div style="display: flex;width: 100%;height: 100%">
                            <div style="border-right: 1px solid #EDEDED;flex: 16">
                                <div v-if="addIndexList.length!==0" style="width: 502px;display: flex;overflow: auto;">
                                    <div v-for="(items, indexs) in addIndexList" :key="indexs">
                                        <div v-if="items.path" class="filecontent1">
                                            <div style="width: 117px;height: 160px;position:relative;">
                                                <div class="romver" @click="mianFaxVisSrc(items.path)"></div>
                                                <iframe :src="items.path" width="117px" height="160px" frameborder="0" scrolling="no">
                                                </iframe>
                                                <i class="el-icon-close" @click="closeCarousel(items , indexs)" style="position: absolute;background-color: black;border-radius: 50%;color: white;
                                right: 0;font-size: 25px;font-weight: bold;top: -10px;"></i>
                                            </div>
                                        </div>
                                        <div v-else class="filecontent1">
                                            <div class="icon-smile">暂无传真文件</div>
                                        </div>
                                    </div>
                                    <!--                      <el-carousel :autoplay="false" type="card" height="200px">-->
                                    <!--                        <el-carousel-item v-for="(items, indexs) in addIndexList" :key="indexs">-->
                                    <!--                          <div v-if="items.path" class="filecontent1">-->
                                    <!--                            <iframe-->
                                    <!--                            :src="items.path"  width="100%" height="90%" frameborder="0" scrolling="no" >-->
                                    <!--                            </iframe>-->
                                    <!--                            <i class="el-icon-close" @click="closeCarousel(items , indexs)"-->
                                    <!--                               style="position: absolute;background-color: black;border-radius: 50%;color: white;-->
                                    <!--                                right: 6px;font-size: 25px;font-weight: bold;top: 0;"></i>-->
                                    <!--                          </div>-->
                                    <!--                          <div v-else class="filecontent1"><div class="icon-smile">暂无传真文件</div></div>-->
                                    <!--                        </el-carousel-item>-->
                                    <!--                      </el-carousel>-->
                                </div>
                                <div v-if="addIndexList.length==0" style="
                                width: 100%;height: 100%;
                                background: url('/static/img/faxBack.png') center no-repeat;
                                background-size: 220px;">

                                </div>
                            </div>
                            <div style="flex: 8;display: flex;flex-direction: column;">
                                <div v-if="combineFaxPath" style="flex: 1;border:1px solid rgba(204,204,204,1);position:relative;">
                                    <div class="romver" @click="mianFaxVisSrc(combineFaxPath)"></div>
                                    <iframe :src="combineFaxPath" id="fpxIframes" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
                                </div>
                                <!--                   -->
                                <div v-if="combineFaxPath" style="height: 30px;line-height: 30px;color: #0091FF;cursor: pointer;" @click="downloadFax">
                                    下载
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width: 100%;height: 510px;">
                        <div class="rightShow" v-if="fpxPreviewPath!=''">
                            <iframe :src="fpxPreviewPath" id="fpxIframe" width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
                        </div>
                        <div v-if="fpxPreviewPath==''" style="
                                width: 100%;height: 100%;
                                background: url('/static/img/faxBack.png') center no-repeat;
                                background-size: 220px;">
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    name: "mergeFaxDialog",
    data() {
        return {
            isMergeFaxDialog: false,
            faxTimeDate: '',
            faxSearch: '',
            faxTotal: 0,
            pageSize: 5,
            currentPage: 1,
            faxNumber: 0,
            faxList: [], //自己存的列表
            faxSeverList: [], //服务返回的列表
            changeIndex: -1, //更改背景颜色
            bodyStyle: {
                padding: '10px 15px',
                backgroundColor: 'transparent',
                cursor: 'pointer'
            }, //cred 默认的样式
            addIndexList: [],
            fpxPreviewPath: '',
            arrListImg: [],
            combineFaxPath: '', //合并好之后的的文件
            addedData: [], // 存储所有已添加的传真
        }
    },
    mounted() {
        this.getUnhandledFax()
    },
    computed: {

    },
    watch: {
        faxList: {
            handler(nV, oV) {
                // console.log(nV , oV)
                if (nV !== oV) {
                    this.faxList = nV
                }
            },
            deep: true
        },
    },
    methods: {
        //显示到中间
        mianFaxVisSrc(src) {
            this.fpxPreviewPath = src
        },
        jiema(res) {
            let sliceSize = 512
            let byteCharacters = atob(res)
            let byteArrays = []
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                let slice = byteCharacters.slice(offset, offset + sliceSize)
                let byteNumbers = new Array(slice.length)
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i)
                }
                let byteArray = new Uint8Array(byteNumbers)
                byteArrays.push(byteArray)
            }
            let blob = new Blob(byteArrays)
            return blob
        },
        //下载传真
        downloadFax() {
            let filename = this.combineFaxPath.substr(this.combineFaxPath.lastIndexOf('/') + 1, ); //72c0d9d068b34cbabe812ea171f0bf94.pdf
            let download = `${window.g.ApiUrl}/eos/communication/pdf/download?filename=${filename}`;
            window.location.href = download
        },
        formatDateTime(time) {
            let date = time;
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            return y + '-' + m + '-' + d;
        },
        /**
         * @description: 初始化传真列表
         * @lastEditor : hexinting
         * @updateTime : 2021-1-11
         * @param {*}
         * @return {*}
         */
        getUnhandledFax() {
            let time1 = '';
            let time2 = '';
            if (this.faxTimeDate) {
                console.log(this.faxTimeDate);
                time1 = this.formatDateTime(this.faxTimeDate[0])
                time2 = this.formatDateTime(this.faxTimeDate[1])
            }
            let data ={
                beginTime: time1,
                endTime: time2,
                key: this.faxSearch,
                page: this.currentPage,
                size: this.pageSize,
                blacklist: 0
            }
            // console.log(data)
            this.$api.getUnhandledFax(data).then((res) => {
                if (res.errorcode == 0) {
                    this.faxSeverList = res.data.data;
                    this.faxList = [];
                    let saveData = [...this.faxSeverList]
                    saveData.forEach((item, index) => {
                        // 已经添加的恢复状态
                        if (this.addedData.length > 0) {
                            for (let i = 0; i < this.addedData.length; i++) {
                                if (item.id == this.addedData[i]) {
                                    saveData[index].addOkIsNo = '已添加'
                                    return
                                } else {
                                    saveData[index].addOkIsNo = '添加'
                                }

                            }
                        } else {
                            saveData[index].addOkIsNo = '添加'
                        }

                    })
                    this.faxList = saveData
                    // console.log(saveData, this.faxList);
                    this.faxTotal = res.data.total
                    // this.faxTotal = 100000
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getUnhandledFax()
        },
        handleSizeChange(val) {
            this.currentPage = val
            this.getUnhandledFax()
        },
        /**
         * @description: 添加需要合并的传真
         * @lastEditor : xuhcuangxing
         * @updateTime : 20201029 15:29
         * @param {*} item 当前传真列表数据
         * @param {*} i :当前传真列表索引值
         * @return {*}
         */
        addFaxListIndex(item, i) {
            this.addedData.push(item.id) // 将已添加的存起来，条件搜索的时候，又可以添加

            let data1 = {
                faxId: item.id
            }
            this.$api.previewFax(data1).then((res) => {
                if (res.errorcode == 0) {
                    let faxPath = window.g.ApiUrl + '/fax/' + res.data;
                    let name = res.data;
                    let content = {
                        index: i,
                        path: faxPath,
                        name
                    }
                    this.faxList[i].addOkIsNo = '已添加'
                    this.arrListImg.push(content)
                    this.addIndexList = this.arrListImg
                    console.log(this.addIndexList);
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        //合并传真
        combineFax() {
            console.log(this.addIndexList)
            if (this.addIndexList.length != 0) {
                let data = {
                    names: [],
                    isDownload: true
                }
                this.addIndexList.forEach(ele => {
                    data.names.push(ele.name)
                })
                this.$api.faxmergePdf(data).then((res) => {
                    if (res.errorcode == 0) {
                        this.combineFaxPath = window.g.ApiUrl + '/fax/' + res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        },
        faxMergeClose() {
            this.$emit('closeFaxDialog')
        },
        faxListIndexClick(item, index) {
            this.changeIndex = index;
            this.fpxPreviewPath = '';
            let data1 = {
                faxId: item.id
            }
            this.$api.previewFax(data1).then((res) => {
                if (res.errorcode == 0) {
                    this.fpxPreviewPath = window.g.ApiUrl + '/fax/' + res.data;
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        /**
         * @description: 删除需要合并的传真，同时恢复传真列表添加状态
         * @lastEditor : xuhcuangxing
         * @updateTime : 20201029 15:29
         * @param {*} item 当前删除的传真数据
         * @param {*} index 当前删除的传真索引值
         * @return {*}
         */
        closeCarousel(item, index) {
            this.arrListImg.forEach((it, i) => {
                if (index == i) {
                    this.arrListImg.splice(i, 1);
                    this.addedData.splice(i, 1); // 删除对应存储的传真
                }
                this.faxList.forEach((or, is) => {
                    if (item.index == is) {
                        this.faxList[is].addOkIsNo = '添加'
                    }
                })

            })
            console.log(this.faxList);
        },
        /**
         * @description: 搜索结果
         * @lastEditor : xuhcuangxing
         * @updateTime : 20201029 15:29
         * @param {*}
         * @return {*}
         */
        seachResult() {
            this.currentPage = 1
            this.getUnhandledFax()
        }
    }
}
</script>

<style scoped>
.dialog-header {
    margin: -20px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    background-color: #F1F4F6;
    padding: 10px 20px;
    font-size: 18px;
    color: #333333;
    text-align: left;
    border-radius: 5px;
}

.dialog-style>>>.el-dialog__headerbtn {
    top: 10px
}

.dialog-style>>>.el-input-group__append {
    background-color: rgba(63, 146, 254, 1);
    color: #fff;
}

.dialog-style>>>.el-dialog__body {
    padding: 20px 10px;
}

.icon-smile {
    background-image: url(/assets/icpImg/smile.png);
    background-repeat: no-repeat;
    width: 25px;
    height: 25px;
    float: right;
}

.add {
    float: right;
    margin-top: -18px;
    color: #0091FF;
    background: rgba(233, 243, 255, 1);
    border-radius: 13px;
    font-size: 14px;
    height: 33px;
    width: 79px;
    text-align: center;
}

.added {
    float: right !important;
    margin-top: -18px !important;
    color: #999999 !important;
    background: rgba(236, 236, 236, 1) !important;
    border-radius: 13px !important;
    font-size: 14px !important;
    height: 33px !important;
    width: 79px !important;
    text-align: center !important;
}

.cardModelDiv {
    border-bottom: 5px solid cornflowerblue;
}

.rightShow {
    width: 700px;
    height: 500px;
    margin: 20px 20px 0 20px;
    box-shadow: 0px 4px 10px 0px #999999;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}

.filecontent1 {
    margin: 10px;
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
}

>>>.el-pagination button {
    padding: 0;
    width: 20px;
    display: inline-block;
    min-width: 20px;
}

>>>.btn-next {
    margin-right: 3px;
}

>>>.el-pagination .el-select .el-input {
    width: 58px;
    margin: 0;
}

>>>.el-pagination__jump,
>>>.el-pagination__sizes {
    margin: 0;
}

>>>.number {
    padding: 0;
    min-width: 20px;
}

>>>.el-pagination {
    padding: 0;
    max-width: 380px;
    margin-left: -10px;
}

>>>.el-pagination__editor.el-input {
    width: 30px;
    margin: 0;
    padding: 0;
}

>>>.el-pager {
    min-width: 35%;
    max-width: 200px;
}

>>>.el-input__icon {
    width: 20px;
}

>>>.el-pagination .el-input__inner {
    padding-right: 20px !important;
    padding-left: 0px;
}

.romver {
    position: absolute;
    top: 0;
    left: 0;
    width: 90%;
    height: 100%;
    z-index: 999;
    background: transparent;
}
</style>
