import "classic-equalizer";
import { parseBlob } from 'music-metadata';
import styles from './musicPlayer.scss';
import i18n from '../utils/lang.js';

await i18n.langLoaded();
class MusicPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.lang = i18n.translations;
    }

    connectedCallback() {
        this.render();
        this.init();
    }

    render() {
        /*html*/
        this.shadowRoot.innerHTML = `
            <div class="mplayer">
                <audio class="audio" src="./music/Agora.mp3" preload="metadata"></audio>
                <div class="top">
                    <div class="coverPlace">
                        <img alt="cover" class="cover">
                    </div>
                    <div class="title">
                        <span class="name">${this.lang.songName}</span>
                        <div class="subtitle">
                            <span class="album">${this.lang.songAlbum}</span>
                            <span class="artist">${this.lang.songArtist}</span>
                        </div>
                    </div>
                </div>
                <div class="equalizer">
                    <classic-equalizer></classic-equalizer>   
                </div>     
                <div class="mProgress">
                    <div class="progressBar">
                        <div class="progressBarFill"></div>
                    </div>
                    <span class="time">00:00</span>
                    <span class="duration">00:00</span>
                </div>
                <div class="controls">
                    <div class="playPause">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z" fill="#fff"/></svg>
                    </div>
                    <div class="pause" style="display:none;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M6 19h4V5H6zm8-14v14h4V5z" fill="#fff"/></svg>
                    </div>
                </div>
            </div>`;
        const style = document.createElement('style');
        style.textContent = styles;
        this.shadowRoot.appendChild(style);
    }

    init() {
        this.setupElements();
        this.setupEqualizer();
        this.setupEventListeners();
    }

    setupElements() {
        this.audio = this.shadowRoot.querySelector('.audio');
        this.playPauseButton = this.shadowRoot.querySelector('.playPause');
        this.pauseButton = this.shadowRoot.querySelector('.pause');
        this.progressBarFill = this.shadowRoot.querySelector('.progressBarFill');
        this.timeLabel = this.shadowRoot.querySelector('.time');
        this.durationLabel = this.shadowRoot.querySelector('.duration');
        this.cover = this.shadowRoot.querySelector('.cover');
        this.coverPlace = this.shadowRoot.querySelector('.coverPlace');
        this.titleName = this.shadowRoot.querySelector('.title .name');
        this.album = this.shadowRoot.querySelector('.title .album');
        this.artist = this.shadowRoot.querySelector('.title .artist');
        this.equalizer = this.shadowRoot.querySelector('classic-equalizer');
    }

    setupEventListeners() {
        this.playPauseButton.addEventListener('click', () => this.playAudio());
        this.pauseButton.addEventListener('click', () => this.pauseAudio());
        this.audio.addEventListener('loadedmetadata', () => this.loadMetadata());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.coverPlace.addEventListener('click', () => this.toggleCoverAndEqualizer());
    }

    setupEqualizer() {
        this.equalizer.audio = this.audio;
        this.equalizer.barsMarginX = 1;
        this.equalizer.setAttribute('height', 240);
        this.equalizer.setAttribute('rows', 10);
        this.equalizer.setAttribute('colors', JSON.stringify({
            "barBgColor": "#222222",
            "barColor": "white",
            "barColor2": "#bcbcbc",
            "barColor3": "red"
        }));
    }

    playAudio() {
        this.audio.play();
        this.playPauseButton.style.display = 'none';
        this.pauseButton.style.display = '';
    }

    pauseAudio() {
        this.audio.pause();
        this.playPauseButton.style.display = '';
        this.pauseButton.style.display = 'none';
    }

    async loadMetadata() {
        const duration = this.audio.duration;
        this.durationLabel.textContent = this.formatTime(duration);

        const metadata = await this.getAudioMetadata(this.audio);
        this.titleName.textContent = metadata.title || 'Unknown Title';
        this.album.textContent = metadata.album || 'Unknown Album';
        this.artist.textContent = metadata.artist || 'Unknown Artist';
        this.cover.src = metadata.cover || './imgs/cover.jpg';
    }

    updateProgress() {
        const currentTime = this.audio.currentTime;
        this.timeLabel.textContent = this.formatTime(currentTime);

        const progress = (currentTime / this.audio.duration) * 100;
        this.progressBarFill.style.width = `${progress}%`;
    }

    toggleCoverAndEqualizer() {
        const eqPlace = this.shadowRoot.querySelector('.equalizer');
        if (!this.coverPlace.querySelector('classic-equalizer')) {
            eqPlace.appendChild(this.cover);
            this.coverPlace.appendChild(this.equalizer);
            this.equalizer.setAttribute('height', 60);
        } else {
            eqPlace.appendChild(this.equalizer);
            this.coverPlace.appendChild(this.cover);
            this.equalizer.setAttribute('height', 240);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    async getAudioMetadata(audioElement) {
        const audioSrc = audioElement.src;
        if (!audioSrc) {
            console.error('Audio source not found');
            return null;
        }

        try {
            const response = await fetch(audioSrc);
            const blob = await response.blob();
            const metadata = await parseBlob(blob);
            const title = metadata.common.title;
            const album = metadata.common.album;
            const artist = metadata.common.artist;
            const picture = metadata.common.picture?.[0];
            const cover = picture ? URL.createObjectURL(new Blob([picture.data])) : '';

            return { title, album, artist, cover };
        } catch (error) {
            console.error('Error al obtener los metadatos del audio:', error);
            return null;
        }
    }
}

customElements.define('music-player', MusicPlayer);