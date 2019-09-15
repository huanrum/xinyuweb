var common = require('./../common');

module.exports = function(value){
    var cata_ones = common.cache('cata_ones') || {};
    return (cata_ones[value] || {name:value}).name || value;
};