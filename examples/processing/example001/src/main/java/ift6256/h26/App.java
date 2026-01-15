package ift6256.h26;

import java.util.Random;

import processing.core.PApplet;

/**
 * Hello world!
 */
public class App extends PApplet{
    int w = 1000;
    int h = 1000;
    int[] palette = { 260, 340, 200};
    float x1;
    float y1;
    float x2;
    float y2;
    Random rand;
    int color;

    @Override
    public void settings() {
        size(w, h);
    }

    @Override
    public void setup() {
        colorMode(HSB, 360, 100, 100);
        rand = new Random();
        frameRate(1);
    }

    @Override
    public void draw() {
        background(230, 80, 40);
        noStroke();
        int step = 28;
        for (float x = 0; x < w; x = x + w / step) {
            for (float y = 0; y < h; y = y + h / step) {
                int john = (int) random(4);
                switch (john) {
                    case 1:
                        tri1(x,y,x+w/step,y+h/step);
                        break;
                    case 2:
                        tri2(x,y,x+w/step,y+h/step);
                        break;
                    case 3:
                        tri3(x,y,x+w/step,y+h/step);
                        break;
                    case 4:
                        tri4(x,y,x+w/step,y+h/step);
                        break;
                    case 5:
                        moon1(x,y,x+w/step,y+h/step);
                        break;
                    case 6:
                        moon2(x,y,x+w/step,y+h/step);
                        break;
                    case 7:
                        cell1(x,y,x+w/step,y+h/step);
                        break;
                    case 0:
                        cell2(x,y,x+w/step,y+h/step);
                        break;
                }
            }
        }
        noLoop();
        save("OddJob004.png");
    }

    public void tri1(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        triangle(x1,y1,x2,y1,x1,y2);
    }

    public void tri2(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        triangle(x1,y1,x2,y2,x1,y2);
    }

    public void tri3(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        triangle(x1,y2,x2,y1,x2,y2);
    }

    public void tri4(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        triangle(x1,y1,x2,y1,x2,y2);
    }

    public void moon1(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        arc(x1,y1+((y2-y1)/2),x2-x1,y2-y1,-HALF_PI,HALF_PI,PIE);
    }

    public void moon2(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        arc(x2,y1+((y2-y1)/2),x2-x1,y2-y1,HALF_PI,PI+HALF_PI,PIE);
    }

    public void cell1(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);        
        //rect(x1,y1,x2-x1,y2-y1);
        quad(x1,y1,x2,y1,x2,y2,x1,y2);
    }

    public void cell2(float x1, float y1, float x2, float y2) {
        color = (int) random(palette.length);
        fill(palette[color], 80, 80);
        ellipse(x1+((x2-x1)/2),y1+((y2-y1)/2),(x2-x1),(y2-y1));
    }

    public static void main(String[] args) {
        String[] processingArgs = { "Example 001" };
        App mySketch = new App();
        PApplet.runSketch(processingArgs, mySketch);

        System.out.println("Hello World!");
    }
}
