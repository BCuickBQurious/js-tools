/* Simple script to perform GPU accelerated math
 * The values in the 'operands' array are simply multiplied by 2
 * 
 * Following benchmark tests, it would seem GPU 'acceleration' is faster only
 * when working with very large amounts of data (>1e7)
 */
let vertGLSL = `#version 300 es 
//using transform feedback. No need to set gl_position
in vec3 a_inputs;
out vec3 a_outputs; 
void main() {
  a_outputs = (a_inputs * 2.0);
}`;
let fragGLSL = `#version 300 es 
//does nothing
void main() {}`;
let [gl,prog] = gl2h.createCanvasAndGL(document,vertGLSL,fragGLSL);
gl.transformFeedbackVaryings(prog, ["a_outputs"], gl.SEPARATE_ATTRIBS);
gl.linkProgram(prog);
console.log(gl.getProgramInfoLog(prog));
gl.useProgram(prog);

let aPosLoc = gl.getAttribLocation(prog, "a_inputs");
gl.enableVertexAttribArray(aPosLoc);

/**
 * returns an array of all supplied values multiplied by 2
 * @param {Array|Float32Array} array length truncated to multiple of 3
 * @returns {Float32Array}
 */
function getDoubleOf(array)
{
    let operands;
    if(array instanceof Array)
    {
        operands = new Float32Array(array);
    }
    else if(array instanceof Float32Array)
    {
        operands = array;
    }
    else
    {
        throw new TypeError('Only works with Float32Array or Array');
    }
    //ABNTODO: fix memory leak, delete buffers, etc
    //let operands = new Float32Array([.1,.2,.3,.4,.5,.6]);
    let usableOperands = operands.length-(operands.length%3);
    let bufA = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufA);
    gl.bufferData(gl.ARRAY_BUFFER, operands, gl.DYNAMIC_COPY);

    let bufB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufB);
    gl.bufferData(gl.ARRAY_BUFFER, usableOperands*4, gl.DYNAMIC_COPY);

    let transformFeedback = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufA);
    gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, bufB);

    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, Math.floor(usableOperands/3));
    gl.endTransformFeedback();
    gl.flush();
    let bufSize = gl.getBufferParameter(gl.TRANSFORM_FEEDBACK_BUFFER,gl.BUFFER_SIZE);
    let readBack = new Float32Array(bufSize/4);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindBuffer(gl.ARRAY_BUFFER,bufB);
    gl.getBufferSubData(gl.ARRAY_BUFFER,0,readBack,0,bufSize/4);
    return readBack;
}
/**
 * Start benchmark test of GL vs traditional (for-loop) computation. Results are
 * logged to console
 * @param {Number} size
 * @returns {undefined}
 */
function startBenchmark(size)
{
    let data=new Float32Array(size);
    for(let i=size;i>=0;i--)
    {
        data[i]=Math.random();
    }
    let start;
    let time;
    
    start=performance.now();
    getDoubleOf(data);
    time =performance.now()-start;
    console.log('time taken by GL:',time);
    
    start=performance.now();
    //would be fairer to include time taken to allocate memory
    let result=new Float32Array(size);
    for(let i=size;i>=0;i--)
    {
        result[i]=data[i]*2;
    }
    time =performance.now()-start;
    console.log('time taken other:',time);
}