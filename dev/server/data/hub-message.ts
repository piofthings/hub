
export class HubMessage<T>
{
    serverId: string;
    targetClientId: string;
    payload: T;
    typeId: string;
    topic: string;
    qos: number; //0; // 0, 1, or 2
    retain: boolean; //false // or true

    constructor(){

    }

}
