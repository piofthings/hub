var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    nickname: String,
    birthdate: Date,
    isVerified: Boolean,
    email: String,
    verificationCode: Schema.Types.ObjectId
});

Account.statics.verifyAccount = function(verificationCode: string, cb) {
    //console.log("inside verify account:" + verificationCode);
    this.findOne({
        'verificationCode': mongoose.Types.ObjectId(verificationCode)
    },
        'username',
        (err, user) => {
            if (user != null) {
                //console.log("User with verificationCode: " + verificationCode);
                if (err) {
                    //console.log("findUserByVerficationCode: " + err);
                    cb(err, null);
                };
                user.verificationCode = null;
                user.isVerified = true;
                user.save(function(saveErr) {
                    if (saveErr) {
                        return cb(saveErr);
                    }
                    cb(null, user);
                });
            }else{
                cb({error: 'Invalid verification code or verification code no longer valid.'}, null);
            }
        });
}

Account.statics.getAccountByName = function(username: string, cb) {
    //console.log("inside getAccountByName:" + username);
    this.findOne({
        'username': 'username'
    },
        'username, verificationCode, email',
        (err, user) => {
            //console.log("User name: " + username);
            if (err) {
                //console.log("findUserByVerficationCode: " + err);
                cb(err, null);
            };
            cb(null, user);
        });
}

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
