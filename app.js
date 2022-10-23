/**
 * Starter code
 * Create N swatches
 * Each swatch has code for when it starts and each frame after
 */

window.addEventListener("load", function () {
  console.log("LOADED");

  let activeTool = undefined;
  // Create a P5 canvas element, JS-style
  // https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
  const s = (p) => {
    p.setup = function () {
      p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
      p.colorMode(p.HSL, 360, 100, 100);
      p.ellipseMode(p.RADIUS);
      
      startDrawing(p)
    };

    p.mouseDragged = function () {
      if (activeTool.mouseDragged) activeTool.mouseDragged();
    };

    p.mousePressed = function () {
        if (activeTool.mousePressed) activeTool.mousePressed();
    
    };

    p.mouseReleased = function () {
        if (activeTool.mouseReleased) activeTool.mouseReleased();
    
    };

    p.draw = function () {
      if (activeTool.draw) activeTool.draw();
    };
  };

  function setBrush(index) {
    let brush = brushes[index];
    const DESC_EL = document.getElementById("brush-desc");
    DESC_EL.innerHTML = brush.label + " - " + brush.description;
    activeTool = brush;
    if (activeTool.setup) {
      activeTool.setup();
    }

    //     Record the last active brush
    localStorage.setItem("lastbrush", index);
    console.log("Set active tool to ", brush.label, brush.description);
  }

  const CANVAS_EL = document.getElementById("canvas-holder");
  CANVAS_EL.style.width = CANVAS_WIDTH + "px";
  CANVAS_EL.style.height = CANVAS_HEIGHT + "px";

  p = new p5(s, CANVAS_EL);

  const BUTTON_HOLDER_EL = document.getElementById("buttons");

  //   Set the initial brush and color values
  setBrush(localStorage.getItem("lastbrush") || 0);
  const COLOR0_EL = document.getElementById("color0");
  const COLOR1_EL = document.getElementById("color1");
  const SLIDER0_EL = document.getElementById("size");
  COLOR0_EL.value = HSLToHex(...color0);
  COLOR1_EL.value = HSLToHex(...color1);
  SLIDER0_EL.value = brushSize;

  //   Listen to the "change" events from the color pickers and sliders
  COLOR0_EL.addEventListener("change", function () {
    color0 = hexToHSL(this.value);
    console.log("Change color0", this.value, color0);
  });
  COLOR1_EL.addEventListener("change", function () {
    color1 = hexToHSL(this.value);
    console.log("Change color1", this.value, color1);
  });
  SLIDER0_EL.addEventListener("change", function () {
    console.log("Change size", this.value, SLIDER0_EL);
    brushSize = this.value
  });

  brushes.filter(b=>b.isActive).forEach((brush, index) => {
    let button = document.createElement("button");
    button.innerHTML = brush.label;

    BUTTON_HOLDER_EL.appendChild(button);

    button.addEventListener("click", () => {
      setBrush(index);
    });
  });
});

//=========================================
// Utility functions
// Given a processing object, a pct around the circle, a radius, and an offset (optional)
function getLoopingNoise({ p, loopPct, radius, offset = 0 }) {
  // This number should go from 0 to 1 every loopLength seconds
  // And PI*2 radians every loopLength seconds

  let theta = 2 * Math.PI * loopPct;

  // Place to sample the noise from
  let x = radius * Math.cos(theta);
  let y = radius * Math.sin(theta);

  let noiseVal = p.noise(x + 100, y + 30, offset);

  return noiseVal;
}

// Hex to HSLA conversion adapted from
// https://css-tricks.com/converting-color-spaces-in-javascript/
// But now it resutn
function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}
