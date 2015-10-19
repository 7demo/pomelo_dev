/**
 * audio 音频播放
 */
(function (window, undefined) {

    var audio = {
        soundObject : null,
        url : undefined,
        frameInterval : 20,
        callback : undefined, //音频加载成功时候的方法
        fCallBack : undefined, //音频加载失败的方法
        dom : {
            progress : $(".progress-bar"),
            progressBar : $(".sm2-progress-bar"),
            progressTrack : $(".sm2-progress-track"),
            volume : $("audio.sm2-volume-control"),
            time : $("#playTime"),
            duration : $(".sm2-inline-duration"),
            main : $(".sm2-bar-ui"),
            btn : $(".sm2-inline-button"),
            play : $('#play'),
            pause : $('#pause'),
            replay : $('#replay')
        }
    };

    /**
     * 音频方法 播放 与 暂停
     */
    audio.actions = {

        play:function(){
            if (!audio.soundObject) {
                audio.soundObject = audio.playWithURL(audio.url);
            }
            audio.soundObject.togglePause();
        },
        pause: function() {
            if (audio.soundObject && audio.soundObject.readyState) {
                audio.soundObject.togglePause();
            }
        }

    }

    /**
     * 播放url-----------------必须支持flash 否则无法播放
     */
    audio.playWithURL = function(url){

        //设置音频
        audio.url = url
        soundManager.setup({
            // trade-off: higher UI responsiveness (play/progress bar), but may use more CPU.
            html5PollingInterval: audio.frameInterval,
            flashVersion: 9
        });

        soundManager.onready(function() {
            
            /**
             * 下面的这一坨代码竟然没有用！！！！！！！
             *  不过望文生义 应该是 监听轨道按下的事件
             */
            audio.dom.progressTrack.mousedown(function(e){
                console.log('--------', audio.dom.progressTrack)
                var target, barX, barWidth, x, newPosition, sound;
                target = audio.dom.progressTrack;
                barX = target.offset().left
                barWidth = target[0].offsetWidth;
                x = (e.clientX - barX);
                newPosition = (x / barWidth);
                sound = audio.soundObject;
                if (sound && sound.duration) {
                    sound.setPosition(sound.duration * newPosition);
                    // a little hackish: ensure UI updates immediately with current position, even if audio is buffering and hasn't moved there yet.
                    if (sound._iO && sound._iO.whileplaying) {
                        sound._iO.whileplaying.apply(sound);
                    }
                }
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;

            });

            /**
             * 监听按钮
             * 啥按钮 别问我 我也不知道
             */
            audio.dom.btn.on("click",function(e){
                console.log(audio.soundObject.playState)
                if (audio.soundObject.playState) {
                    audio.actions.pause()
                }else{
                    audio.actions.play()
                }
            })

            /**
             * 播放
             */
            audio.dom.play.on("click",function(e){
                console.log('播放', audio.soundObject.playState)
                audio.actions.play();

                $('#pause').removeClass('fn-hide').siblings('i.fa').addClass('fn-hide');
            })

            /**
             * 暂停
             */
            audio.dom.pause.on("click",function(e){
                console.log('播放', audio.soundObject.playState)
                audio.actions.pause();
                replay.stop();
                $('#play').removeClass('fn-hide').siblings('i.fa').addClass('fn-hide');
            })

        
            audio.makeSound()
            audio.soundObject.play()
  
        });
    }


    /**
     * 
     */
    audio.dom.progressTrack.on("onmousedown",function(e){
        console.log(e.target)
    })

    /**
     * 开始播放声
    */
    audio.makeSound = function(){

        var sound = soundManager.createSound({
            url: audio.url,
            volume: 100,
            whileplaying: function() {

                //播放中执行的事件  一直会执行
                //this.position 表示当前播放到第 多少毫秒数
                //this.durationEstimate 与 this.duration 都是总时长
                var progressMaxLeft = 100, //用来表示100%
                    left,
                    width; //进度条的宽度 以 100为基准
                left = Math.min(progressMaxLeft, Math.max(0, (progressMaxLeft * (this.position / this.durationEstimate)))) + '%'; 
                width = Math.min(100, Math.max(0, (100 * this.position / this.durationEstimate))) + '%';
                if (this.duration) { 
                    audio.dom.progress.css("width", width);
                    // 更改为 显示剩余时间  
                    audio.dom.time.html(audio.getTime((this.durationEstimate - this.position), true));
                    if (audio.callback) {
                        audio.callback(this.position)
                    }
                }

            },

            onbufferchange: function(isBuffering) {

            },

            onplay: function() {
                //播放
                console.log("aaaaaaaa:",audio.dom.main)
                $('#pause').removeClass('fn-hide');
                audio.dom.main.removeClass("paused").removeClass("playing").addClass("playing")
             
            },

            onpause: function() {
                audio.dom.main.removeClass("playing").removeClass("paused").addClass("paused")
            },

            onresume: function() {
                audio.dom.main.removeClass("paused").removeClass("playing").addClass("playing")
            },

            whileloading: function() {
                if (!this.isHTML5) {
                    audio.dom.duration.html(audio.getTime(this.durationEstimate, true))
                }
            },

            onload: function(ok) {
                if (ok) {
                    audio.dom.duration.html(audio.getTime(this.durationEstimate, true))
                } else if (this._iO && this._iO.onerror) {
                    this._iO.onerror();
                }
            },

            onerror: function() {

            },
            onstop: function() {

            },

            onfinish: function() {
                $('.p-play-control i.fa').addClass('fn-hide');
                if (audio.fCallBack) audio.fCallBack()
            }

        });
        audio.soundObject = sound
    }

    /**
     * 
     */
    audio.getTime = function(msec, useString) {

        if (msec < 0) {
            return '00:00'
        } else {
            var nSec = Math.floor(msec/1000),
                hh = Math.floor(nSec/3600),
                min = Math.floor(nSec/60) - Math.floor(hh * 60),
                sec = Math.floor(nSec -(hh*3600) -(min*60));
            return (useString ? ((hh ? hh + ':' : '') + (hh && min < 10 ? '0' + min : min) + ':' + ( sec < 10 ? '0' + sec : sec ) ) : { 'min': min, 'sec': sec });
        };

    }

    window.audio = audio;

})(window);

