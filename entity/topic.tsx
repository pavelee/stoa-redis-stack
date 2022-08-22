import { getRedisClient } from '../services/redis';
import { Entity, Schema } from 'redis-om';
import { commentSchema } from './comment';
import { userSchema } from './user';

export interface Topic {
    title: string;
    desc: string;
    author: string;
    created: Date;
    modified: Date;
    comments: Array<any>;
}

export class Topic extends Entity {

    async getComments() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(commentSchema);
        let comments = await repo.search().where('topic').eq(this.entityId).return.all();
        return comments;
    }

    async getAuthor() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(userSchema);
        let user = await repo.fetch(this.author);
        return user;
    }
}

export const topicSchema = new Schema(Topic, {
    title: { type: 'string' },
    desc: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
