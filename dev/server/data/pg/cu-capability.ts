namespace PiotHub {
    export interface ControlUnitCapability {
        id: number;
        cuId: number; // FK
        cmId: number; // FK
        gpioPin: number;
        mqttHost: string;
        mqttPort: number;
        mqttTopic: string;
    }

}
