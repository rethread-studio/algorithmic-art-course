class Particle {

    constructor() {
        this.position = createVector(random(w), random(h));
        this.speed = createVector(0, 0);//p5.Vector.random2D()//
        this.acceleration = createVector(0, 0)
        this.maxspeed = 4
    }

    update(){
        this.speed.add(this.acceleration)
        this.speed.limit(this.maxspeed)
        this.position.add(this.speed)
        this.acceleration.mult(0)
    }

    applyForce(force){
        this.acceleration.add(force)
    }

    follow(field){
        var x=Math.floor(this.position.x/density)
        var y=Math.floor(this.position.y/density)
        var index = x+y*nbcols
        var force = field[index]
        this.applyForce(force)
    }

    show(){
        //stroke(0,0,100,42)
        //strokeWeight(4)
        //point(this.position.x,this.position.y)
        fill(0,0,100,42)
        noStroke()
        ellipse(this.position.x,this.position.y,5,5)
    }

    edges(){
        if(this.position.x>w){this.position.x=0}
        if(this.position.x<0){this.position.x=w}
        if(this.position.y>h){this.position.y=0}
        if(this.position.y<0){this.position.y=h}
    }
}