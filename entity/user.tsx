import { Entity, Schema } from 'redis-om';

interface User {
    username: string;
    points: number;
}

class User extends Entity { }

export const userSchema = new Schema(User, {
    username: { type: 'string' },
    points: { type: 'number' },
    likes: { type: 'string[]' },
})
