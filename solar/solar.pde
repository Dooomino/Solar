float speed[] = {47.87,35.02,29.78,24.077,13.07,9.69,6.81,5.43,4.75};
float angle[] = new float[speed.length]; //0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4
int size[] = {4879,12104,12756,6792,139822,120536,51118,49528,2301};
color colors[] = {color(245,214,120),color(251,131,122),color(37,193,128),
                  color(226,98,123),color(217,164,103),color(249,206,68),
                  color(65,176,178),color(98,125,180),color(64,78,163)
                 };
float dists[] = {57.9,108.2,149.6,227.9,778.6,1433.5,2872.5,4495.1,5906.4};
int Wwidth = 0;
int Wheight = 0;
int centerX = 0;
int centerY = 0;    
float prop = 0;

int tailLength =80;
float xs[][] = new float[9][tailLength];
float ys[][] = new float[9][tailLength];

float easing=0.6;  

void settings() {
    Wwidth = displayWidth;
    Wheight = displayHeight;
    centerX = Wwidth/2;
    centerY = Wheight/2;
    prop = float(Wheight)/Wwidth;
        println("prop: "+Wheight);
    size(displayWidth, displayHeight);
//    fullScreen();
}

void setup(){
    smooth();
    ellipseMode(CENTER);
    
     
     
   
  
  
    //random angle
    for(int i=0;i<angle.length;i++){
       angle[i]=PI/int(random(1,9));
    }
    //calc speed v=sqrt( GM/r )
    for(int i=0;i<speed.length;i++){
        speed[i]=(sqrt(274.13*speed[i]/size[i])*200)/1e4;  //200 is for divided by 2 
                                                     // then times 100
    }
    
    // resize 
    float  constSun = 695508/(695508*prop/1000);  
    for(int i=0;i<size.length;i++){
        float temp =size[i]/constSun;
            println("CAlc size at "+i+" from "+size[i]+" :"+(size[i]/constSun));
        if(temp>69*prop){
            float prop2sun = 69/size[i];
            print(prop2sun);
            size[i]= int((temp-temp*prop2sun)*prop);
            println(i+" resized: "+size[i]);
        }else {
            int resize = int(temp*prop)*4;
            if(resize>2){
                size[i]=int(temp*prop)*2;
            }else {
                size[i]=int(temp)*4;
            }
        }
        println();
    }
    // remeasure distance 
    for(int i=1;i<dists.length;i++){
        float proph = Wheight/dists[i];
                println("origin dist at "+i+" : "+dists[i]);
        if(dists[i]>200){
                println("dists["+i+"] to dists["+(i-1)+"] (prophed="+proph+"):" +proph*(dists[i]-dists[i-1]));
            float dist = dists[i]-dists[i-1];
            dists[i] =log(dists[i]);
                println("Loged "+i+" : " + dists[i]);
            if (proph<1) {
                dists[i] =dists[i-1]+proph*(dists[i]/dist)+1.5*size[i-1];
            }else{
               dists[i] =dists[i-1]+dist/(dists[i]*proph)+1.5*size[i-1]; 
            }
                if((dists[i]-dists[i-1])<size[i-1]){
                    println("     CAUTION!!          collision or far away inwards !!!!!!!!!");
                }
                println("calc dist "+i+" : "+dists[i]);
//            float redist = dists[i];
//            redist *=dists[i]/max(dists);
//            dists[i] =redist+230;
        }
                println(i+" ______________________");
    }
    
    //tails
    for(int j=0;j<xs.length;j++){
      for(int i=0;i<xs[j].length;i++){
          xs[j][i]=0.0;
          ys[j][i]=0.0;
          
      }
       xs[j][0] = centerX + sin(angle[j]) * dists[j];
       ys[j][0] = centerY + cos(angle[j]) * dists[j];
    }
    
    //freshRate
    frameRate(60);
    printall();
}

void draw(){
//    println(Wwidth);
    background(20); 
    noStroke();
    fill(248,74,101);
    ellipse(Wwidth/2,Wheight/2,69,69);
    for (int i = 0;i<colors.length;i++){ 
        drawPlanet(dists[i],colors[i],size[i],angle[i],i);
        //drawTail(dists[i],colors[i],size[i],angle[i],i);
    }
    for(int i=0;i<angle.length;i++){
        if(angle[i]>(2*PI)){
            angle[i] -= 2*PI;
            println("angle reset "+i+" :"+angle[i]);
        }
        angle[i] += speed[i];
    }
}

void shiftXY(int index){
      for( int i =xs[index].length-2; i >= 0 ; i--){
            xs[index][i+1] = xs[index][i];
            ys[index][i+1] = ys[index][i];
        }
}



void drawPlanet(float sc,color c,int size,float angle,int index){
    color colorSet = color(red(c),green(c),blue(c));  
    color myColor = colorSet;
    float x = centerX + sin(angle) * sc;
    float y = centerY + cos(angle) * sc;
    fill(c);
    ellipse(x,y,size,size);
    float targetX = x,  
          targetY = y; 
    xs[index][0] += (targetX - xs[index][0]) * easing;  
    ys[index][0] += (targetY - ys[index][0]) * easing; 
    //xs[index][0] += (targetX - xs[index][0]) * easing + sin(angle) * sc;  
    //ys[index][0] += (targetY - ys[index][0]) * easing + cos(angle) * sc; 
    fill(red(c),green(c),blue(c));
    shiftXY(index);
    float factor =0;
    for(int i= 0;i<xs[index].length;i++){
//        myColor -= 33;  
        fill(myColor);
        if(size>factor){
            ellipse(xs[index][i],ys[index][i],size-factor,size-factor);
            factor+=float(size)/tailLength;
        }
        //println(index+" : "+xs[index][i]+" "+ys[index][i]);

    }
//    println();
//    println("factor: "+factor +" size: "+size+" diff: "+(size-factor)); 
}
 

void printall(){
    for(int i=0;i<angle.length;i++){
        print(i+":");
        print("speed:" +speed[i]+" ,");
        print("angle:" +angle[i]+" ,");
        print("size:"  +size[i]+" ,");
        print("color:"+colors[i]+" ,");
        print("dist:" +dists[i]+"\n");
    }
}


