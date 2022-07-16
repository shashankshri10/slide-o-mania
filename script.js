let gameArr=new Array(20); //game Arr is 2d array that stores position of the nubers and blank during game runtime
for (let x=0;x<20;x++){gameArr[x]=new Array(20);}

let totalRows=0,totalCols=0; 

let ifSolvable=""; 

function subDeets(){
    //console.log("func exe"); 
    let nRows=document.getElementById('nRows'); 
    let nColumns=document.getElementById('nColumns'); 
    let playerName=document.getElementById('playerName').value; 
    let nRVal=Number(nRows.value); 
    let nCVal=Number(nColumns.value); 
    let nRMin=Number(nRows.min); 
    let nRMax=Number(nRows.max); 
    let nCMin=Number(nColumns.min); 
    let nCMax=Number(nColumns.max); 
    let wrngMsgArea=document.getElementById('warnArea'); 
    let errMsg=""; 
    wrngMsgArea.innerHTML=""; 
    let checkVal=((nRVal>=nRMin && nRVal<=nRMax)&&Number.isInteger(nRVal))&&((nCVal>=nCMin && nCVal<=nCMax)&&Number.isInteger(nCVal))&&(playerName!==""); 
    if (checkVal) {
        wrngMsgArea.innerHTML="<br>";
        //insert code to pass data to gameBoard obj
        let newGame=new gameBoard(nRVal,nCVal);
        newGame.arrGenerator(); 
        newGame.drawBoard();  
        //after board is drawn button is disabled, that will be added inside event listener itself

        console.log(`everything valid`); 
        console.log(window.innerWidth); 
        console.log(parseFloat(window.innerWidth)); 
        return true; 
    }
    else {
        if (playerName===""){errMsg+="Player Name required<br>"; }
        if (nRows.value===""){errMsg+="Num Rows required<br>"; }
        if(nColumns.value===""){errMsg+="Num Columns required"; 
            wrngMsgArea.style.backgroundColor='yellow'; 
            wrngMsgArea.innerHTML=errMsg; 
            return false; 
        }
        if ((!Number.isInteger(nRVal))||(!Number.isInteger(nCVal))) {
            errMsg+=(Number.isInteger(nRVal))?"No. of columns must be an integer<br>":""; 
            if (!Number.isInteger(nRVal)){errMsg+="No. of rows must be an integer<br>";}
            if (!Number.isInteger(nCVal)){errMsg+="No. of columns must be an integer<br>";}
        }
        if (nRVal<nRMin||nRVal>nRMax||nCVal<nCMin||nCVal>nCMax) {
            if (nRVal<nRMin||nRVal>nRMax){errMsg+="No. of rows must be between 2 and 20 including both.<br>";}
            if (nCVal<nCMin||nCVal>nCMax){errMsg+="No. of columns must be between 2 and 20 including both.<br>";}
        }
        
        wrngMsgArea.style.backgroundColor='yellow'; 
        wrngMsgArea.innerHTML=errMsg;
        return false;  
    }
      
}

