/**
 *
 * 优思工具函数库
 * @Time 15-08-24
 * @Author SAMPAN
 * @description  09-15 改名为 Spadger [小男孩儿]
 * 
 */
var Spadger = function () {

};

/**
 * 数组是否包含某个元素 返回元素在数组中的索引值 否则返回-1
 */
Spadger.prototype.contains = function (arr, str)
{
    var i = arr.length;
    while (i--) {
        if (arr[i] == str) {
            return i;
        }
    }
    return -1;
};


/**
 * 秒倒计时，默认60s 15-08-17 SAMPAN
 * @param {function} [countcb] [倒计时中的回调方法]
 * @param {function} [endcb] [倒计时结束后的毁掉方法]
 * @param {number} [sec] [倒计时时长，默认为60s]
 */
Spadger.prototype.countdown = function () {

	var countdown = function (countcb, endcb, sec) {
		this.time = parseInt(sec) || 60;
		this.countcb = countcb;
		this.countcb = endcb;
		this.flag = 't' + (new Date().getTime());
		this.init();
	}
	countdown.prototype.init = function () {
		var self = this;
		self.time --;
		if (self.time > -1) {
			self.countcb();
			self.flag = setTimeout( function () {
				self.init();
			}, 1000);
		} else {
			self.endcb();
			clearTimeout(self.flag);
		}
	};
	return countdown;

}


/**
 * 时间点倒计时 15-08-17 SAMPAN
 * @param {[time]} [毫秒数] [倒计时停止时间]
 * @param {type} [时间格式] [dd-hh-mm-ss]
 */
Spadger.prototype.alarm = function () {

    var Alarm = function (startime, endtime, countFunc, endFunc) {
        this.time = Math.floor((endtime - startime) / 1000); //时间
        this.countFunc = countFunc; //计时函数
        this.endFunc = endFunc; //结束函数
        this.flag = 't' + Date.parse(new Date().getTime()); //
        this.start();
    };
    Alarm.prototype.start = function () {
        var self = this;

        self.flag = setInterval(function () {
            if (self.time < 0) {
                clearInterval(self.flag);
                self.endFunc();
                console.log('计时结束');
            } else {

                var minute, hour, day, second;
                day = Math.floor(self.time / 60 / 60 / 24) < 10 ? '0' + Math.floor(self.time / 60 / 60 / 24) : Math.floor(self.time / 60 / 60 / 24);
                hour = Math.floor(self.time / 60 / 60 % 24) < 10 ? '0' + Math.floor(self.time / 60 / 60 % 24) : Math.floor(self.time / 60 / 60 % 24);
                minute = Math.floor(self.time / 60 % 60) < 10 ? '0' + Math.floor(self.time / 60 % 60) : Math.floor(self.time / 60 % 60);
                second = Math.floor(self.time % 60) < 10 ? '0' + Math.floor(self.time % 60) : Math.floor(self.time % 60);
                //倒计时执行函数
                self.countFunc(second, minute, hour, day);
                self.time--;

            }
        }, 1000);
    }
    return Alarm;

};

/**
 * 正则表达式规范
 * @return {[object]} [正则表达式]
 */
Spadger.prototype.reg = function () {
    var reg = {
        phone: /^1[3,4,5,7,8][0-9]{1}[0-9]{8}$/, //11位手机号
        name: /^[A-Za-z0-9]{6,20}$/, //账户名：6-20位字母或数字
        safe_code: /^[0-9]{6}$/, //安全码：6位数字
        realname: /^[\u4e00-\u9fa5]+$/, //真名：汉字
        idcard: /(^[0-9]{17}[0-9xX]$)|(^[0-9]{15}$)/, //身份证号
        email: /^[a-z0-9]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]+(-?[a-z0-9]+)?)(\.[a-z0-9]+(-?[a-z0-9]+))*[\.][a-z]{2,4}$/i, //邮箱
        password: /^[A-Za-z0-9]{6,20}$/, //密码：不包含特殊符号
        number: /^[1-9]+$/, //至少一位数字
        verify: /^[0-9]{5}$/ //验证码5位数字
    }
    var info = {
        phone: {
            0: '手机号不能为空',
            1: '手机号码格式错误，请输入11数字位手机号'
        },
        name: {
            0: '账户名不能为空',
            1: '账户名格式错误，请输入6~20位字母或数字'
        },
        safe_code: {
            0: '安全码不能为空',
            1: '安全码错误，请输入6位数字'
        },
        realname: {
            0: '姓名不能为空',
            1: '请输入中文姓名'
        },
        idcard: {
            0: '身份证不能为空',
            1: '身份证格式错误'
        },
        email: {
            0: '邮箱不能为空',
            1: '邮箱格式错误'
        },
        password: {
            0: '密码不能为空',
            1: '密码格式错误，请输入6~20字母或数字'
        },
        number: {
            0: '小时不能为空',
            1: '小时格式错误，请输入至少1位大于0的数字'
        },
        verify: {
            0: '验证码不能为空',
            1: '验证码格式有误，请输入5位数字'
        }

    }
    return {
        reg: reg,
        info: info
    }
};

/**
 * 进行正则验证
 * @param  {[string]} input   [表单验证名字]
 * @param  {[reg]} regPara [input的正则表达式，可选。若有则替换原规范]
 * @param  {[string]} val [input表单只]
 * @return {[string/true]}         [若正则无误，则返回true，否则返回错误信息]
 */
Spadger.prototype.checkReg = function (input, val, regPara, regInfos) {
    var reg = this.reg();

    if (regPara) {//若regPara存在，则替换原来
        for (i in reg.reg) {
            if (reg[i] == input) {
                reg.reg[i] = regPara;
            }
        }

    }
    var returnInfo = true;
    if (val == '' || val == undefined || val.length == 0) {
        return reg.info[input][0];
    } else {
        if (!reg.reg[input].test(val)) {
            return reg.info[input][1]
        }
    }
    return true;

};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = new Spadger();
} else if (typeof define === 'function') {
    var ystool = new Spadger();
    define(ystool);
} else {
    var ystool = new Spadger();
}