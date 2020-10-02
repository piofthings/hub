import { HubMessage } from "../data/hub-message";
import { Configuration } from "../services/settings/config-model";
import { Server, Client, AuthenticateError } from "aedes";
import * as aedes from "aedes";
import * as net from "net";

export class AedesServer {
    private server: net.Server;
    private port = 1883;
    private broker: aedes.Aedes;
    constructor() {
        this.broker = Server();
        this.server = net.createServer(this.broker.handle);
        this.server.listen(this.port, () => {
          console.log('MQTT: server listening on port', this.port)
      });
    }

    public start = () => {
        this.broker.on('client', this.clientConnected);
        this.broker.on('clientDisconnect', this.clientDisconnected);
        this.broker.on('keepaliveTimeout', this.keepaliveTimeout);
        this.broker.on('publish', this.published);

        console.log('Aedes server is up and running');
    }

    private clientConnected = (client: Client) => {
        console.log('client connected', client.id);
    }

    private clientDisconnected = (client: Client) => {
        console.log('client disconnected', client.id);
    }

    private keepaliveTimeout = (client: Client) => {
        console.log('client keepaliveTimeout', client.id);
    }

    private connackSent = (client: Client) => {
        console.log('client connackSent', client.id);
    }

    private published = (packet: any, client: Client) => {
        console.log('Published', JSON.stringify(packet));
    }

    public send = <T>(message: any, callback: () => void) => {
        this.broker.publish(message, callback);
    }
}
