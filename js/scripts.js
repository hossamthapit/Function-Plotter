const blackColor = "rgb(128,128,128)", redColor = "rgb(255,0,0)";
const darwingStep = .2;

// just a debuging function
function init(){
    return ;
    document.getElementById("expression").value = "x^2";

    document.getElementById("xMin").value = -5;
    document.getElementById("xMax").value = 10;
}

function evalExpression(to){

    let expressionInput = document.getElementById("expression");
    // replace all x,X with (value of passed parameters to the function) in the function entered by the user
    let expression = expressionInput.value.replace(/x/gi,"("+to+")"); 

    //replace ^ with ** in the function to be acceptable when using the eval js function
    expression = expression.replace("^","**");

    // check if the eval function could successfully evaluated the expression
    try{
        return eval(expression);
    }
    catch{
        return null;
    }
}

// function that take 2 input min , max and return true in case min is less than max otherwise it return false
function validMaxMin(min , max){
    try{
        let _min = parseInt(min),_max = parseInt(max);
       return _min < _max; 
    }
    catch{
        return false;
    }
}


function showCanvasDimensions(maxX,maxY){
    // show the canvas dimensions to the user
    document.getElementById("dimensions").innerText = "Grid width " + maxX * 2 + " Grid Height " + Math.ceil(maxY)*2;
}

function scaleAllPoints(points , axes){
    
    // scale all the points according to the canvas width and height
    for(let i = 0 ; i < points.length ;i++){
        points[i].x = points[i].x * axes.xScale + axes.x0;
        points[i].y = -points[i].y * axes.yScale + axes.y0;
    }
}

function drawPoints(points, ctx, color, lineWidth){
    // draw line between every two consective points
    for(let i = 1 ; i < points.length ; i++)
        drawLine({x:points[i-1].x,y:points[i-1].y},{x:points[i].x,y:points[i].y},ctx,color,lineWidth); 
}


function calculatePoints(){

    let xMin = parseInt(document.getElementById("xMin").value) ;
    let xMax = parseInt(document.getElementById("xMax").value) ;

    if(!validMaxMin(xMin,xMax)){
        alert("Enter a valid min and max for the function parameter");
        return ;
    }

    let points = [] , maxX = Math.max(Math.abs(xMin),Math.abs(xMax)) , maxY = 0; 

    for (let i = parseInt(xMin) , idx = 0 ; i <= xMax ; i+=darwingStep) {
    
        // store the points in array to draw them later
        let xValue = i , yValue = evalExpression(i);
        if(yValue == null){
            alert("Enter a valid function");
            return ;
        } 

        points[idx++] = {x:xValue , y:yValue};
        
        //save max value for y to use it later in scaling
        maxY = Math.max(maxY,Math.abs(yValue));
    }
    return {points,maxX,maxY};
}

function initAxes() {
    
    let axes = {}, canvas =document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    
    // calculate middle point in canvas to draw points relative to it
    axes.x0 = .5*canvas.width;
    axes.y0 = .5*canvas.height;
    
    let width = ctx.canvas.width, height = ctx.canvas.height;
    
    drawLine({x:0,y:axes.y0},{x:width,y:axes.y0},ctx,blackColor,1); // draw x axis
    drawLine({x:axes.x0,y:0},{x:axes.x0,y:height},ctx,blackColor,1); // draw y axis
}

function drawLine(from , to ,ctx , color , lineWidth){
    
    ctx.beginPath();
    
    ctx.strokeStyle = color; // select black color to draw the axis 
    ctx.lineWidth = lineWidth; 
    
    ctx.moveTo(from.x,from.y); 
    ctx.lineTo(to.x,to.y); 
    
    ctx.stroke();
}


function prepareCanvasForDraw(ctx,canvas){
    ctx.clearRect(0, 0, canvas.width, canvas.height); // to clear the board after every function is drawn
    initAxes(); // initiate the axies 
}


function startDraw() {

    let canvas =document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    // clear the canvas for a new function
    prepareCanvasForDraw(ctx,canvas);
    
    // calculate the points to draw the function
    let {points,maxX,maxY} = calculatePoints();

    // minus 10 to keep a space like a margin in the canvas
    let width = ctx.canvas.width / 2 - 10, height = ctx.canvas.height / 2 -10;

    // calculate best scale for the points to keep them inside the canvas area
    let axes = {}; 
    axes.xScale = (width/maxX) ;
    axes.yScale = (height/maxY);
    axes.x0 = canvas.width / 2;
    axes.y0 = canvas.height / 2;

    // show the canvas dimensions to the user
    showCanvasDimensions(maxX,maxY);

    // scale all the points according to the canvas width and height
    scaleAllPoints(points,axes);

    // draw line between every two consective points
    drawPoints(points,ctx,redColor,1);

}
