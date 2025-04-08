class CodeFile {
    constructor(code, y) {
        this.x = w
        this.y = y
        this.code = code
        this.vitesse = 1//Math.floor(random(1, 7))
        this.counter = 0
        this.boutdecode = []
        this.index = 0
    }

    bouge() {
        if (this.counter % this.vitesse == 0) {
            push();
            noStroke(); 
            fill(0, 0, 0); 
            rect(0, this.y - fSize * 0.8, w, fSize); pop()
            this.boutdecode += this.code[this.index]
            var tw = textWidth(this.boutdecode)
            // if boutdecode's length is less than canvas width, continue shifting left
            // else x does not change and remove first character of boutdecode to keep fit in width
            if (this.x > 0) {
                this.x = w - tw
            }
            else {
                this.boutdecode = this.boutdecode.substring(1)
            }
            text(this.boutdecode, this.x, this.y)
            this.index++
            //console.log(this.boutdecode.length)
        }
        this.counter++
    }

    ecris() {
        return this.x + " " + this.y + " " + this.vitesse + " "
    }
}