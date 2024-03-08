import Player from './Player'

window.loadPCM = function loadPCM() {
    // 建立 WebSocket 连接

    const socket = new WebSocket('ws://nas.maituai.com:15888/ws')

    // 获取 Canvas 和音频播放器
    const canvas = document.getElementById('videoCanvas')

    const player = new Player(canvas)
    let playInterval

    console.log('loadPCM')
    socket.onmessage = function (event) {
        event.data.arrayBuffer().then((buffer) => {
            player.readAndMockPTS(buffer)
        })

        // delay 1s to play
        if (!playInterval) {
            playInterval = setTimeout(() => {
                console.log('play')
                player.play()
            }, 1000)
        }
    }
}
