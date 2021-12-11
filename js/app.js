function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}

$(document).ready(function() {
    var currentCDN = 'https://cdn-zfzha--r753stream.nekokawaii.moe';
    $.ajax({
        url: currentCDN + '/meta.json',
        method: 'GET',
        cache: false,
        success: function(data) {
            var meta = JSON.parse(JSON.stringify(data));
            $('.player').html(`
            <div class="sec1">
                <div class="artwork">
                    <div class="overlay">Loading...</div>
                    <div class="inner"></div>
                </div>
                <div class="timeline">
                    <div class="progress"></div>
                </div>
                <div class="controls">
                    <div class="play-toggle">
                        <button class="playtg">
                            <i class="material-icons">play_arrow</i>
                        </button>
                    </div>
                    <div class="space"></div>
                    <div class="duration">
                        <div class="currentTime">00:00</div>
                        <span>/</span>
                        <div class="totalTime">00:00</div>
                    </div>
                </div>
            </div>
            <div class="sec2">
                <div class="TrackInfo">
                    <div class="items">
                        <span class="material-icons">toc</span>
                        <span class="title">` + meta.title + `</span>
                    </div>
                    <div class="items">
                        <span class="material-icons">album</span>
                        <span class="title">` + meta.album + `</span>
                    </div>
                    <div class="items">
                        <span class="material-icons">person</span>
                        <span class="title">` + meta.artist + `</span>
                    </div>
                    <div class="items">
                        <span class="material-icons">source</span>
                        <span class="title">` + meta.from + `</span>
                    </div>
                    <p class="lastUp">Last updated: ` + meta.lastUpdated + `</p>
                </div>
                
            </div>`);
            var audioPlayer = document.querySelector(".player");
            var audio = new Audio(currentCDN + '/' + meta.audio);
            $('.player .artwork .inner').css('background-image', 'url(' + currentCDN + '/' + meta.artwork + ')');
            var timeline = audioPlayer.querySelector(".timeline");
            $('.bg').css('background-image', 'url(' + currentCDN + '/' + meta.artwork + ')');
            timeline.addEventListener("click", e => {
                const timelineWidth = window.getComputedStyle(timeline).width;
                const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
                audio.currentTime = timeToSeek;
            }, false);

            audio.addEventListener(
                "loadeddata",
                () => {
                    $('.container .player .sec1 .artwork .overlay').addClass('hide');
                    $('.container .player .sec1 .controls').css('display', 'flex');
                    $('.container .player .sec1 .timeline').show();
                    $('.duration .totalTime').html(getTimeCodeFromNum(audio.duration));
                },
                false
            );

            setInterval(() => {
                $('.progress').css('width', audio.currentTime / audio.duration * 100 + "%");
                $('.duration .currentTime').html(getTimeCodeFromNum(audio.currentTime));
            }, 500);

            $('.controls .playtg').click(function() {
                if (audio.paused) {
                    document.querySelector(".controls .playtg .material-icons").innerHTML = "pause";
                    audio.play();
                } else {
                    document.querySelector(".controls .playtg .material-icons").innerHTML = "play_arrow";
                    audio.pause();
                }
            });

        }
    });
});