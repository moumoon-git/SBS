var blankSpace = new RegExp("[ ]");  // 修改空格验证 lastEditor:xuchuangxing  lastUpdateTime:2020-12-16
const mailList = (rule, value, callback) => { //通讯录,内容不能为空
	if (!value) {
		callback(new Error('不能为空'));
	} else {
		var reg = new RegExp("[`~!@#$%^&*=|{}':',\\[\\].<>《》/?~！@#￥……&*——|{}【】‘；：”“'。，、？]");
		if (reg.test(value)) {
			callback(new Error('不能含有特殊字符'));
		} else {
			if (blankSpace.test(value)) {
				callback(new Error('不能含有空格'));
			} else {
				callback();
			}
		}

	}
};
const currencyRules = (rule, value, callback) => { //通用规则,内容不能为空
	if (!value) {
		callback(new Error('不能为空'));
	} else {
		var reg = new RegExp("[`~!@#$%^&*=|{}:\\[\\].<>《》/?~！@#￥……&*——|{}【】；：。？]");
		if (reg.test(value)) {
			callback(new Error('不能含有特殊字符'));
		} else {
			if (blankSpace.test(value)) {
				callback(new Error('不能含有空格'));
			} else {
				callback();
			}
		}

	}
};
const currencyRulesempty = (rule, value, callback) => { //通用规则,内容可以为空
	var reg = new RegExp("[`~!@#$%^&*=|{}:\\[\\].<>《》/?~！@#￥……&*——|{}【】；：。？]");
	if (reg.test(value)) {
		callback(new Error('不能含有特殊字符'));
	} else {
		if (blankSpace.test(value)) {
			callback(new Error('不能含有空格'));
		} else {
			callback();
		}
	}

};
const phoneReg = (rule, value, callback) => { //手机通用规则,内容可以为空
	var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
	if (value == '' || value == null) {
		callback();
	} else {
		if (!reg.test(value)) {
			callback(new Error('格式不正确'));
		} else {
			callback();
		}
	}

};
const fixedTelephone = (rule, value, callback) => { //座机,传真通用规则,内容可以为空
	var reg = /^(0\d{2,3}\-|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,4})?$/;
	if (value == '' || value == null) {
		callback();
	} else {
		if (!reg.test(value)) {
			callback(new Error('格式不正确'));
		} else {
			callback();
		}
	}

};
const otherNumber = (rule, value, callback) => { //其他电话,内容可以为空
	var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
	var reg1 = /^(0\d{2,3}\-|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,4})?$/;
	if (value == '' || value == null) {
		callback();
	} else {
		if (!reg.test(value) && !reg1.test(value)) {
			callback(new Error('格式不正确'));
		} else {
			callback();
		}
	}

};
const postCode = (rule, value, callback) => { //邮政编码,内容可以为空
	var reg = new RegExp('^[0-9]{6}$');
	if (value == '' || value == null) {
		callback();
	} else {
		if (!reg.test(value)) {
			callback(new Error('格式不正确'));
		} else {
			callback();
		}
	}

};
const numberType = (rule, value, callback) => { //纯数字,内容可以为空
	var reg = new RegExp('^[0-9]*$');
	if (value == '' || value == null) {
		callback();
	} else {
		if (!reg.test(value)) {
			callback(new Error('请填写纯数字'));
		} else {
			callback();
		}
	}

};

const emailCheck = (rule, value, callback) => {	//邮件
	var emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
	if (value === "" || value === null || value === undefined) {
		callback()
	} else {
		if (!emailReg.test(value)) {
			callback(new Error('格式不正确'));
		} else {
			callback();
		}
	}
};

export default {
	mailList,
	currencyRules,
	currencyRulesempty,
	phoneReg,
	fixedTelephone,
	otherNumber,
	postCode,
	numberType,
	emailCheck,
};
