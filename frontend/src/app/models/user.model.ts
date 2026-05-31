export interface User {
    id: string;
    name: string;
    email: string;
    role: 'guest' | 'user' | 'admin';
    createdAt: Date;
}