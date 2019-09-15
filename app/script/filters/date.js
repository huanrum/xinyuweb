var moment = require('./../../lib/moment');

module.exports = function(value){
    return moment(value).format('YYYY-MM-DD HH:mm');
};