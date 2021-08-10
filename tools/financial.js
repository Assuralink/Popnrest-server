const financial = function(number){
    return "£"+Number.parseFloat(number).toFixed(2);
}

module.exports = financial;