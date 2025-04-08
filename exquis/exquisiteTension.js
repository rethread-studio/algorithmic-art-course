(() => {
  let s,cx,cy,x,y,dx,dy,color;

  async function init() {
    s = O_currentsection;
    let w5 = O_sectionwidth/5
    let h3 = O_sectionheight/3
    cx = random(w5,4*w5)
    cy = random(h3,2*h3)
    x = [s.x1,s.x2,s.x3,s.x4]
    y = [s.y1,s.y2,s.y3,s.y4]
    dx = [[-50,50],[0,0],[-50,50],[0,0]]
    dy = [[0,0],[-50,50],[0,0],[-50,50]]
    color="white"
  }

  function r(a,b){return random(a,b)}

  function draw() {
    push();
    translate(s.x, s.y);

    stroke(0, 0, 100);
    fill(0,0,0,100)
    rect(0, 0, O_sectionwidth, O_sectionheight);

    cx+=random(-5,5)
    if (cx < 0 ){cx += O_sectionwidth/20}
    if (cx > O_sectionwidth){ cx -= O_sectionwidth/20}
    cy+=random(-3,3)
    if (cy < 0 ){cx += O_sectionheight/20}
    if (cy > O_sectionheight){ cx -= O_sectionheight/20}

    for(var i=0; i<4;i++){
      if(random()>0.95){
        color="yellow"
      }
      stroke(color)
      strokeWeight(O_sectionheight/100)
      bezier(x[i],y[i],x[i]+r(dx[i]),y[i]+r(dy[i]),cx+r(dx[i]),cy+r(dy[i]),cx,cy)
      color="white"
    }

    pop();
  }
  window.exquisiteTension = { init, draw };
})();
