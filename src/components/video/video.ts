const styles = require('./video.css');
import Icomponent from '../icomponent';

interface Ivideo{
    url: string;
    elem: string | HTMLElement;
    width?: string;
    height?: string;
    autoplay?: boolean
}

function video(options: Ivideo){
    return new Video(options);
}

class Video implements Icomponent{
    
    tempContainer;

    constructor(private settings: Ivideo){
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            autoplay: false
        }, this.settings);
        
        this.init();
    }

    init(){
        this.template();
        this.handle();
    }

    template(){
        this.tempContainer = document.createElement('div');
        this.tempContainer.className = styles.video;
        this.tempContainer.style.width = this.settings.width;
        this.tempContainer.style.height = this.settings.height;
        this.tempContainer.innerHTML = `
            <video class="${styles['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles['video-controls']}">
                <div class="${styles['video-progress']}">
                    <div class="${styles['video-progress-now']}"></div>
                    <div class="${styles['video-progress-suc']}"></div>
                    <div class="${styles['video-progress-bar']}"></div>
                </div>
                <div class="${styles['video-play']}">
                    <i class="iconfont icon-icon_play"></i>
                </div>
                <div class="${styles['video-time']}">
                    <span>00:00</span> / <span>00:00</span>
                </div>
                <div class="${styles['video-full']}">
                    <i class="iconfont icon-webicon311"></i>
                </div>
                <div class="${styles['video-volume']}">
                    <i class="iconfont icon-shengyin"></i>
                    <div class="${styles['video-volprogress']}">
                        <div class="${styles['video-volprogress-now']}"></div>
                        <div class="${styles['video-volprogress-bar']}"></div>
                    </div>
                </div>
            </div>
            <div class="${styles['video-big-play']}">
                <i class="iconfont icon-bofang"></i>
            </div>
            <div class="${styles['video-loading']}">
                <i class="iconfont icon-jiazaizhong"></i>
            </div>
        `;
        if(typeof this.settings.elem === 'object'){
            this.settings.elem.appendChild(this.tempContainer);
        }else{
            document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
        }
        
    }

    handle(){
        let videoContent:HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`);
        let videoControl = this.tempContainer.querySelector(`.${styles['video-controls']}`);
        let videoPlay = this.tempContainer.querySelector(`.${styles['video-play']} i`);
        let videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`);
        let videoFull = this.tempContainer.querySelector(`.${styles['video-full']} i`);
        let videoProgressGeneral = this.tempContainer.querySelector(`.${styles['video-progress']}`);
        let videoProgress = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`);
        let videoVolume = this.tempContainer.querySelector(`.${styles['video-volume']} i`);
        let videoVolProgressGeneral = this.tempContainer.querySelector(`.${styles['video-volprogress']}`);
        let videoVolProgress = this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`);
        let videoBigPlay = this.tempContainer.querySelector(`.${styles['video-big-play']}`);
        let videoLoading = this.tempContainer.querySelector(`.${styles['video-loading']}`);
        let timer;

        videoContent.volume = 0.5;

        //点击视频区域播放/暂停
        videoContent.addEventListener('click', function(){
            if(this.paused){
                this.play();
            }else{
                this.pause();
            }
        })

        //点击大播放按钮播放
        videoBigPlay.addEventListener('click', function(){
            videoContent.play();
        })

        //鼠标移入视频区域时控件移入
        this.tempContainer.addEventListener('mouseenter', function(){
            videoControl.style.bottom = 0;
        });

        //鼠标移出视频区域时控件移出
        this.tempContainer.addEventListener('mouseleave', function(){
            videoControl.style.bottom = '-50px';
        })

        //监听视频文件加载前
        videoContent.addEventListener('loadstart', () => {
            videoLoading.style.display = "block";
            videoBigPlay.style.display = "none";
        })

        //监听视频文件等待缓冲中
        videoContent.addEventListener('waiting', () => {
            videoLoading.style.display = "block";
        })

        //监听视频可以播放状态
        videoContent.addEventListener('canplay', () => {
            videoLoading.style.display = "none";
            videoTimes[1].innerHTML = formatTime(videoContent.duration);
            if(this.settings.autoplay){
                timer = setInterval(playing, 1000);
                videoContent.play();
            }
        });

        //监听视频播放中
        videoContent.addEventListener('play', () => {
            videoPlay.className = 'iconfont icon-zanting';
            videoBigPlay.style.display = "none";
            timer = setInterval(playing, 1000);
        });

        //监听视频暂停中
        videoContent.addEventListener('pause', () => {
            videoPlay.className = 'iconfont icon-icon_play';
            videoBigPlay.style.display = "block";
            clearInterval(timer);
        });

        /*监听视频声音变化*/
        videoContent.addEventListener('volumechange', () => {
            if(videoContent.muted == true){
                videoContent.volume = 0;
                videoVolProgress[0].style.width = 0;
                videoVolProgress[1].style.left = 0;
            }else{
                let scale = videoContent.volume;
                videoVolProgress[0].style.width = scale * 100 + "%";
                videoVolProgress[1].style.left = scale * 100 + '%';
            }

            if(videoContent.volume == 0){
                videoVolume.className = 'iconfont icon-jingyin';
            }else{
                videoVolume.className = 'iconfont icon-shengyin';
            }
        })

        //点击控件里的播放按钮进行播放/暂停
        videoPlay.addEventListener('click', () => {
            if(videoContent.paused){
                videoContent.play();
            }else{
                videoContent.pause();
            }
        })

        //点击全屏按钮进入全屏状态
        videoFull.addEventListener('click', () => {
            videoContent.requestFullscreen();
        })

        //点击视频进度条
        videoProgressGeneral.addEventListener('click', function(ev: MouseEvent){
            let downX = ev.pageX;
            let downL = this.parentNode.parentNode.parentNode.parentNode.offsetLeft;
            let scale = (downX - downL) / this.offsetWidth;
            if(scale<0){
                scale = 0;
            }else if(scale > 1){
                scale = 1;
            }
            videoProgress[0].style.width = scale * 100 + "%";
            videoProgress[1].style.width = scale * 100 + "%";
            videoProgress[2].style.left = scale * 100 + '%';
            videoContent.currentTime = scale * videoContent.duration;
        })

        //拖动视频进度
        videoProgress[2].addEventListener('mousedown', function(ev: MouseEvent){
            let downX = ev.pageX;
            let downL = this.offsetLeft;
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
                if(scale<0){
                    scale = 0;
                }else if(scale > 1){
                    scale = 1;
                }
                videoProgress[0].style.width = scale * 100 + "%";
                videoProgress[1].style.width = scale * 100 + "%";
                this.style.left = scale * 100 + '%';
                videoContent.currentTime = scale * videoContent.duration;
            }
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }
            ev.preventDefault();
        })

        //点击声音按钮关闭声音
        videoVolume.addEventListener('click', function(){
            videoContent.volume = 0;
            videoVolProgress[0].style.width = 0;
            videoVolProgress[1].style.left = 0;
        })

        //点击声音进度条
        videoVolProgressGeneral.addEventListener('click', function(ev: MouseEvent){
            videoContent.muted = false;
            let downX = ev.pageX;
            let downL = this.offsetLeft;
            let popupL = this.parentNode.parentNode.parentNode.parentNode.parentNode.offsetLeft;
            let scale = (downX - downL - popupL) / this.offsetWidth;
            if(scale<0){
                scale = 0;
            }else if(scale > 1){
                scale = 1;
            }
            videoVolProgress[0].style.width = scale * 100 + "%";
            videoVolProgress[1].style.left = scale * 100 + '%';
            videoContent.volume = scale;
        })

        //拖动声音进度条
        videoVolProgress[1].addEventListener('mousedown', function(ev: MouseEvent){
            videoContent.muted = false;
            let downX = ev.pageX;
            let downL = this.offsetLeft;
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth;
                if(scale<0){
                    scale = 0;
                }else if(scale > 1){
                    scale = 1;
                }
                videoVolProgress[0].style.width = scale * 100 + "%";
                this.style.left = scale * 100 + '%';
                videoContent.volume = scale;
            }
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            }
            ev.preventDefault();
        })

        //按空格键进行播放/暂停
        document.onkeydown = (ev: KeyboardEvent) => {
            if(ev.keyCode == 32){
                if(videoContent.paused){
                    videoContent.play();
                }else{
                    videoContent.pause();
                }
            }
            ev.preventDefault();
        }

        function playing(){
            let scale = videoContent.currentTime / videoContent.duration;
            let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
            videoTimes[0].innerHTML = formatTime(videoContent.currentTime);
            videoProgress[0].style.width = scale * 100 + '%';
            videoProgress[1].style.width = scaleSuc * 100 + '%';
            videoProgress[2].style.left = scale * 100 + '%';
        }

        function formatTime(num: number): string{
            num = Math.round(num);
            let min = Math.floor(num/60);
            let sec = num%60;
            return setZero(min) + ':' + setZero(sec);
        }

        function setZero(num): string{
            if(num < 10){
                return '0' + num;
            }else{
                return '' + num;
            }
        }
    }
}

export default video;

