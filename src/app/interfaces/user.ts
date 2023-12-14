export interface User {
    id?: string,
    username: string,
    email: string,
    roles: string[],
    humanId?: string,
    humanName?: string,
    humanEmail?: string,
}