
var speed = [47.87,35.02,29.78,24.077,13.07,9.69,6.81,5.43,4.75];
var angle = new Array(speed.length); //0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4
var Ballsize  =[4879,12104,12756,6792,139822,120536,51118,49528,2301];
var colors;
var dists = [57.9,108.2,149.6,227.9,778.6,1433.5,2872.5,4495.1,5906.4];
var Wwidth = 0;
var Wheight = 0;
var centerX = 0;
var centerY = 0;    
var prop = 0;

var tailLength =80;
var xs = new Array(angle.length);
var ys = new Array(angle.length);
var easing=0.6;  

var i = 0,j=0;
function setup(){
    smooth();
    createCanvas(window.innerWidth,window.innerHeight);
    centerY = int(window.innerHeight/2);
    centerX = int(window.innerWidth/2);
    console.log(window.innerWidth,window.innerHeight);
    ellipseMode(CENTER);
    
    colors = [color(245,214,120),color(251,131,122),color(37,193,128),        color(226,98,123),color(217,164,103),color(249,206,68),      color(65,176,178),color(98,125,180),color(64,78,163)
             ];
    for ( i = 0; i < angle.length; i++) {
        xs[i] = new Array(tailLength);
        ys[i] = new Array(tailLength);
    }
    
    //random angle
    for( i=0;i<angle.length;i++){
        angle[i]=2*Math.PI/(Math.random()%9+1);
        
    }
    //calc speed v=sqrt( GM/r )
    for( i=0;i<speed.length;i++){
        speed[i]=(Math.sqrt(274.13*speed[i]/Ballsize[i])*200)/1e4;  //200 is for divided by 2 
        // then times 100
    }

    //size
    for (i=0;i<Ballsize.length;i++){
        if(Ballsize[i]>12756){
            Ballsize[i]/=7*window.innerHeight;
        }else{
            if(Ballsize[i]/2000<5){
                Ballsize[i]/=6*window.innerHeight;
                Ballsize[i]+=2;
            }else{
                Ballsize[i]/=2*window.innerHeight;
            }
        }
        Ballsize[i]=Math.ceil(Ballsize[i]);
    }
    //dists
    var avge=0;
    var pre =dists[0];
    for(var p = 0;p<dists.length;p++){
        avge+=dists[p];
    }
    
    avge/=dists.length;
    var distavg=dists[0];
    var mintemp=Math.abs(avge-dists[0]);
    
    for(var p = 0;p<dists.length;p++){
        if(Math.abs(avge-dists[p])<mintemp){
            mintemp=avge-dists[p];
            distavg=dists[p];
            console.log(" pos: "+p);
        }
    }
    console.log("avg: "+avge+ " distavg:"+distavg);
    var maxvalue=0;
    for (i=0;i<dists.length;i++){
        if (dists[i]>maxvalue){
            maxvalue=dists[i];
        }
    }
    for (i=1;i<dists.length;i++){
        var perst = Math.abs(window.innerHeight-dists[i])/((window.innerHeight+dists[i])/2);
        if(dists[i]>distavg){
           dists[i] /= window.innerHeight;
            dists[i]+=dists[i-1]*perst;
            while(dists[i]>window.innerHeight){
                dists[i]-=Ballsize[i];
            }
            dists[i]+=Ballsize[i];
            
        }
        else if(dists[i]==distavg){
            dists[i]=dists[i-1];
            dists[i]+=2*Ballsize[i];
            console.log(dists[i]);
        }else{
            dists[i]*=perst/(window.innerHeight%4);
            while( dists[i]+2*Ballsize[i]<dists[i-1]){
                dists[i]+=dists[i-1]/(window.innerHeight%4);
            }
             dists[i]+=2*Ballsize[i];
        }
    }
    
    
    
    
    //tails
    for( j=0;j<xs.length;j++){
        for( i=0;i<xs[j].length;i++){
            xs[j][i]=0.0;
            ys[j][i]=0.0;

        }
        xs[j][0] = int(centerX + Math.sin(angle[j]) * dists[j]);
        ys[j][0] = int(centerY + Math.cos(angle[j]) * dists[j]);
    }

    //freshRate
    frameRate(60);
    printall();
    
}
function shiftXY(index){
    for(s =xs[index].length-2; s >= 0 ; s--){
        xs[index][s+1] = xs[index][s];
        ys[index][s+1] = ys[index][s];
    }
}
        

function draw(){
//    console.log(centerX+" "+centerY);
//    console.log(mouseX,mouseY);
    background(20); 
    noStroke();
    fill(248,74,101);
    ellipse(centerX,centerY,69,69);
    for (var ball = 0;ball<Ballsize.length;ball++){ 
        drawPlanet(dists[ball],colors[ball],Ballsize[ball],angle[ball],ball);
        //drawTail(dists[i],colors[i],size[i],angle[i],i);
    }
    for(var m=0;m<angle.length;m++){
        if(angle[m]>(2*PI)){
            angle[m] -= 2*PI;
        }
        angle[m] += speed[m];
    }
}

function drawPlanet( sc, c, sizeb, angle, index){
    var colorSet =c;  
    var myColor = colorSet;
    var x = int(centerX + Math.sin(angle) * sc);
    var y = int(centerY + Math.cos(angle) * sc);
//    console.log(index+": "+x+" "+y);
    fill(c);
    ellipse(x,y,sizeb,sizeb);
    var targetX = x,  
        targetY = y; 
    xs[index][0] += (targetX - xs[index][0]) * easing;  
    ys[index][0] += (targetY - ys[index][0]) * easing; 
    fill(c);
    shiftXY(index);
    var factor =0;
    for(var t= 0;t<xs[index].length;t++){
        fill(myColor);
        if(sizeb>factor){
            ellipse(xs[index][t],ys[index][t],sizeb-factor,sizeb-factor);
            factor+=float(sizeb)/tailLength;
        }

    }
}




function printall(){
//    console.log(centerX+" "+centerY);
    for(i=0;i<angle.length;i++){
        console.log("---------------");
        console.log(i+": "+
        "speed:" +speed[i]+" ,"+
        "angle:" +angle[i]+" ,"+
        "size:"  +Ballsize[i]+" ,"+
        "color:"+colors[i]+" ,"+
        "dist:" +dists[i]);
    }
}
