var crypto = require('crypto');

module.exports = {

    GetToken : function (email) {
        var key = 'EE5A735FC9776';
        var randomSpan = crypto.randomBytes(20).toString('hex');
        var hash = crypto.createHmac('sha512', key);
        hash.update(email+randomSpan);
        return hash.digest('hex');
    },

     GetCodUtente : function (email) {
        var key = '6D8276C2AA6ED';
        var hash = crypto.createHmac('sha512', key)
        hash.update(email);
        return hash.digest('hex');
    },

    GetCodUtente_span : function (email) {
        var key = '6D8276C2AA6ED';
        var randomSpan = crypto.randomBytes(20).toString('hex');
        var hash = crypto.createHmac('sha512', key);
        hash.update(email+randomSpan);
        return hash.digest('hex');
    },

    GetPassword : function (password) {
        var key = '5B6ACB4C14554C65EFC14BE75B1AB';
        var hash = crypto.createHmac('sha512', key);
        hash.update(password);
        return hash.digest('hex');
    }
};

