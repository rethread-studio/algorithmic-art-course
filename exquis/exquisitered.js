var s

function initred() {
    s = O_currentsection
}


function drawred() {
    var r=random()
    push()
    translate(s.x, s.y)
    if(r>0.42){
        fill(0,100,100)
        noStroke()
        quad(s.x1,s.y1,s.x2,s.y2,s.x3,s.y3,s.x4,s.y4)
    }
    else{
        fill(0,0,0)
        rect(0,0,O_sectionwidth,O_sectionheight)
    }
    if(O_counter%O_sectionduration==O_sectionduration-1){
        fill(0,100,100)
        noStroke()
        quad(s.x1,s.y1,s.x2,s.y2,s.x3,s.y3,s.x4,s.y4)
    }

    pop()
}
