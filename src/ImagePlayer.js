class ImagePlayer {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
    }

    feed(imageData) {
        const img = new Image()
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
        }
        img.src =
            'data:image/jpeg;base64,' +
            btoa(String.fromCharCode.apply(null, imageData))

        console.log('img.src', img.src)
    }
}

export default ImagePlayer
