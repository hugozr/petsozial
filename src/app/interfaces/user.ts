export interface User {
    id?: string,
    username: string,
    email: string,
    password?: string,
    roles: string[],
    human: any,
    humanId?: string,
    humanName?: string,
    humanEmail?: string,
}