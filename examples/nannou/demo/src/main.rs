use nannou::prelude::*;
use nannou::color::*;
use nannou::rand::random_range;

const framewid : f32 = 2000.0;
const framehei : f32 = 1000.0;

fn main() {
    nannou::app(model)
        .update(update)
        .view(view)
        .run();
}

struct Particle {
    rad:f32,
    cx:f32,
    cy:f32,
    direction:f32,
    speed:f32
}

struct Model {
    field: Vec<Particle>,
    count:i32
}
fn model(app: &App) -> Model {
    app.new_window().size(framewid as u32, framehei as u32).build().unwrap();
    let mut field = Vec::new();
    let mut speed: f32;
    let mut radius: f32;
    let mut direction: f32;
    for _i in 0..1000 {
        speed  = random_range(0.01,0.02);
        radius = random_range(0.5,9.9);
        direction = random_range(0.0,360.0);
        field.push(
            Particle{
                rad:radius,
                cx:0.0,
                cy:0.0,
                direction:direction,
                speed:speed
            }
        )
    }
    Model {
        field:field,
        count: 0,
    }
}

fn update(app: &App, model: &mut Model, _update: Update) {
    let mut d : f32;
    let mut i : usize;
    if model.field.len()>0{
        i = model.field.len();
        //select the right-most index for the field, and grow as time passes
        if model.count<(model.field.len()  as i32) {i=(model.count*2) as usize}
        if i > model.field.len(){i=model.field.len()}
        //move the particles up until the index that has been selected before
        for n in 0..i{
            let p = &mut model.field[n];
            if p.direction>135.0 && p.direction<225.0 {d=2.0*p.speed}
            else{d=p.speed}
            p.cx=p.cx+d*p.direction.to_radians().cos();
            p.cy=p.cy+d*p.direction.to_radians().sin();
            p.speed=p.speed*random_range(1.0,1.1);
    }
        //remove the particles that have moved outside the window
        cleanmodel(app,model);
    }
    model.count+=1;
}

fn cleanmodel(app: &App, model: &mut Model) {
    let mut i =0;
    while i < model.field.len(){
        let p = &model.field[i];
        if p.cx < -framewid/2.0 || p.cx > framewid/2.0 && p.cy < -framehei/2.0 || p.cy > framehei/2.0{
            let val = model.field.remove(i);
        }
        else{i+=1}
    }
}

fn view(app: &App, model: &Model, frame: Frame){

    let draw = app.draw();
    draw.background().color(BLACK);
    for p in &model.field{
        draw.ellipse()
        .color(WHITE)
        .w(p.rad)
        .h(p.rad)
        .x_y(p.cx,p.cy);
        }
    if model.field.len()==0{
    draw.rect()
        .color(hsla((230.0 / 360.0),1.0,0.5,random_range(0.3,0.9)))//360.0/x.abs()   ,random_range(0.3,0.9)
        .w(framewid*0.6)
        .h(framehei*0.6)
        .x_y(0.0,0.0);
    }
    draw.to_frame(app, &frame).unwrap();
}