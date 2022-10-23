const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

// Current tool settings
let p; // Processing object, accessible from anywhere
let color0 = [160, 100, 50];
let color1 = [320, 100, 50];
let brushSize = 1;

function startDrawing(p) {
  // Change if you want to start with a different background,
  // or even *no background!*
  p.background(0, 0, 50);
}

let brushes = [
  // Your brushes here!
  //======================================================
  {
    label: "🕳",
    isActive: true,
    description: "Eraser",
    draw() {
      console.log("draw")
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      if (p.mouseIsPressed) {
        // Another way to say p.stroke(color0[0], color0[1], color0[2]);
        p.stroke("grey");

        p.strokeWeight(brushSize * 50 + 4);
        p.line(x, y, x1, y1);
      }
    },
  },

  //======================================================
  //======================================================
  // Example brushes
  //======================================================
{
    label: "🐍",
    isActive: true,
    description:
      "Snake",

    setup() {
      //       Count how many times we've drawn
      this.drawCount = 0;
    },

    // Options: setup (when tool is selected), draw (every frame),
    draw() {
      //       Here I am keeping track of both the current time, and how many times this brush has drawn
      
      let t = p.millis() * 0.001; // Get the number of seconds
      this.drawCount += 1;
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;
      //       Controllable brush size
      let r =   10 + 10;

      //       Change the brush by how many we have drawn
      // r *= 0.5 + p.noise(this.drawCount * 0.1);
      //       Change the brush by the current time
      // r *= 0.5 + p.noise(t * 10);

      //       Shadow
      if (p.mouseIsPressed) {
        p.stroke(color1[0], color1[1], color1[2])
        p.strokeWeight(7)
        p.line(x, y + 20, x1, y1 + 20)
        p.line(x, y - 20, x1, y1 - 20)
        p.strokeWeight(2)
        p.line(x+20, y, x1+20, y1)
        p.line(x-20, y, x1-20, y1)
        
        
        p.stroke(...color0)
        p.strokeWeight(37)
        p.fill(...color0)
        p.line(x, y, x1, y1)
        p.strokeWeight(1)
        p.fill("grey")
        p.noStroke();
        
        
        if (x < x1){
          p.ellipse(x-12, y+1 , r - 10, r - 30)
          p.stroke("red")
          p.fill("white")
          p.triangle(x-10, y-8, x - 17, y-8, x-15, y)
          p.fill("black")
          p.noStroke()
          p.circle(x- 5, y - 10, 4)
          
        }
        else if (x1 < x){
          p.ellipse(x+12, y+1 , r - 10, r - 30)
          p.stroke("red")
          p.fill("white")
          p.triangle(x+9, y-8, x + 17, y-8, x+15, y)
          p.fill("black")
          p.noStroke()
          p.circle(x+ 5, y - 10, 4)
        }else{
          p.fill("black")
          p.circle(x-6, y-10, 4)
          p.circle(x+6, y-10, 4)
          p.ellipse(x, y+4 , r - 10, r - 30)
          p.fill("white")
          p.stroke("red")
          p.triangle(x+6, y-5, x + 3, y+8, x, y-6)
          p.triangle(x-6, y-5, x - 3, y+8, x, y-6)
        }
      
      }
      
      
      
    },
    
      
  },
  {
    label: "🐙",
    description: "colored lines extruding from brush with black ink",
    isActive: true,

    mouseDragged() {
      console.log("Drag...");
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      let size = 20;
      let count = 8;

      // Scale the cluster by how far we have moved since last frame
      // the "magnitude" of the (movedX, movedY) vector
      let distanceTravelled = p.mag(p.movedX, p.movedY);
      size = distanceTravelled * 2 + 10;

      // I often draw a shadow behind my brush,
      // it helps it stand out from the background
      p.noStroke();
      p.fill(0, 0, 0, 0.01);
      p.circle(x, y, size * 2);
      p.circle(x, y, size * 1);

      // Draw some emoji

      p.stroke(...color0)
      let r = size * Math.random();
      let f = Math.random() * 60 - 30
      p.strokeWeight(Math.random() * 10)
      let g = Math.random()
      if (Math.random() > .2) {
        // Offset a polar
        if (g > .5){
          //p.line(x ,y, x - r, y + f)
          p.beginShape()
          p.fill("black")
          p.bezier(x, y,p.width/2-(g* 150),p.height/2-(g* 150), (p.width)/2,(p.height)/2, x1, y1)
          //p.vertex(x, y)
          //p.bezierVertex((x + 1)*(Math.random() - .5)*10,10 *(y + 1)*(Math.random() - .5), (Math.random() - .5) * x,(Math.random() - .5)*y)
         // p.bezierVertex(-(x + f), -(y + f), -(Math.random() - .5) * (x + f + r),-(Math.random() - .5)* (y + f + r), p.width/2, p.height/2)
          p.endShape()
        }else{
          p.stroke(color1[0], color1[1], color1[2] * 1.4);
          p.fill("black")
          p.bezier(x, y,p.width/2 -(g* 150), p.height/2 - (g* 150), (p.width)/2,(p.height)/2, x1, y1)
        }
        
      }
      
      
      
    },
    
  },

  //======================================================
  
  {
    label: "💸",
    description:
      "Scatter brush, places lots of dots in both colors (discrete!)",
    isActive: true,
    
    setup() {
      // Store all the poitns this brush has made
      this.points = [];
    },

    mouseDragged() {
      // Every time we move
      // Add a new point to the beginning of this list
      let x = p.mouseX;
      let y = p.mouseY;
      let pt = [x, y];
      
      // How long does this dot live?
      pt.totalLifespan = 10;
      
      // Try a longer lifespan 😉
      // pt.totalLifespan = 10 + Math.random()*100;
      
      pt.lifespan = pt.totalLifespan
      this.points.push(pt);
      
    },
    draw(){
      let radius = 5
      let t = p.millis() * .001;
         
      
      this.points.forEach((pt, index) => {
        //
        pt.lifespan -= .2;

        if (pt.lifespan > 0) {
        
          let pctLife = pt.lifespan/pt.totalLifespan
          let prevLife = (pt.lifespan + .2)/pt.totalLifespan
          p.fill("grey")
          p.noStroke()
          p.circle(pt[0], pt[1]  / prevLife, 55)
         //p.background("grey")
          p.textSize(40);
          p.text("💸", pt[0], pt[1] / pctLife)
        }
      });
        
    }
  },

  //======================================================
 //======================================================
  {
    label: "S",
    isActive: true,
    description: "A continuous brush using curves",

    mousePressed() {
      //       We need to store the points
      this.points = [];
      // We can start storing a new set of points when the mouse is pressed
    },

    mouseDragged() {
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;
      // Add a new point to the beginning of this list
      this.points.unshift([x, y]);

      p.noFill();
     // p.stroke(color0[0], color0[1], color0[2] + 50 * Math.random(), 0.8);
      if (Math.random() > 0.5)
          p.stroke(color0[0], color0[1], color0[2] + 50 * Math.random(), 0.8);
        else p.stroke(color1[0], color1[1], color1[2] + 50 * Math.random(), 0.8);
      p.beginShape();

      // Take every...10th? point
      // What happens if you change this
      this.points
        .filter((pt, index) => index % 10 == 0)
        .forEach(([x, y]) => {
          let dx = Math.random()*100;
          let dy = Math.random()*10;

          //         What happens if we offset the x and y we are drawing?
            // dx = Math.random()*100
          // dy = Math.random()*10
            p.line(x, y, x1, y1)
            p.line(p.width - x, p.height - y, p.width - x1, p.height - y1)
          //p.curveVertex(x + dx, y + dy);
          //p.curveVertex(p.width - x + dx, p.height - y + dy);
        });

      p.endShape();
    },
  }, //============
];
