namespace MassiveSessionStore{
    export interface Session{
        sid: string,
        sess: string,
        expired: Date
    }
}
