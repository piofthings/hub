namespace PiotHub{
    export interface ControlUnit {
        id: number;
        deviceId: string;
        description: string;
        status: number;
        mqttHost: string;
        mqttPort: string;
        mqttTopic: string;
        
    }
}
