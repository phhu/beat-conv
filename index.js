const p5 = require('p5');


const sketchFunction = function(p) {
  let x = 100;
  let y = 100;

  p.setup = function() {
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x, y, p.mouseX, p.mouseY);
  };
};

const sketch = new p5(sketchFunction);
