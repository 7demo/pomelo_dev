/**
 *
 * 优思工具函数库
 * @Time 15-08-24
 * @Author SAMPAN
 * 
 */
var YousiTool = function () {

};

/**
 * 秒倒计时，默认60s 15-08-17 SAMPAN
 * @param {function} [countcb] [倒计时中的回调方法]
 * @param {function} [endcb] [倒计时结束后的毁掉方法]
 * @param {number} [sec] [倒计时时长，默认为60s]
 */
YousiTool.prototype.countdown = function () {

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
YousiTool.prototype.alarm = function () {

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

if (typeof module !== 'undefined' && module.exports) {
    exports.ystool = new YousiTool();
} else if (typeof define === 'function') {
    var ystool = new YousiTool();
    define(ystool);
} else {
    var ystool = new YousiTool();
}