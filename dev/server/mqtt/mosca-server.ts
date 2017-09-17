import { HubMessage } from "../data/hub-message";
import { Configuration } from "../services/settings/config-model";

var mosca = require('mosca');

export class MoscaServer {
    private config : Configuration;
    private server;
    constructor(config: Configuration) {
        this.config = config;
        // var ascoltatore = {
        //     //using ascoltatore
        //     type: 'mongo',
        //     url: config.mongodbMqttUri,
        //     pubsubCollection: 'ascoltatori',
        //     mongo: {}
        // };

        var ascoltatore = config.mqttSessionConfig;
        console.log(JSON.stringify(ascoltatore));
        ascoltatore.redis = require('redis');

        var settings = {
            port: 1883,
            backend: ascoltatore,
            persistence: {
                factory: mosca.persistence.Redis,
                host: this.config.mqttSessionConfig.host,
                port: this.config.mqttSessionConfig.port
          }
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
