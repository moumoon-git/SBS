<!--
 * @Author: qinjiaqi
 * @Date: 2020-10-10 14:00:00
 * @LastEditTime: 2020-11-11 13:24:59
 * @LastEditors: Please set LastEditors
 * @Description: 短信放大弹窗
-->
<template>
    <div>
		<el-dialog :visible.sync="isShow" @close="isShow=false" :append-to-body="true" title="短信预览" :close-on-click-modal="false">
			<el-input
				v-model="copyBusinessCard"
				type="textarea"
				:autosize="{minRows: 10, maxRows: 10}"
				style="font-size:21px"
			></el-input>
        	<br>
			<br>
			<el-button class="OKBtn" type="primary" @click="clickOK">确定</el-button>
			<span style="cursor: pointer">
				<img class="ReadBtn" :src="nowPic" alt="" @click="clickRead">
			</span>
			<span><br>朗读短信</span>
    	</el-dialog>
    </div> 
</template>

<script>
    export default {
		name: "MsgDialog",
		data() {
			return {
				isShow: false, // 是否显示弹窗
				copyBusinessCard: '', // 当前短信文本
				groupPic:[ // 图片切换组
					"/static/img/ConvergedCommunication/textToSpeech_00.png",
					"/static/img/ConvergedCommunication/textToSpeech_01.png",
					"/static/img/ConvergedCommunication/textToSpeech_02.png",
					"/static/img/ConvergedCommunication/textToSpeech_03.png"
				],
				nowPic: "/static/img/ConvergedCommunication/textToSpeech_03.png", // 默认展示的图片
				countPic: 0, // 图片计数器
			}
		},
		methods: {
			/** 
			 * @authorName：qinjiaqi
			 * @param {type} 没有
			 * @return {type} undefined
			 * @description：websocket传短信文本
			 */
			clickRead() {
				this.nowPic = this.groupPic[3] // 防止音频还没加载出来前已经开始动图了
				if(this.copyBusinessCard == "" || this.copyBusinessCard == null || this.copyBusinessCard == undefined)
				    return 			
				// 朗读短信
                var data = {
					type: "Tts",
					msg: this.copyBusinessCard
				}
				var dataJson = JSON.stringify(data);
				console.log("dataJson: ", dataJson);
				var ws = new WebSocket('ws://localhost:9529');
				ws.onopen = function(evt) {		
					console.log("开始播音");
					ws.send(dataJson);
				};	
				// 图片切换
				this.nowPic = this.groupPic[0]
				var _this = this
				let countCopyBusinessCard = 0
				var interval = setInterval(function() {
					countCopyBusinessCard ++;
					// 到达句子末尾并且图片切到倒数第二张时消除定时器，这时图会切到最后一张
					if(countCopyBusinessCard > _this.copyBusinessCard.length && _this.countPic == 2){
                        clearInterval(interval);
				    }
					_this.countPic ++;
					_this.nowPic = _this.groupPic[_this.countPic]; // 换图片
					if( _this.countPic >= _this.groupPic.length ) { // 到最后一张的时候又从头
						_this.countPic = 0;
						_this.nowPic = _this.groupPic[_this.countPic];
					}
				}, 250)
			},
			/** 
			 * @authorName：qinjiaqi
			 * @param {type} 没有
			 * @return {type} undefined
			 * @description：关掉弹窗，同步文本
			 */
			clickOK() {
				this.isShow = false;
				this.$store.commit("setCopyBusinessCard", this.copyBusinessCard);
			}
		}
    }
</script>

<style scoped>
.ReadBtn {
    width: 44px;
    height: 44px;
}
.ReadBtn>img {
    cursor: pointer;
    width: 100%;
    height: 100%;
}
.OKBtn {
	position: relative;
	top: 13px;
    width: 88px;
    height: 44px;
	float: right;
}
</style>