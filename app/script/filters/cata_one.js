var common = require('./../common');

module.exports = function(value){
    var cata_ones = common.cache('cata_ones') || [];
    var cata_one = cata_ones.filter(i=>i.cata_one === value).pop() || {name:value};
    return cata_one.name || value;
};