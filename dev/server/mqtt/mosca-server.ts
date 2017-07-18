import { HubMessage } from "../data/hub-message";

var mosca = require('mosca');

export class MoscaServer {

    private server;
    constructor() {
        var ascoltatore = {
            //using ascoltatore
            type: 'mongo',
            url: 'mongodb://devmongodb:27017/mqtt',
            pubsubCollection: 'ascoltatori',
            mongo: {}
        };

        var settings = {
            port: 1883,
            backend: ascoltatore
        };

        this.server = new mosca.Server(settings);
    }

    public start = () => {
        this.server.on('clientConnected', this.clientConnected);
        // fired when a message is received
        this.server.on('published', this.published);

        this.server.on('ready', this.setup);
    }

    public send = <T>(message: HubMessage<T>, callback: (packet: any, client: any) => void) => {
        this.server.publish(message, callback);
    }

    private clientConnected = (client: any) => {
        console.log('client connected', client.id);
    }

    private published = (packet: any, client: any) => {
        console.log('Published', packet.payload);
    }

    // fired when the mqtt server is ready
    private setup = () => {
        console.log('Mosca server is up and running');
    }
}
