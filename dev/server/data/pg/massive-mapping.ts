import { Database, Table } from "massive";

declare global {
    interface DatabaseEx extends Database {
         accounts: Table<MassiveStrategy.User>;
         sessions_massive: Table<MassiveSessionStore.Session>;
         control_units : Table<PiotHub.ControlUnit>;
         cu_capabilities: Table<PiotHub.ControlUnitCapability>;
         cu_capability_actions: Table<PiotHub.ControlUnitCapabilityAction>;
         cu_ca_states: Table<PiotHub.ControlUnitCapabilityState>;
    }
}
