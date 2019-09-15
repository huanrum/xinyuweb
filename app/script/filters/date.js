var moment = require('./../../lib/moment');

module.exports = function(value, format){
    return moment(value).format(format || 'YYYY/MM/DD HH:mm');
};