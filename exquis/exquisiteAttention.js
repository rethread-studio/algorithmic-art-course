(() => {
  let s,p,mp;

  async function init() {
    s = O_currentsection;
    colorMode(HSB)
  }

  function draw() {
    
    push();
    translate(s.x, s.y);

    stroke(0, 0, 100);
    fill(0,0,0,100)
    rect(0, 0, O_sectionwidth, O_sectionheight);

    p = [[s.x1,s.y1],
         [s.x2,s.y2],
         [s.x3,s.y3],
         [s.x4,s.y4]]
    mp = []

    let color_index = 160 
    for(var iter=0; iter< 12; iter++){
      make(p,mp)
      for(var i=0;i<4;i++){
        fill(random(360),100,75)
          bezier(p[i%4][0],p[i%4][1],
                 p[i][0]+r(),p[i][1]+r(),
                 p[(i+1)%4][0]+r(),mp[(i+1)%4][1]+r(),
                 p[(i+1)%4][0],p[(i+1)%4][1])
      }
            
    color_index +=20    
    update(p,mp)

    }
    pop();
  }
  window.exquisiteAttention = { init, draw };
})();

function mid(p1,p2){ return [(p1[0]+p2[0])/2,(p1[1]+p2[1])/2] }

function make(p,mp){
  for(var i=0;i<4;i++){
    mp[i] = mid(p[i],p[(i+1)%4])
  }
}

function update(p,mp){
  for(var i=0;i<4;i++){
    p[i] = mp[i]
  }
}

function r(){
  return random(-40,40)
}