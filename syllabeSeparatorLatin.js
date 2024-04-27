const dip = ["ae", "au", "oe"];
const semivoc = ["i","u"];
const consdouble = ["rrh","spr","rbs","dein","nx","str","ms","spl","rt","chr","ch","ph","qu","gu","tr","pr","fr","gr","cr","br","tl","pl","dr","dl","fl","gl","cl","bl","st","sp","sd","sf","sg","sc","sb","nc","nt","ns"];
const voc = ["a","e","ë","i","o","u","$","ñ","y"];
const cons =["q","r","t","y","p","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m","%"];

const ei = ["dein"];
const eu = ["seu ","neu ","heu "];
const ui = ["huic", "cui","hui"];

const triprep = ["con","dis"];
const biprep = ["ad","in"];

let incre=0;
let decre=0;
let equal=0;

const reader = new FileReader();

function cycle(word){
    //console.log(word);
    let detectedWord = detectSpecials(word);
    //console.log(detectedWord);
    let VC = translateToVC(detectedWord);
    let VCdivided = analyzeVC(VC);
    let syllabesNumber= countSyllabes(VCdivided);
    return syllabesNumber;
};

function detectSpecials(word){
    let specialsArray = [];
    word = word.toLowerCase();
    word = detectconsdouble(word);
    word = detectsemivoc(word);
    word = detectdip(word);
    return word;
}

function symbolize(word, element,symbol,array){
    word = word.replace(element, "("+symbol+array.indexOf(element)+")");
};

function detectdip(word){
    let nword = word;
    dip.forEach(element=> {
        let elre = new RegExp(element,"g");
        let elarray = nword.match(elre);
        if (elarray!=null){
            nword = nword.replace(element, "$"+dip.indexOf(elarray[0]));
            for(i=0;i<elarray.length;i++){
                nword = nword.replace(element, "$"+dip.indexOf(elarray[0]));
            }
        }
    })
    return nword;
};

function detectsemivoc(word){
    let nword = word;
    let indices =[];
    semivoc.forEach(element=> {
        for(var i=0; i<nword.length;i++) {
            if (nword[i] === element) indices.push(i);
        }
    })
    indices.forEach(element => {
        let position = element;
        let prevpos = element-1;
        let fordpos = element+1;
        let char = nword[position];
        let pchar = nword[prevpos];
        let fchar = nword[fordpos];
        let triprev = nword[position-3]+nword[position-2]+nword[position-1];
        let biprev = nword[position-2]+nword[position-1];
        if (triprep.includes(triprev)&&voc.includes(fchar)){
            if (char == "i") nword = setCharAt(nword,position,"j");
        //    if (char == "u") nword = setCharAt(nword,position,"v");
        }
        else if (biprep.includes(biprev)&&voc.includes(fchar)){
            if (char == "i") nword = setCharAt(nword,position,"j");
        //    if (char == "u") nword = setCharAt(nword,position,"v");
        }
       
        else if ((position == 0 || pchar==" ")&&voc.includes(fchar)){
        if (char == "i") nword = setCharAt(nword,position,"j");
           else if (char == "u") nword = setCharAt(nword,position,"v");
        }
        else if (voc.includes(pchar)&&voc.includes(fchar)){
            if (char == "i") nword = setCharAt(nword,position,"j");
            else if (char == "u") nword = setCharAt(nword,position,"v");
        }

        
    });
    return nword;
};

function detectconsdouble(word){
    let nword = word;
    consdouble.forEach(element=> {
        let elre = new RegExp(element,"g");
        let elarray = nword.match(elre);
        if (elarray!=null){
            if(element=="gu"){
                let position = word.search(element); 
                //Esto va a tener problemas si una palabra tiene más de dos sílabas con gu, que no creo.
                let fordpos = position+2;
                if(voc.includes(word[fordpos])){
                    if(word[fordpos]=="u"){
                        console.log("Ambiguus!");
                    }
                    else{
                    nword = nword.replace(element, "%"+consdouble.indexOf(elarray[0]));
                    for(i=0;i<elarray.length;i++){
                        nword = nword.replace(element, "%"+consdouble.indexOf(elarray[0]));
                    }
                }    
                }

            }
            else{
            nword = nword.replace(element, "%"+consdouble.indexOf(elarray[0]));
            for(i=0;i<elarray.length;i++){
                nword = nword.replace(element, "%"+consdouble.indexOf(elarray[0]));
            }
        }
        }
    })
    return nword;
};

function translateToVC(word){
    let aword = word;
    let VC = "";
    for (i=0;i<aword.length;i++){
        if (voc.includes(aword[i])) VC += "V"
        else if (cons.includes(aword[i])) VC+= "C"
        else if (aword[i] == " ") VC+= " "
    }
    return VC
};

