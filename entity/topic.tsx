import { getRedisClient } from '../services/redis';
import { Entity, Schema, Repository } from 'redis-om';
import { commentSchema } from './comment';

export interface Topic {
    title: string;
    desc: string;
    created: Date;
    likes: string[];
    views: string[];
}

export class Topic extends Entity {

    async comments() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(commentSchema);
        let comments = await repo.search().where('topic').eq(this.entityId).return.all();
        return comments;
    }
}

export const topicSchema = new Schema(Topic, {
    title: { type: 'string' },
    desc: { type: 'string' },
    created: { type: 'date' },
    likes: { type: 'string[]' },
    views: { type: 'string[]' },
})
