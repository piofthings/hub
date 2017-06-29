// var config = require('../settings/config');
import * as mongoose from "mongoose";
import { Configuration } from "../services/settings/config-model";

export class db {
	_configuration : Configuration;
	public Account = require("../data/account");
	public Profile = require("../data/profile");
	public Content = require("../data/content");
	public FeedItem = require("./feed-item");
	public Invite = require("./invite")


	constructor (configuration: Configuration){
		this._configuration = configuration;
	}

	public getConnection = () => {
		if (mongoose.connection.readyState === 0)
			mongoose.connect(this._configuration.mongodbUri, { server: { auto_reconnect: true } });
		return mongoose.connection;
	}

	public getNewObjectId = () =>{
		return new mongoose.Types.ObjectId;
	}
}
