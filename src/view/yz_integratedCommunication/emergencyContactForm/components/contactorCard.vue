<template>
  <div class="contactor-card">
    <div class="report-unit">
      <div class="unit-name">
        <span>鲁谷街道</span>
      </div>
      <div class="edit"></div>
    </div>
    <div class="phoneNumer-list">
      <div class="highLight-number">
        <div class="item-number">
          <span>办公室电话</span>
          <span>68689652</span>
          <div class="call">
            <div class="phone"></div>
          </div>
        </div>
        <div class="item-number">
          <span>办公室电话</span>
          <span>68689652</span>
          <div class="call">
            <div class="phone"></div>
          </div>
        </div>
        <div class="item-number">
          <span>办公室电话</span>
          <span>68689652</span>
          <div class="call">
            <div class="phone"></div>
          </div>
        </div>
      </div>

      <div class="other-number">
        <el-row :gutter="24">
          <el-col :span="8" class="title">
            <span>办公（Ip）</span>
          </el-col>
          <el-col :span="16">
            <span class="number">办公室83090</span>
            <span>,</span>
            <span class="number">办公室83090</span>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8" class="title">
            <span>值班（Ip）</span>
          </el-col>
          <el-col :span="16">
            <span class="number">83090</span>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8" class="title">
            <span>机组号（Ip）</span>
          </el-col>
          <el-col :span="16">
            <span class="number">667</span>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8" class="title">
            <span>800兆分组</span>
          </el-col>
          <el-col :span="16">
            <span class="number">7BH-02(5368050)</span>
          </el-col>
        </el-row>
      </div>

      <div class="leader-list">
        <div class="title">分管领导</div>
        <div class="list">
          <div class="item">
            <div class="leader-name">
              <span>高庆新（副主任）</span>
            </div>
            <div>
              <div class="unit">重大动物疫情</div>
            </div>
          </div>
          <div class="item">
            <div class="leader-name">
              <span>高庆新（副主任）</span>
            </div>
            <div>
              <div class="unit">重大动物疫情</div>
            </div>
          </div>
          <div class="item">
            <div class="leader-name">
              <span>高庆新（副主任）</span>
            </div>
            <div>
              <div class="unit">重大动物疫情</div>
            </div>
          </div>
          <div class="item">
            <div class="leader-name">
              <span>高庆新（副主任）</span>
            </div>
            <div>
              <div class="unit">重大动物疫情</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContactorCard'
}
</script>
<style scoped>
.contactor-card {
  width:399px;
  height:519px;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 14px 3px rgba(54,121,225,0.09);
  border-radius:4px;
  margin: 14px 0;
  cursor: pointer;
  border:1px solid transparent;
}
.contactor-card:hover {
  border:1px solid rgba(0,145,255,1);
}
.contactor-card:hover .edit{
  display: block;
}
.report-unit {
  width: 399px;
  height: 56px;
  line-height: 56px;
  font-size:18px;
  font-weight:500;
  color:rgba(51,51,51,1);
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.report-unit .unit-name {
  padding-left: 14px;
}
.report-unit .edit {
  display: none;
  width: 25px;
  height: 27px;
  background: url("../../../../../static/img/ConvergedCommunication/edit.png") no-repeat;
  background-size: 100% 100%;
  margin-right: 14px;
  cursor: pointer;
}

.phoneNumer-list {
  width: 100%;
  height: 225px;
  border-top: 1px solid rgba(235,235,235,1);
  border-bottom: 1px solid rgba(235,235,235,1);
}
.highLight-number {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 7px;
  margin-bottom: 8px;
}
.highLight-number .item-number {
  width: 112px;
  height: 59px;
  background-size: 100% 100%;
  background: url("../../../../../static/img/ConvergedCommunication/contactorBg.png") no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
}
.highLight-number .item-number:hover .call {
  display: block;
  background:rgba(240,245,255,0.81);
}
.highLight-number .item-number:hover .call .phone {
  display: block;
}
.highLight-number .item-number .call {
  display: none;
  position: absolute;
  width: 112px;
  height: 59px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background:rgba(240,245,255,0);
}
.highLight-number .item-number .call .phone {
  display: none;
  width: 38px;
  height: 39px;
  background: url("../../../../../static/img/ConvergedCommunication/phone2.png") no-repeat;
  background-size: 100% 100%;
}
.other-number {
  text-align: left;
  padding-left: 28px;
  padding-right: 20px;
}
.other-number .el-row {
  margin-bottom: 17px;
}
.other-number .el-row:hover {
  background:rgba(240,245,255,1);
  border-radius:4px;
}
.other-number .title {
  color: #999999;
}
.other-number .number {
  color: #6B6B6B;
  border-bottom: 1px solid transparent;
}
.other-number .number:hover {
  color: #0091FF;
  border-bottom: 1px solid #0091FF;
}
.leader-list {
  width: 100%;
  height: 236px;
  background:rgba(251,252,255,1)
}
.leader-list .title {
  height:24px;
  line-height: 24px;
  font-size:17px;
  color:rgba(102,102,102,1);
  font-weight:500;
}
.leader-list .list {
  height: 202px;
  overflow-y: scroll;
}
.leader-list  .item {
  border-bottom: 1px solid rgba(235,235,235,0.49);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding: 0 14px;
}
.leader-list .unit {
  height:30px;
  line-height: 30px;
  background:rgba(255,255,255,1);
  border-radius:20px;
  border:1px solid rgba(240,240,240,1);
  font-size:14px;
  font-weight:400;
  color:rgba(102,102,102,1);
  padding: 0 10px;
}
.leader-name {
  height:32px;
  line-height: 32px;
  padding: 0 14px;
}
.leader-name:hover {
  background:rgba(240,245,255,1);
  border-radius:4px;
  color: #0091FF;
}
</style>