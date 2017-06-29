import * as mongoose from "mongoose";

var FeedItem = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: Number,
    title: String,
    body: String,
    attachments: [],
    permissionRoles: []
});

FeedItem.statics.getFeedByUserId = function(userId: string, cb) {
    //console.log("inside getProfileByUserId:" + userId);
    this.find(
        {
            'userId': new mongoose.Types.ObjectId(userId)
        })
        .sort({ "_id" : -1 })
        .select({ _id: 1, type: 1, title: 1, body: 1, attachments: 1, permissionRoles: 1 })
        .exec((err, feedItems) => {
            console.log("getFeedByUserId: User Id: " + userId + JSON.stringify(feedItems, null, 1));
            if (err) {
                console.log("getFeedByUserId " + err);
                cb(err, null);
            };
            cb(null, feedItems);
        });
}

FeedItem.statics.deleteFeedItem = function(userId: string, feedItemId: string, cb) {
    console.log("deleteFeedItem: User Id: ${userId}, feedItemId: ${feedItemId}", null, 1);

    this.deleteOne({
        'userId' : new mongoose.Types.ObjectId(userId),
        '_id' : new mongoose.Types.ObjectId(feedItemId)
    },
    (err, feedItems) => {
        console.log("deleteFeedItem: User Id: ${userId}, feedItemId: ${feedItemId}", null, 1);
        if(err)
        {
            cb(err, null);
        }
        else
        {
            cb(null, { "message" : "Deleted successfully" } );
        }
    });
}

export =  mongoose.model('feedItem', FeedItem);
