import PCMPlayer from './PCMPlayer'
import ImagePlayer from './ImagePlayer'
import WebGLPlayer from './webglPlayer'

/**
 *  VideoPacket
 *  {
 *      data: Int16Array
 *      pts: number
 *  }
 *
 *  AudioPacket
 *  {
 *    data: Int16Array
 *    pts: number
 * }
 */

class Player {
    videoPlayer = null
    audioPlayer = null
    videoBuffer = []
    audioBuffer = []
    currentTime = 0
    mockPTS = 0

    msPerFrame = 40

    constructor(canvas) {
        this.videoPlayer = new WebGLPlayer(canvas)
        this.audioPlayer = new PCMPlayer({
            inputCodec: 'Int16',
            channels: 1,
            sampleRate: 16000,
            flushTime: 200,
        })
    }

    async read(buffer) {}

    async readAndMockPTS(buffer) {
        let audioData = new Int16Array(buffer, 0, 640)
        let audioDataCopy = new Int16Array(640)
        let imageData = new Uint8Array(buffer, 1280)
        audioDataCopy.set(audioData)

        this.videoBuffer.push({
            data: imageData,
            pts: this.mockPTS,
        })

        this.audioBuffer.push({
            data: audioDataCopy,
            pts: this.mockPTS,
        })

        console.log('video buffer', this.videoBuffer.length)
        console.log('audio buffer', this.audioBuffer.length)

        this.mockPTS += this.msPerFrame
    }

    async play() {
        this.currentTime = 0
        this.timer = setInterval(() => {
            // Check if there's a video packet that should be played now
            if (
                this.videoBuffer.length > 0 &&
                this.videoBuffer[0].pts <= this.currentTime
            ) {
                const videoPacket = this.videoBuffer.shift()
                this.videoPlayer.feed(videoPacket.data)
            }

            // Check if there's an audio packet that should be played now
            if (
                this.audioBuffer.length > 0 &&
                this.audioBuffer[0].pts <= this.currentTime
            ) {
                const audioPacket = this.audioBuffer.shift()
                this.audioPlayer.feed(audioPacket.data)
            }

            this.currentTime += this.msPerFrame
        }, 40)
    }

    async pause() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }
}

export default Player
