import * as mongoose from "mongoose";
var Schema = mongoose.Schema;

var Profile = new Schema({
    userId: Schema.Types.ObjectId,
    nickname: String,
    birthdate: Date,
    birthYear: String,
    birthMonth: String,
    birthDay: String,
    fullname: String,
    logoUrl: String,
    logoId: Schema.Types.ObjectId,
    headerUrl: String,
    headerId: Schema.Types.ObjectId,
    containerId: Schema.Types.ObjectId
});

Profile.statics.getProfileByUserId = function(userId: string, cb) {
    console.log("inside getProfileByUserId:" + userId);
    this.findOne(
        {
            'userId': new mongoose.Types.ObjectId(userId)
        },
        (err, profile) => {
            if (err) {
                cb(err, null);
            };
            cb(null, profile);
        });
}

Profile.statics.putProfile = function(profile: any, cb) {
    let updatedProfile = {
        _id: new mongoose.Types.ObjectId(profile._id),
        userId: new mongoose.Types.ObjectId(profile.userId),
        nickname: profile.nickname,
        birthdate: new Date(profile.birthdate),
        fullname: profile.fullname,
        logoId: new mongoose.Types.ObjectId(profile.logoId)
    };
    this.updateOne({ _id: new mongoose.Types.ObjectId(profile._id) }, updatedProfile, (error, data)=>{
            if(error !=null)
            {
                cb(error, null);
            }
            else{
                this.getProfileByUserId(profile.userId, cb);
            }
    });
}

Profile.statics.createProfile = function(profile: any, cb) {
    let newProfile = {

    }
}

module.exports = mongoose.model("profile", Profile);