document.getElementById('startGameButton').addEventListener('click',(ev)=>{
    if(subDeets())
    {
        console.log("Next Screen in now"); 
        console.log(ev.target.id); 
        document.getElementById('startGameButton').setAttribute("disabled",""); 
    }
    else{console.log("Error msg display"); }
}); 
//insert class to create the square of gameBoard
class gameBoard{
    constructor(rows,columns){
        this.r=rows; 
        this.c=columns; 
        totalRows=rows; 
        totalCols=columns; 
    }
    drawBoard(){
        let m=this.r; 
        let n=this.c; 
        let winW=parseFloat(window.innerWidth); 
        let winH=parseFloat(window.innerHeight); 
        let gBWD=document.getElementById('gBWD'); 
        gBWD.style.width=`${winW}px`; 
        let gmB=document.createElement('table'); 
        gmB.id='gmBTbl'; 
        //table styling goes here
        gmB.style.borderCollapse="collapse"; 
        gmB.style.padding="0px"; 
        //element.clientWidth is including padding but excluding borders
        gmB.style.width=`${Math.min(winW,winH)*0.95}px`; 
        let gmBW=parseFloat(gmB.style.width); 
        let insideBorderWd=0.005*winW; 
        gmB.style.border=`${insideBorderWd}px solid grey`; 

        let sqSide=(gmBW-((n+1)*insideBorderWd))/n; //in css box sizing is set to border box
        gmB.style.height=`${(m*sqSide)+((m+1)*insideBorderWd)}px`; 
        gBWD.appendChild(gmB); //table inserted as a child node inside Wrapper Div

        let tbl=new Array(m); 
        let tblR=new Array(m); 
        for (let i=0;i<m;i++)
        {
            tblR[i]=document.createElement('tr'); 
            tblR[i].id=`tblR${i}`; 
            tblR[i].style.width=`${gmBW-2*insideBorderWd}px`; 
            tblR[i].style.padding='0px'; 
            tbl[i]=new Array(n); 
            for (let j=0;j<n;j++)
            {
                tbl[i][j]=document.createElement('td'); 
                tbl[i][j].id=`tblCell${i}${j}`; 
                tbl[i][j].style.padding='0px'; 
                tbl[i][j].style.width=`${sqSide}px`; 
                tbl[i][j].style.height=`${sqSide}px`; 
                
                let sqNum=document.createElement('img'); 
                
                sqNum.src=createimgUsingCanvas(gameArr[i][j],null,sqSide); 
                tbl[i][j].appendChild(sqNum); 
                tblR[i].appendChild(tbl[i][j]); 
                
                tbl[i][j].addEventListener('click',(ev)=>{
                    console.log(`${i},${j} clicked`);
                    //console.log(ev.target.id); 
                    checkForX(i,j); 
                    for (let y=0;y<totalRows;y++){
                        for (let z=0;z<totalCols;z++){
                            document.getElementById(`tblCell${y}${z}`).firstChild.src=createimgUsingCanvas(gameArr[y][z],null,sqSide);
                        }
                    }
                    
                });
            }
            gmB.appendChild(tblR[i]); 
        }
       
    }
    arrGenerator() //generates a solvable board 1d array 
    {
        let m=this.r; 
        let n=this.c; 
        let check; 
        let gameArr1D=new Array(m*n); //stores content of 2d gameArr in the starting to check for solvability
        for (let i = 0; i < gameArr1D.length; i++) {
            gameArr1D[i]=i; 
            if (i===0) {
                gameArr1D[i]=null; 
                
            }
        } //assigning content to arr1D
        gameArr1D=shuffleArr(gameArr1D); 
        check=false; 
        let counter= 0; 
        while(true)
        {
            if (counter>1000) {
                //code to assign a replacement array to gameArr1D
                break; 
            }
            if (m!==n) {
                ifSolvable="may not be solvable"; 
                //code to pass array to gameArr (2D) so that it can be displayed on the gameboard
                into2D(gameArr1D,n); 
                break; 
            }
            else {
                if (check===true)
                {
                    ifSolvable="is Solvable"; 
                    //code to pass array to gameArr (2D) so that it can be displayed on the gameboard
                    into2D(gameArr1D,n); 
                    console.log(`loop was executed ${counter} times`); 
                    break; 
                }
                else
                {
                    if (counter!==0){gameArr1D=shuffleArr(gameArr1D);}
                     
                    check=canbeSolved(gameArr1D,n); 
                    counter+=1;  
                }
            }
        }
    }
    checkWin(){
        let numRows=this.r; 
        let numCols=this.c; 
        let winStat=false; 

        //
    }
}

function createimgUsingCanvas(num,col,divDim){
    const canv=document.createElement('canvas'); 
    canv.className='backCanvas'; 
    canv.id=`bgNo${num}`; 
    //document.body.appendChild(canv); 
    const ctx=canv.getContext('2d'); 

    canv.width=divDim; 
    canv.height=divDim; 
    const side=divDim/100; 
    ctx.scale(side,side); 

    ctx.fillStyle='#e69a8dff'; 
    ctx.fillRect(0,0,100,100); 
    ctx.fillStyle='#5f4b8bff'; 
    ctx.font=`75px serif`; 
    ctx.textAlign='center'; 
    ctx.textBaseline='middle'; 
    if (num!==null){ctx.fillText(num,50,50);}
    else if(num===null){ctx.fillText('X',50,50);}
    
    const bgImgURL=canv.toDataURL(); 
    //console.log(bgImgURL); 
    console.log("function executed"); 
    return bgImgURL; 
}

function shuffleArr(arr){
    for (let i=arr.length-1;i>0;i--){
        let j=Math.floor((Math.random())*(i+1)); //since random generates numbers in range [0,1) 
        //now swap a[j] and a[i]
        let temp=arr[j]; 
        arr[j]=arr[i]; 
        arr[i]=temp; 
    }
    return arr; 
}

