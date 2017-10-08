let gl2h = {
    /**
     * 
     * @param {WebGLRenderingContext} gl
     * @param {uint} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @param {String} source
     * @returns {WebGLShader|undefined}
     */
    createAndCompileShader:function createAndCompileShader(gl, type, source)
    {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success)
        {
            return shader;
        }
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    },

    /**
     * Creates the shaders and attaches them to program. Does not link them (in case
     * transform buffers or such need to be defined first)
     * @param {WebGLRenderingContext} gl
     * @param {String} vertShaderSource
     * @param {String} fragShaderSource
     * @returns {WebGLProgram}
     */
    createAndAttachProgram:function createAndAttachProgram(gl, vertShaderSource, fragShaderSource)
    {
        let prog  = gl.createProgram();
        gl.attachShader(prog, gl2h.createAndCompileShader(gl, gl.VERTEX_SHADER, vertShaderSource));
        gl.attachShader(prog, gl2h.createAndCompileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource));
        return prog;
    },

    /**
     * Creates gl, attaches programs and returns an array with WebGL context and
     * the program
     * @param {HTMLDocument} document
     * @param {String} vertShaderSource
     * @param {String} fragShaderSource
     * @returns {[WebGLRenderingContext, WebGLProgram]}
     */
    createCanvasAndGL:function createCanvasAndGL(document, vertShaderSource, fragShaderSource)
    {
        let canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        let gl = canvas.getContext('webgl2');
        if(!gl)
        {
            document.body.innerHTML = "Failed to initialize webgl2";
            return;
        }
        else
        {
            document.body.appendChild(canvas);
        }
        return [gl,gl2h.createAndAttachProgram(gl,vertShaderSource,fragShaderSource)];
    }
};