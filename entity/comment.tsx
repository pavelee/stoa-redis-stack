import { Entity, Schema } from 'redis-om';
import { getRedisClient } from '../services/redis';
import { userSchema } from './user';

export interface Comment {
    content: string;
    topic: string;
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
            created: this.created,
            modified: this.modified,
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
    content: { type: 'string' },
    topic: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
