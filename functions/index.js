const functions = require('firebase-functions');

// FitstTask

function findingNextOddInSequence (arr) {
    if(arr.length > 0){
        const j = arr.length - 1, 
        n = arr.pop();
        return +n + findingEvenFromIndex(j);
    }else{
        return false;
    }
}
function findingEvenFromIndex(i) {
    if(!isNaN(i)) {
        return 2 * (i+1);
    }else{
        return false;
    }
}

function Task1 (str='3,5,9,15') {
    
    if(str !== '') {
        let arr = str.split(',');
        const  out = findingNextOddInSequence(arr);
        return formatOutput({
            "answer": out,
            "explaination": "Each number is the result of the previous number added by the even number of the sequnece (2, 4, 6, 8, 10,...), will be referred as Arr in the example, at the similar array index.  So, X is 15+Arr[3], Arr[3]=8 so X=23",
            "description": "3, 5, 9, 15, X  - Please create new function for finding X value"
        });
    }else{
        return false;
    }
}

// Second Task
/* Basically, it should be easily resolved by using algebra.js module ...
*/

function Task2 (str = '(Y+24)+(10×2)=99') {

    const args = convertMultiplySymbol(str).replace(/\s/g,'');
    return formatOutput({
        "explaination": "The solution is to split the equation firstly by '=' sign so it becomes array of factors. Then the result of the equation is the last array element (array[1]). Then, converting the operators of each fuactors to be the opposite, e.g. + beacomes -"
        + "Then, concat all the converted factors to the result and finally use ```eval``` function to execute the calculation"
        + "NB: This is the equation resolver function, which requires lots of work to support all possible cases (square root, exponential, etc). Thus this function is only focus on resolving the very basic factors according to the given task ",
        "description": "(Y + 24)+(10 × 2) = 99  - Please create new function for finding Y value",
        "answer": equation(args)
    });
}

function equation(str) {

    let factors = str.split('=');
    const result = factors[1],
          regx = /([+\-*/^])?\(.*?\)/g;
    let leftSide = factors[0].match(regx),
         output = result,
         varFactor='';

    leftSide.forEach(element => {

        if( !findingVar(element, 'Y') ) {
            output +=  reversedOperator(element); //String concat
        }else{
            console.log(element);
            varFactor = removeParentheses(element);
        }
    });

    if(varFactor.match(/^[Yy]/)) {
        let f = removeParentheses(varFactor).split('Y');
        output += reversedOperator(f[1]);
    }else{
        
        let g = removeParentheses(varFactor).split(/[+\-*/^][Yy]/);
        console.log(g);
        output += reversedOperator(g[0]);
        
    }
    return 'Given ' + str + "\r\n" + 'So, Y = ' + (output) + "\r\n" + 'Summary is ' + eval(output);
}

function removeParentheses (str) {
    return str.replace(/([()])/g,'');
}

function findingVar (phrase,varName) {
    return phrase.match(varName) ? true : false;
}

function reversedOperator(str) {

    const regx = /^[+\-*/^]/;

    if(!str.match(regx)) {

        return '-' + str;

    }else{
        str = convertMultiplySymbol(str);
        const reversMap = {
            "+": "-",
            "-" : "+",
            "*": "/",
            "/":"*"
        },
        op = str.match(regx);
        let replaceStr = op[0];

        return str.replace(regx,reversMap[replaceStr]);
    }
    
}
function convertMultiplySymbol (str) {
    return str.replace(/[Xx×]/g,'*');
}

// Task 3

function Task3 (args=5) {
    const ans = arraySequenceFn(args);

    return formatOutput({
        "explaination": "Each number in a sequence is the reversed concatenated previous numbers and padded with number 5. The function is to manipulate the pattern by giving the target number as an argument. fn(5)=" + ans,
        "description": "If 1 = 5 , 2 = 25 , 3 = 325 , 4 = 4325 Then 5 = X   - Please create new function for finding X value",
        "answer": ans
    });
}

function arraySequenceFn(n) {

    var arr=[],
         i=1;
    while (i<=n) {
       let v = i===1 ? '5' : i.toString() + arr[i-2];
       arr.push(v);
       i++;
    }
    return arr.pop();
  }

const taskMaps = {
    "1": Task1,
    "2": Task2,
    "3": Task3
};

function formatOutput (o) {

    let data = {
        "description": o.description,
        "explaination": o.explaination,
        "answer": o.answer
    };

    return data;
}

exports.Test = functions.https.onRequest((request, response) => {

   const task = request.query.task,
         args =  request.query.args,
         out = taskMaps[task].call(this,args);
       
         response.send(out);
});


