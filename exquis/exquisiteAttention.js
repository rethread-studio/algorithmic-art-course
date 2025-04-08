(() => {
  let s,c,w,h,inc;
  let p = []
  let cols = []

  async function init() {
    s = O_currentsection;
    c = [Math.max(s.x1,s.x3)/2+Math.min(s.x1,s.x3)/2,
         Math.max(s.y2,s.y4)/2+Math.min(s.y2,s.y4)/2]
    p = [[c[0],c[1]],
         [c[0],c[1]],
         [c[0],c[1]],
         [c[0],c[1]]];
    inc = 3
    h = O_sectionheight;
    w = O_sectionwidth;
    cols =[[0, 96, 78],"white"]
  }

  function r(){return random(cols)}

  function draw() {
    
    push();
    translate(s.x, s.y);

    stroke(0, 0, 100);
    noFill()
    rect(0, 0, w, h);

    fill(r())
    quad(0,0,0,s.y4,p[0][0],p[0][1],s.x1,0)
    fill(r())
    quad(0,h,0,s.y4,p[1][0],p[1][1],s.x3,h)
    fill(r())
    quad(p[2][0],p[2][1],s.x1,0,w,0,w,s.y2)
    fill(r())
    quad(w,s.y2,w,h,s.x3,h,p[3][0],p[3][1])
    
    p[0][0] = Math.max(p[0][0]-2*inc,0)
    p[0][1] = Math.max(p[0][1]-inc,0)
    p[1][0] = Math.max(p[1][0]-2*inc,0)
    p[1][1] = Math.min(p[1][1]+inc,h)
    p[2][0] = Math.min(p[2][0]+2*inc,w)
    p[2][1] = Math.max(p[2][1]-inc,0)
    p[3][0] = Math.min(p[3][0]+2*inc,w)
    p[3][1] = Math.min(p[3][1]+inc,h)

    pop();
  }
  window.exquisiteAttention = { init, draw };
})();

