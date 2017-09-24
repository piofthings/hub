namespace PiotHub {
    export interface ControlUnitCapabilityState {
        id: number; //PK
        cuId: number; //FK
        ccaId: number; //FK
        type: string;
        gpioPin: number;
        state: any;
    }
}
