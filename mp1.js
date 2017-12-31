/*
mp1 javascript file
Name: Victory Dance
*/
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;

// Create a place to store vertex colors
var vertexColorBuffer;

var mvMatrix = mat4.create();
var rotAngle = 0;
var lastTime = 0;


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}
/*
initialize shaders
*/
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  
}

/*
initial buffers
*/
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  var colors = [
        //blue part
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue1

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue2

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue3

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue4

	    0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue5

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue6

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue7

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue8

        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue9

	    0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,
        0.0, 0.2, 0.4, 1.0,// blue10
        
        
        //orange part
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange1
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange2
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange3
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange4
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange5
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange6
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange7
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange8
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange9
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange10
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange11
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange12
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange13
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange14
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange15
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange16
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange17
        
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,
        0.8, 0.1, 0.1, 1.0,//orange18
        
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 84;  
}

function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  mat4.identity(mvMatrix);
  
  //Rotate by Y
  mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle)); 
  //Rotate by Z
  mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle)); 
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

/*
animation function
change the coordinate of the orange part
*/
var sinscalar = 0;
function animate() {
    sinscalar += 0.1;// change the parameter of sin and cos
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;    
        rotAngle= (rotAngle + 0.5) % 720;// change the rotation angle 
    }
    lastTime = timeNow;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var triangleVertices = [
          //blue part(does not change)
          -0.8,  0.75,  0.0,
          0.8,  0.75,  0.0,
          -0.8,  0.95,  0.0, //blue1

          0.8,  0.75,  0.0,
          0.8,  0.95,  0.0,
          -0.8,  0.95,  0.0, //blue2

          -0.6,  0.75,  0.0,
          -0.6,  -0.2,  0.0,
          -0.3,  -0.2,  0.0,  //blue3

          -0.6,  0.75,  0.0,
          -0.3,  0.75,  0.0,
          -0.3,  -0.2,  0.0, //blue4

          0.3,  0.75,  0.0,
          0.3, -0.2,  0.0,
          0.6, -0.2,   0.0, //blue5

          0.3,  0.75,  0.0,
          0.6, -0.2,  0.0,
          0.6, 0.75,   0.0, //blue6
          
          -0.3,  0.1,  0.0,
          -0.3,  0.5,  0.0,
          -0.2, 0.1,   0.0, //blue7
          
           -0.3,  0.5,  0.0,
          -0.2,  0.5,  0.0,
          -0.2, 0.1,   0.0, //blue8
          
          0.2,  0.1, 0.0,
          0.4,  0.1,  0.0,
          0.2, 0.5,  0.0, //blue9
          
          0.4,  0.1,  0.0,
          0.4,  0.5,  0.0,
          0.2, 0.5,  0.0,//blue10
          
          
          //orange part
          -0.6,  -0.4 + Math.sin(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
          -0.5,  -0.4 + Math.sin(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
          -0.5,  -0.5 + Math.sin(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0, // orange1
          
          -0.6,  -0.4 + Math.sin(sinscalar)*0.05,  0.0,
          -0.5,  -0.4 + Math.sin(sinscalar)*0.05,  0.0,
          -0.6,  -0.3 + Math.sin(sinscalar)*0.05,  0.0, // orange2
          
          -0.6,  -0.3 + Math.sin(sinscalar)*0.05,  0.0,
          -0.5,  -0.3 + Math.sin(sinscalar)*0.05,  0.0,
          -0.5,  -0.4 + Math.sin(sinscalar)*0.05,  0.0, // orange3
          
          -0.4,  -0.6 + Math.cos(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
          -0.3,  -0.6 + Math.cos(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
          -0.3,  -0.7 + Math.cos(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0, // orange4
          
          -0.4,  -0.6 + Math.cos(sinscalar)*0.05,  0.0,
          -0.3,  -0.6 + Math.cos(sinscalar)*0.05,  0.0,
          -0.4,  -0.3 + Math.cos(sinscalar)*0.05,  0.0, // orange5
          
          -0.3,  -0.6 + Math.cos(sinscalar)*0.05,  0.0,
          -0.3,  -0.3 + Math.cos(sinscalar)*0.05,  0.0,
          -0.4,  -0.3 + Math.cos(sinscalar)*0.05,  0.0, // orange6
          
          -0.2,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05+(0.02 * Math.random() - 0.01),  0.0,
          -0.1,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05+(0.02 * Math.random() - 0.01),  0.0,
          -0.1,  -0.9 + Math.sin(sinscalar)*0.10 + 0.05+(0.02 * Math.random() - 0.01),  0.0, // orange7
          
          -0.2,  -0.3 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
          -0.2,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
          -0.1,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05,  0.0, // orange8
          
          -0.2,  -0.3 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
          -0.1,  -0.3 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
          -0.1,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05,  0.0, // orange9
          
           0.6,  -0.4 + Math.sin(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
           0.5,  -0.4 + Math.sin(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
           0.5,  -0.5 + Math.sin(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0, // orange10
           
           0.6,  -0.4 + Math.sin(sinscalar)*0.05,  0.0,
           0.6,  -0.3 + Math.sin(sinscalar)*0.05,  0.0,
           0.5,  -0.4 + Math.sin(sinscalar)*0.05,  0.0, // orange11
           
           0.6,  -0.3 + Math.sin(sinscalar)*0.05,  0.0,
           0.5,  -0.3 + Math.sin(sinscalar)*0.05,  0.0,
           0.5,  -0.4 + Math.sin(sinscalar)*0.05,  0.0, // orange12
           
           0.4,  -0.6 + Math.cos(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
           0.3,  -0.6 + Math.cos(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0,
           0.3,  -0.7 + Math.cos(sinscalar)*0.05+(0.02 * Math.random() - 0.01),  0.0, // orange13
           
           0.4,  -0.6 + Math.cos(sinscalar)*0.05,  0.0,
           0.4,  -0.3 + Math.cos(sinscalar)*0.05,  0.0,
           0.3,  -0.6 + Math.cos(sinscalar)*0.05,  0.0, // orange14
           
           0.3,  -0.6 + Math.cos(sinscalar)*0.05,  0.0,
           0.4,  -0.3 + Math.cos(sinscalar)*0.05,  0.0,
           0.3,  -0.3 + Math.cos(sinscalar)*0.05,  0.0, // orange15
           
           0.2,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05+(0.02 * Math.random() - 0.01),  0.0,
           0.1,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05+(0.02 * Math.random() - 0.01),  0.0,
           0.1,  -0.9 + Math.sin(sinscalar)*0.10 + 0.05+(0.02 * Math.random() - 0.01),  0.0, // orange16
           
           0.2,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
           0.1,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
           0.2,  -0.3 + Math.sin(sinscalar)*0.10 + 0.05,  0.0, // orange17
           
           0.2,  -0.3 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
           0.1,  -0.3 + Math.sin(sinscalar)*0.10 + 0.05,  0.0,
           0.1,  -0.8 + Math.sin(sinscalar)*0.10 + 0.05,  0.0, // orange18
           
          
  ];
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 84;
}

/*
Initialization
*/
function startup() {
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  setupBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

function tick() {
    requestAnimFrame(tick);
    draw();
    animate();
}

