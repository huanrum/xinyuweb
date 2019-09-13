
var common = require('../common');
var videojs = require('../../lib/video');

/**
 * 媒体播放组件
 */
module.exports = {
    props: ['src'],
    template:`<div>
        <video crossOrigin="Access-Control-Allow-Origin" class="video-js vjs-big-play-centered" ref="video" width="400" height="200" preload="auto" controls>
            <source :src="mp3" type="video/mp4"></source>
            <source :src="src" type="video/mp4"></source>
        </video>
    </div>`,
    data(){
        return {
            mp3: this.src+'.mp3'
        }
    },
    mounted () {
        var self = this;
        videojs(this.$refs.video).ready(function(){
            setTimeout(()=>{
                this.volume(+common.storage('volume') || 0.4);
                this.on('volumechange', function() {
                    common.storage('volume',this.volume(),true);
                });
                this.play();
            },1000);
            this.on('play', function(event) {
                event.preventDefault();
                this.bigPlayButton.hide();
            });
            this.on('pause', function(event) {
                event.preventDefault();
                this.bigPlayButton.show();
            });
            this.on('error',function(event) {
                self.$el.innerHTML =  `<iframe width="${this.width_}px" height="${this.height_}px" src="${self.mp3}"></iframe>`;
            });
        });
    }
};