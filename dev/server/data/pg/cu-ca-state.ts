namespace piothub {
    interface ControlUnitCapabilityState {
        id: number; //PK
        ccaId: number; //FK
        cuId: number; //FK
        capabilityId: number; //FK;
        type: string;
        gpioPin: number;
        state: any;
    }
}
