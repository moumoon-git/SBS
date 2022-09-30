import { sectionToChinese, getRelations } from '@/assets/js/yz_common.js';

export default {
  data() {
    return {
      incidentAreaOptions: [], // 所属区域
      reportingUnitOptions: [], // 报告单位
      eventTypeOptions: [], // 灾害类型
    };
  },
  mounted() {
    this.getIncidentAreaOptions(); // 获取所属区域
    this.getReportingUnitOptions(); // 获取报送单位
    this.getEventTypeOptions(); // 获取事件类型
  },
  methods: {
    /**
     * @description 获取报送单位
     */
    getReportingUnitOptions() {
      this.$api.topUnitTree().then((res) => {
        if (res.errorcode === 0) {
          if (res.data) {
            this.reportingUnitOptions = res.data;
          }
        }
      });
    },
    /**
     * @description 获取所属区域
     */
    getIncidentAreaOptions() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            this.incidentAreaOptions = response.data.list;
          }
        });
    },
    /**
     * @description 获取事件类型
     */
    getEventTypeOptions() {
      this.$api.getTree({}).then((res) => {
        if (res.errorcode === 0) {
          this.eventTypeOptions = res.data;
        }
      });
    },
    /**
     * @description 获取灾害类型id
     * @param {number | string} areaId
     */
    getCaseClassId(caseClassId) {
      const typeIds = getRelations({
        arr: this.eventTypeOptions,
        relationKey: 'id',
        findKey: 'id',
        findValue: Number(caseClassId),
      });
      const typeName = getRelations({
        arr: this.eventTypeOptions,
        relationKey: 'name',
        findKey: 'id',
        findValue: Number(caseClassId),
      });
      return {
        typeIds,
        typeName: typeName[typeName.length - 1],
      };
    },

    /**
     * @param {number/string} id 报送单位id or 报送单位名字(数据库中，有的旧数据是报送单位名字，新数据是报送单位id)
     * @returns data data: { id: 报送单位id, name: 报送单位名字 }
     * @description 获取报告单位
     */
    getReportingUnit(value) {
      const reportingUnitIdArr = getRelations({
        arr: this.reportingUnitOptions,
        relationKey: 'id',
        findKey: 'id',
        findValue: value,
      });
      const reportingUnitNameArr = getRelations({
        arr: this.reportingUnitOptions,
        relationKey: 'name',
        findKey: 'id',
        findValue: value,
      });
      return {
        reportingUnitName:
          reportingUnitNameArr[reportingUnitNameArr.length - 1],
        reportingUnit: reportingUnitIdArr,
      };
    },

    /**
     * @description 获取所属区域id
     * @param {number | string} areaId
     */
    getIncidenArea(areaId) {
      const areaIdArr = getRelations({
        arr: this.incidentAreaOptions,
        relationKey: 'id',
        findKey: 'id',
        findValue: Number(areaId),
      });
      const areaName = getRelations({
        arr: this.incidentAreaOptions,
        relationKey: 'townName',
        findKey: 'id',
        findValue: Number(areaId),
      });
      return {
        areaName: areaName[areaName.length - 1],
        areaIds: areaIdArr,
      };
    },

    /**
     * @description 获取转办人的姓名
     */
    getUserInfo(userId) {
      return new Promise((resolve) => {
        this.$http
          .get(`${window.SITE_CONFIG.baseUrl}/sys/user/info/${userId}`)
          .then((response) => {
            if (response.data.code === 0 && response.data.user) {
              resolve(response.data.user.name);
            }
          });
      });
    },

    /**
     * @description 根据列表数据获取表单数据
     */
    getFormData(data) {
      let eventDealData = {
        eventDealId: data.id || '', // 续报id
        serialNumber: data.eventCode || '', // 事件编号
        eventTitle: data.title || '', // 事件标题
        reportedTime: data.reportTime || '', // 报送时间
        incidentTime: data.occurTime || '', // 事发时间
        timeOfWrittenSubmission: data.writtenReportTime || '', // 书面报送时间
        incidenArea: [], // 所属区域
        incidenAreaName: data.area || '', // 所属区域名字
        reportingUnit: [], // 报告单位id
        reportingUnitName: '', // 报告单位名字
        incidentSite: data.address || '', // 事发地点
        submissionMethod: data.reportType || '', // 报送方式
        accidentSituation: data.accidentSituation || '', // 事故情况
        incidenType: [], // 事件类型
        incidenTypeName: data.typeName, // 事件类型
        incidentRank: data.eventLevel || '', // 事件等级
        reportSituation: data.reportSuperior || '', // 上报情况
        reportDescription: data.reportDescription || '', // 事件报文
        speakerName: data.reportMan || '', // 报告人名字
        speakerPhone: data.reportNum || '', // 报告人电话
        beOnDuty:
          data.dutyPeople || sessionStorage.getItem('displayname') || '', // 值班员
        leaderOnDuty: data.dutyLeader || '', // 值班领导
        leaderOnDutyIds: [],
        uploadFileData: data.attachments || [], // 上传文件
        accidentUnit: data.accidentUnit || '', // 事故单位
        disposalSituation: data.disposalSituation || '', // 处置情况
        fallFigureAddress: data.fallFigureAddress || '', // 落图地点
        latitude: data.latitude, // 纬度
        longitude: data.longitude, // 经度
        // -- 扩展信息 start---
        matterCause: data.occurReason || '', // 事发原因
        matterConsequence: data.consequences || '', // 已造成后果
        matterTendency: data.developmentTrend || '', // 事件发展趋势
        step: data.takeSteps || '', // 已采取措施
        matterTrun: '', // 转办人
        matterTime: data.complaint || '', // 转办时间
        matterBranch: data.complaintDepartment || '', // 转办部门
        // --- 扩展信息 end---
        disposalName: '', // 处置姓名
        disposalUnit: '', // 处置单位
        disposalPosition: '', // 处置职务
        disposalPhone: '', // 处置电话
        eventParams: data.eventParams.length > 0 ? data.eventParams : [], // 信息要素
        platformName: data.platformName || '', // 平台名称
      };

      // 获取报告单位。因为element-UI组件中，级联组件需要每一层id组成一个数组。数据库保存报告单位时，只保存了最后一个子级的id。因此需要沿着该子级去寻找祖先id，拼接成数组。
      if (data.reportDepartId) {
        const { reportingUnitName, reportingUnit } = this.getReportingUnit(
          data.reportDepartId,
        );
        eventDealData.reportingUnitName = reportingUnitName;
        eventDealData.reportingUnit = reportingUnit;
      } else {
        eventDealData.reportingUnitName = data.department || data.reportDepart; // 报送单位名字
      }

      // 获取所属区域
      if (data.areaId) {
        const { areaIds, areaName } = this.getIncidenArea(
          data.areaId,
        );
        eventDealData.incidenAreaName = areaName;
        eventDealData.incidenArea = areaIds;
      }

      // 获取事件类型
      if (data.caseClassId) {
        const { typeIds, typeName } = this.getCaseClassId(
          data.caseClassId,
        );
        eventDealData.incidenTypeName = typeName;
        eventDealData.incidenType = typeIds;
      }

      // // 报送方式为三级联动的数据时，事件类型不存在，先自行添加数据，在隐藏
      // this.eventTypeData = this.eventTypeData.filter((v) => !v.threeLevels);
      // if (data.reportType === 5) {
      //   this.eventTypeData.push({
      //     id: data.caseClassId,
      //     name: data.caseClass,
      //     threeLevels: true,
      //   });
      // }

      // 获取转办人姓名
      if (data.complaintOprid) {
        this.getUserInfo(data.complaintOprid).then((res) => {
          eventDealData.matterTrun = res;
        });
      }

      return eventDealData;
    },

    /**
     * @description 获取事件续报初始数据
     * @returns 事件续报初始数据
     */
    initEventDealData() {
      return {
        eventDealId: '', // 续报id
        serialNumber: '', // 事件编号
        eventTitle: '', // 事件标题
        reportedTime: '', // 报送时间
        incidentTime: '', // 事发时间
        timeOfWrittenSubmission: '', // 书面报送时间
        incidenArea: [], // 所属区域
        incidenAreaName: '', // 所属区域
        reportingUnit: [], // 报告单位id
        reportingUnitName: '', // 报告单位名字
        incidentSite: '', // 事发地点
        submissionMethod: '', // 报送方式
        accidentSituation: '', // 事故情况
        incidenType: [], // 事件类型
        incidenTypeName: '', // 事件类型
        incidentRank: '', // 事件等级
        reportSituation: '', // 上报情况
        reportDescription: '', // 事件报文
        speakerName: '', // 报告人名字
        speakerPhone: '', // 报告人电话
        beOnDuty: '', // 值班员
        leaderOnDuty: '', // 值班领导
        leaderOnDutyIds: [],
        uploadFileData: [], // 上传文件
        accidentUnit: '', // 事故单位
        disposalSituation: '', // 处置情况
        fallFigureAddress: '', // 落图地点
        latitude: '', // 纬度
        longitude: '', // 经度
        // -- 扩展信息 start---
        matterCause: '', // 事发原因
        matterConsequence: '', // 已造成后果
        matterTendency: '', // 事件发展趋势
        step: '', // 已采取措施
        matterTrun: '', // 转办人
        matterTime: '', // 转办时间
        matterBranch: '', // 转办部门
        // --- 扩展信息 end---
        disposalName: '', // 处置姓名
        disposalUnit: '', // 处置单位
        disposalPosition: '', // 处置职务
        disposalPhone: '', // 处置电话
        eventParams: [], // 信息要素
      };
    },

    /**
     * @description 通过接口返回的数据，设置事件续报列表
     * @param {array} res 接口返回数据
     * @returns 事件续报列表
     */
    setEventDealList(res = []) {
      let eventData = []; // 事件列表
      res.forEach((item) => {
        eventData.push({
          eventIndex: item.dealOrder, // 事件索引
          dealOrderName:
            item.dealOrderName === ''
              ? `事件续报 + ${sectionToChinese(item.dealOrder)}`
              : item.dealOrderName, // 续报序号， 事件首报，事件续报一
          eventCreateTime:
            item.reportTime && item.reportTime.length === 19
              ? item.reportTime.substring(0, 16)
              : item.reportTime, // 接报时间
          eventData: this.getFormData(item), // 事件数据
          eventDealId: item.id, // 续报id
        });
      });
      return eventData;
    },
  },
};
