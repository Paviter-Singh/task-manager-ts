// const fun = new Promise((resolve, reject)=>{
//     reject( new Error("I am always here"))
// })

// fun.then().catch((err)=>{
//     console.log('I am erro', err)
// })
const fs = require('fs')
let obj = {}

for(let i=0;i<100000;i++){
    obj['test'+i] = i;
}
console.log()

fs.writeFileSync('./test.json', JSON.stringify(obj), 'utf8')