function analyzeVC(wstr){
    let str = wstr;
    let result = "";
    for (let i=0;i<str.length;i++){
        if (str[i]=="V"){ //primera es vocal
            if (str[i+1]=="V"){ //segunda es vocal
                result += "V/";
                str = str.slice(1);
                i=-1;
            } else if (str[i+1]=="C") { //segunda es consonante
                if (str[i+2] =="V"){//tercera es vocal
                    result += "V/";
                    str = str.slice(1);
                    i=-1;
                }
                else if (str[i+2] =="C"){//tercera es consonante
                    result += "VC/";
                    str = str.slice(2);
                    i=-1;
                }
            } else if (str[i+1]==null){//no hay más
                result += "V/";
                str = str.slice(1);
                i=-1;
            }
        } else if (str[i]=="C"){ //primera es consonante
            if(str[i+2]=="V"){//tercera es vocal
                result += "CV/";
                str = str.slice(2);
                i=-1;
            } else if (str[i+2]=="C"){//tercera es consonante
                if (str[i+3]=="V"){//cuarta es vocal
                    result+="CV/";
                    str =str.slice(2);
                    i=-1;
                } else if (str[i+3]=="C"){//cuarta es consonante
                    result+="CVC/";
                    str =str.slice(3);
                    i=-1;
                } else if (str[i+3]==null){//cuarta no existe
                    result+="CVC/";
                    str =str.slice(3);
                    i=-1;
                }
            } else if (str[i+3]==null){//tercera no existe
                result+="CV/";
                str =str.slice(2);
                i=-1;}
        
        }
    }
    return result;
}

function countSyllabes(VC){
    let resultVC = VC;
    let resultArray=resultVC.split("/");
    return resultArray.length-1;

}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function resetValues(i,d,e){
    i=0;
    d=0;
    e=0;
}

function readFile(){
    resetValues(incre,decre,equal);
    let file = document.getElementById("fileInput").files[0];
    let fileText;
    reader.addEventListener('load', (event) => {
    fileText = event.target.result;
    processText(fileText);
    });
    reader.readAsText(file);
}

function processText(text){
    let r = new RegExp("\r","g");
    text=text.replace(r,"");
    showText(text);
    let splitArray = text.split("\n");
    let silabasArray = [];
    let nsilabasArray = []
    splitArray.forEach(element => {
        let silabas = element.split(" ");
        silabasArray.push(silabas);
    });
    silabasArray.forEach(element => {
        let tempArray =[];
        element.forEach(el => {
            let ndsilabas = cycle(el);
            tempArray.push(ndsilabas);
        });
        nsilabasArray.push(tempArray);
    });
    //console.log(silabasArray);
    //console.log(nsilabasArray);
    createSyllabCountResult(nsilabasArray);
    return splitArray;
}

function showText(text){
    let placeholder = document.getElementById("textResult");
    placeholder.innerHTML=text;
}

function createSyllabCountResult(array){
    let resultArray = array;
    let syllabCountResult = "";
    resultArray.forEach(element => {
        if (element != 0){
        syllabCountResult += element+": "+ caracterizeVerse(element)+"\n"}        
    });
    showCount(syllabCountResult);
}

function showCount(count){
    let placeholder = document.getElementById("countResult");
    placeholder.innerHTML=count;
    countType(count);
}

function caracterizeVerse(array){
    let verseArray=array;
    let value = 0;
    for(i=0;i<verseArray.length-1;i++){
        if (verseArray[i]>verseArray[i+1]){
            value+=1;
        } else if (verseArray[i]<verseArray[i+1]){
            value-=1;
        }    
    }
    if (value<0){
        return "increment"
    } else if (value>0){
        return "decrease"
    } else{
        return "neutral"
    }
}

function countType(text){
    const types = ["increment","decrease","neutral"];

    let totalNumber = 0;
    let incrementNumber =0;
    let decreaseNumber =0;
    let neutralNumber =0;

    types.forEach(element => {
        if (element =="increment"){
            incrementNumber=occurrences(text,element);
        } else if (element =="decrease"){
            decreaseNumber=occurrences(text,element);;
        } else {
            neutralNumber=occurrences(text,element);;
        }
    });

    totalNumber= totalNumber+incrementNumber+decreaseNumber+neutralNumber;
    let htmlResult= document.getElementById("finalResult");
    htmlResult.innerHTML= "El número total de verso de incremento es "+incrementNumber+". El número total de versos de disminuición es "+decreaseNumber+". El número total de versos neutros es "+neutralNumber+". El número total de versos es "+totalNumber+".";
    
}

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}