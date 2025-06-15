
module.exports.generate = ((min, max) => {
    // return new Promise((resolve, reject) => {
    //     let rnd = Math.random() * (max - min) + min;
    //     resolve(Math.round(rnd));
    // });
    return new Promise(resolve => {
        const num =  Math.random() * (Number(max) - Number(min)) + Number(min);
        let n = Math.floor(num);
        if(n.toString().length < 6) { 
            n = `${n}0`;
        }
        resolve(n);
    })
    
})