function canbeSolved(arr,n){
    //function checks if array (1D) config can be solved
    let numInv=0; 
    let xRowPos=0;
    let xColPos=0; 
    if (n%2===1) //if n is odd
    {
        console.log(`n is odd`); 
        numInv=getInv(arr); 
        console.log(`${numInv} inversions in array.`); 
        if (numInv%2===0){return true;}
        else {return false;}
    }
    else if (n%2===0)
    {
        console.log(`n is even`); 
        numInv=getInv(arr); 
        //console.log(`${numInv} inversions in array.`);
         
        let ind;
        for (let a=0;a<arr.length;a++){
            if (arr[a]===null)
            {
                ind=a; 
                break;
            }
        }
        console.log(ind); 
        xRowPos=Math.floor(ind/n); 
        xColPos=ind%n;
        console.log(`${xRowPos} ${xColPos}`); 
        let lastRowRel=n-xRowPos; 
        if ((numInv%2===0)&&(lastRowRel%2===1))
        {
            console.log(`${numInv} inversions and last row rel pos is ${lastRowRel}`); 
            return true; 
        } 
        else if ((numInv%2===1)&&(lastRowRel%2===0))
        {
            console.log(`${numInv} inversions and last row rel pos is ${lastRowRel}`); 
            return true;
        }
        else {return false;}
    }
    function getInv(arr){
        let inv=0; 
        for (let i = 0; i < arr.length-1; i++) {
            if (arr[i]===null){continue;}
            for (let j=i+1;j<arr.length;j++){
                if (arr[j]===null){continue;}
                if (arr[i]>arr[j]) {
                    inv+=1; 
                }
            }
        }
        return inv; 
    }
}

function into2D(arr,cols){
    //function to transfer elements from 1D arr to 2D arr
    for (let z=0;z<arr.length;z++){
        let i=Math.floor(z/cols); 
        let j=z%cols;
        gameArr[i][j]=arr[z]; 
    }
}

function move(CurI,CurJ,dir) //returns value of i and j by moving one unit in given direction false if movmnt not poss
{
   let currX=Number(CurI); 
   let currY=Number(CurJ); 
   let dirArray=['right','down','left','up']; 
   let xMult=[0,1,0,-1]; 
   let yMult=[1,0,-1,0]; 
   let dirIndex=dirArray.indexOf(dir); 
   
   
   let newX=currX+xMult[dirIndex]; 
   let newY=currY+yMult[dirIndex];  
   let newIndex=[newX,newY]; 
   
   if (newX>=0 && newX<totalRows && newY>=0 && newY<totalCols){return newIndex;}
   else {return false;}
}

function checkForX(currX,currY){
    let nullAt; 
    let nullPresentinRow=false; 
    let nullPresentinCol=false; 
    for (let q=0;q<totalCols;q++){
        if (gameArr[currX][q]===null){
            nullAt=[currX,q]; 
            nullPresentinRow=true; 
            break; 
        }
    }
    for (let r=0;r<totalRows;r++){
        if (gameArr[r][currY]===null){
            nullAt=[r,currY]; 
            nullPresentinCol=true; 
            break; 
        }
    }
    if (nullPresentinRow && nullPresentinCol)
    {
        //this means clicked cell contains X, hence do nothing
    }
    else if(nullPresentinRow && (!nullPresentinCol))
    {
        //null pressent in row
        let shiftDir=''; 
        if ((currY-nullAt[1])>0){shiftDir='right';}
        else if ((currY-nullAt[1])<0){shiftDir='left';}
        let sOp,shiftElY; 
        for (let p=0;p<Math.abs(currY-nullAt[1]);p++){
            if (shiftDir==='right'){shiftElY=nullAt[1]+p;}
            else {shiftElY=nullAt[1]-p;}
            
            sOp=shift(currX,shiftElY,shiftDir); //this function changes value of gameArr
        }
    }
    else if ((!nullPresentinRow) && (nullPresentinCol))
    {
        //null pressent in column
        let shiftDir=''; 
        if ((currX-nullAt[0])>0){shiftDir='down';}
        else if ((currX-nullAt[0])<0){shiftDir='up';}
        let sOp2,shiftElX; 
        for (let q=0;q<Math.abs(currX-nullAt[0]);q++){
            if (shiftDir==='down'){shiftElX=nullAt[0]+q;}
            else {shiftElX=nullAt[0]-q;}
            
            sOp2=shift(shiftElX,currY,shiftDir); //this function changes value of gameArr
        }
    }
    for (let op=0;op<totalRows;op++){console.log(gameArr[op]);} 
}

function shift(p,q,dir) //shifts gameArr[p][q] in given direction
{
    let moveResult=move(p,q,dir); 
    if (moveResult===false){
        return false; 
    }
    else {
        let temp = gameArr[moveResult[0]][moveResult[1]]; 
        gameArr[moveResult[0]][moveResult[1]]=gameArr[p][q]; 
        gameArr[p][q]=temp; 
        
        return true; 
    }
} 