import { Database, Table } from "massive";

declare global {
    interface DatabaseEx extends Database {
         accounts: Table<User>;
         sessions_massive: Table<MassiveSessionStore.Session>;
    }
}
