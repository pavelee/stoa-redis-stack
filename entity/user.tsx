import { Entity, Schema } from 'redis-om';

export interface User {
    username: string;
    name: string;
    points: number;
    created: Date;
    modified: Date;
}

export class User extends Entity { }

export const userSchema = new Schema(User, {
    username: { type: 'string' },
    name: { type: 'string' },
    points: { type: 'number' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
