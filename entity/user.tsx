import { Entity, Schema } from 'redis-om';

export interface User {
    username: string;
    name: string;
    avatar: string;
    points: number;
    created: Date;
    modified: Date;
}

export class User extends Entity {
    async getData() {
        return {
            id: this.entityId,
            username: this.username,
            name: this.name,
            avatar: this.avatar,
            points: this.points,
            created: this.created,
            modified: this.modified,
        }
    }
}

export const userSchema = new Schema(User, {
    username: { type: 'string' },
    name: { type: 'string' },
    avatar: { type: 'string' },
    points: { type: 'number' },
    created: { type: 'date' },
    modified: { type: 'date' },
})

export const build = (username: string, name: string) => {
    return {
        username: username,
        name: name,
        avatar: 'https://placeimg.com/300/300/animals',
        created: new Date(),
        points: 0,
    }
}
