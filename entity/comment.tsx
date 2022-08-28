import { Entity, Schema } from 'redis-om';
import { getRedisClient } from '../services/redis';
import { userSchema } from './user';

export interface Comment {
    object: string;
    objectid: string;
    content: string;
    author: string;
    created: Date;
    modified: Date;
}

export class Comment extends Entity {
    async getData() {
        let author = await this.getAuthor();
        return {
            id: this.entityId,
            content: this.content,
            author: await author.getData(),
            created: JSON.parse(JSON.stringify(this.created)),
            modified: JSON.parse(JSON.stringify(this.modified)),
        }
    }

    async getAuthor() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(userSchema);
        let user = await repo.fetch(this.author);
        return user;
    }
}

export const commentSchema = new Schema(Comment, {
    object: { type: 'string' },
    objectid: { type: 'string' },
    content: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
