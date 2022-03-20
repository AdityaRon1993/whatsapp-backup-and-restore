const printCenter = async({str,maxLength,gradient}) => {
    let len = str.length;
    let gapLen = Math.ceil((maxLength-len)/2);
    for(let i=0;i<gapLen;i++){
        str=" " + str;
    }
    console.log(gradient(str))
    return;
};

export default printCenter;
