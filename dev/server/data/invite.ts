import { Document, Schema, Model, model, Types } from "mongoose";

// export interface IInvite extends Document  {
//     invitedByUserId: Schema.Types.ObjectId;
//     sentDate: Date;
//     inviteType: Number;
//     status: Number;
//     inviteName: String;
//     inviteEmail: String;
//     inviteMessage: String;
//     firstViewed?: Date;
//     lastViewed?: Date;
//     acceptedDate?: String;
//     acceptedById?: Schema.Types.ObjectId
// }
 var InviteSchema: Schema = new Schema({
    invitedByUserId: Schema.Types.ObjectId,
    sentDate: Date,
    inviteType: Number,
    status: Number,
    inviteName: String,
    inviteEmail: String,
    inviteMessage: String,
    firstViewed: Date,
    lastViewed: Date,
    acceptedDate: String,

    acceptedById: Schema.Types.ObjectId
});

InviteSchema.statics.createInvite = function(appModel : any, userId: string, callback){
    let invite = {
        invitedByUserId : new Types.ObjectId(userId),
        sentDate: new Date(),
        inviteType: 1,
        status: 1,
        inviteName: appModel.name,
        inviteEmail: appModel.email,
        inviteMessage: appModel.message
    };
    this.create(invite, callback)
}

InviteSchema.statics.updateInvite = function(appModel : any, userId: string, callback){
    let updatedProfile = {
        _id: new mongoose.Types.ObjectId(appModel._id),
        userId: new mongoose.Types.ObjectId(appModel.userId),
        nickname: appModel.nickname,
        birthdate: new Date(appModel.birthdate),
        fullname: appModel.fullname,
        logoId: new mongoose.Types.ObjectId(appModel.logoId)
    };
    this.updateOne({ _id: new mongoose.Types.ObjectId(appModel._id) }, updatedProfile, (error, data)=>{
            if(error !=null)
            {
                callback(error, null);
            }
            else{
                this.getProfileByUserId(appModel.userId, callback);
            }
    });
}

export = model("Invite", InviteSchema);
