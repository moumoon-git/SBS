<template>
  <div class="msgHistonryIndex_wrap">
    <div style="height: 100%;">
      <!--
    expandSelectRow点击展开行
    getChildrenSeachData 获取搜索的数据
    SeeTheHistory 查看历史
    callback 回拨
    saveEvent  保存
    transmit   转发
    reply   回复
      -->
      <bigTemplate
        ref="bigTemplate"
        @expandSelectRow="expandSelectRow"
        @getChildrenSeachData="getChildrenSeachData"
        @SeeTheHistory="SeeTheHistory"
        @callback="callback"
        @saveEvent="saveEventInfo"
        @transmit="transmit"
        @reply="reply"
        @clickRow="smgClick"
        @clickEventValue="clickEventValue"
      ></bigTemplate>
    </div>

    <InformaHistory
      v-show="InformaHistoryFlag"
      @closeInformaHis="closeInformaHis"
      ref="InformaHistory"
    ></InformaHistory>
  </div>
</template>

<script>
import bigTemplate from './comonnTemplat/bigTemplate';
import InformaHistory from './comonnTemplat/InformaHistory';
import mixin from '../../../integratedCommunication/icpPhone/icpPhonePage/mixin';
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js'

export default {
    mixins: [mixin, mixin2],
    name: 'msgHistonryIndex',
    data() {
        return {
            InformaHistoryFlag: false,
            startTime: '',
            endTime: '',
            input: '',
            page: 1,
            size: 10,
            stateValue: '',
            historyArray: [],
        };
    },
    methods: {
        smgClick(row, index) {
            this.$emit('smgClick', row, index);
        },
        /**
         * @description: 传递当前选的关联事件的所有信息，使得不用保存，点一下就能加载出它
         * @param {*} item
         * @return {*}
         * @author: qcx
         * @Date: 2021-07-06 16:47:50
         */        
        clickEventValue(item) {
            this.$emit('clickEventValue', item);
        },
        //转发
        transmit(data) {
            this.$emit('transmit', data);
        },
        //回复
        reply(data) {
            this.$emit('reply', data);
        },
        initData() {
            this.InformaHistoryFlag = false;
            this.startTime = '';
            this.endTime = '';
            this.input = '';
            this.page = 1;
            this.size = 10;
            this.stateValue = '';
            this.$refs.bigTemplate.stateValue = '';
        },
        expandSelectRow(data) {
            console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', data);
            data.sendType = 'sms';
            data.sendTypeId = data.id;
            this.$store.dispatch('msgHeadleDatas', data);
        },
        getChildrenSeachData(obj) {
            console.log(obj)
            this.startTime = obj.startTime;
            this.endTime = obj.endTime;
            this.key = obj.input;
            this.page = obj.page;
            this.size = obj.size;
            this.stateValue = obj.stateValue;
            this.getChildrenSeachListData();
        },
        //获取所有列表
        getChildrenSeachListData() {
            let data = {
                beginTime: this.startTime,
                endTime: this.endTime,
                key: this.key,
                page: this.page,
                size: this.size,
                statusId: this.stateValue,
            };
            this.$api.getReceiveSms(data).then(res => {
                 console.log('11111111111',res);
                if (res.errorcode == 0) {
                    if (res.data) {
                        if (res.data.data.length != 0) {
                            res.data.data[0].sendType = 'sms';
                            res.data.data[0].sendTypeId = res.data.data[0].id;
                            this.$store.dispatch(
                                'msgHeadleDatas',
                                res.data.data[0]
                            );
                        }
                    }else{
                        return
                    }
                    this.$refs.bigTemplate.footerPageObj.allData = res.data.data;
                    this.$refs.bigTemplate.footerPageObj.total = res.data.total;
                    this.$refs.bigTemplate.state = 'sms';
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //获取状态列表
        getStateListData() {
            let data = {
                pcode: 'information_processing_status',
            };
            this.$api.eventGetByPcodes(data).then(res => {
                if (res.errorcode == 0) {
                    // console.log(res.data)
                    this.$refs.bigTemplate.stateListData = res.data;
                    this.$refs.bigTemplate.processData = res.data;
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                }
            });
        },
        //获取关联事件
        getEventList() {
            //   let data = {
            //       page:1,
            //       size:10
            //   }
            let data = {};
            this.$api.allEventlist(data).then(res => {
                if (res.errorcode == 0) {
                    this.$refs.bigTemplate.eventOptions = res.data;
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                }
            });
        },
        SeeTheHistory(item) {
            // console.log(item);
            this.$refs.InformaHistory.listData = [];
            
            let obj = {
                id: item.id,
                type: 'sms',
            };
            this.$api.getShowHistory(obj).then(res => {
                
                this.InformaHistoryFlag = true;
                if (res.errorcode == 0) {
                    this.historyArray = [];
                    console.log(res.data);
                    for (let key in res.data) {
                        this.lockHistory(
                            res.data[key],
                            key.substr(0, key.indexOf('L'))
                        );
                        this.historyArray.push(res.data[key]);
                    }
                    let arr = this.historyArray.flat(); //降维成一维
                    console.log(arr, this.historyArray);
                    if (arr != 0) {
                        arr.forEach(ele => {
                            if (ele.list) {
                                ele.name = this.disposeVisName(ele.list);
                            } else {
                                ele.name = '';
                            }
                            if (ele.type == 'phone') {
                                ele.durationStr = this.hourTimeNum(
                                    ele.duration
                                );
                            }
                            ele.millisecond = new Date(ele.time).getTime(); //用毫秒数进行冒泡排序
                        });
                        var len = arr.length;
                        for (var i = 0; i < len - 1; i++) {
                            for (var j = 0; j < len - 1 - i; j++) {
                                // 相邻元素两两对比，元素交换，大的元素交换到后面
                                if (
                                    arr[j].millisecond > arr[j + 1].millisecond
                                ) {
                                    var temp = arr[j];
                                    arr[j] = arr[j + 1];
                                    arr[j + 1] = temp;
                                }
                            }
                        }
                        arr = arr.reverse();
                        console.log(arr);
                        this.$refs.InformaHistory.listData = arr;
                    }
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                }
            });
        },
        //分钟数
        minutes(time) {
            let secondNum = parseInt(time) % 3600; //得到秒
            let minutes = '00';
            //分钟
            if (secondNum >= 60) {
                minutes =
                    parseInt(secondNum / 60) >= 10
                        ? parseInt(secondNum / 60)
                        : '0' + parseInt(secondNum / 60);
            }
            return (
                minutes +
                '分' +
                (secondNum % 60 >= 10
                    ? secondNum % 60
                    : '0' + (secondNum % 60)) +
                '秒'
            );
        },
        //小时
        hourTimeNum(time) {
            //大于等于一个小时
            let hourStr = '00';
            if (time >= 3600) {
                hourStr =
                    parseInt(time / 3600) >= 10
                        ? parseInt(time / 3600)
                        : '0' + parseInt(time / 3600);
                return hourStr + '时' + this.minutes(time);
            } else {
                return this.minutes(time);
            }
        },
        //处理显示姓名
        disposeVisName(data) {
            let str = '';
            if (data.length != 0) {
                data.forEach((ele, index) => {
                    if (index == data.length - 1) {
                        str += ele.contactor;
                    } else {
                        str += ele.contactor + '、';
                    }
                });
            }
            // console.log(str)
            return str;
        },
        //处理查看历史回调的数据
        lockHistory(data, type) {
            if (data.length != 0) {
                data.forEach(ele => {
                    ele.type = type;
                });
            }
        },
        closeInformaHis() {
            this.InformaHistoryFlag = false;
        },
        callback(item) {
            console.log(item)
            // this.talkCall({ number: item.phone });
            this.makePhoneCall(item.phone, item.contactId, item.name, item.eventId);
        },
        saveEventInfo(data) {
            this.$api.disposeSms(data).then(res => {
                if (res.errorcode == 0) {
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                    });
                    this.initData();
                    this.getChildrenSeachListData();
                } else {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                }
            });
        },
    },
    mounted() {
        this.$refs.bigTemplate.phoneHistoryFlag = false; //短信的关闭电话录音
        this.getChildrenSeachListData();
        // 注释原因：短信处置的处置状态不是拿数据库的字典表，是跟后端自定义了状态
        // this.getStateListData();
        this.getEventList();
        this.$bus.$on('newSmssComing', () => {
            this.getChildrenSeachListData();
        });
    },
    components: {
        bigTemplate,
        InformaHistory,
    },
};
</script>

<style scoped>
.msgHistonryIndex_wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
