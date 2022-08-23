import { getRedisClient } from '../services/redis';
import { Entity, Schema } from 'redis-om';
import { commentSchema } from './comment';
import { userSchema } from './user';
import { likeSchema } from './like';

export interface Topic {
    title: string;
    desc: string;
    author: string;
    created: Date;
    modified: Date;
    comments: Array<any>;
}

export class Topic extends Entity {
    async getData() {
        let author = await this.getAuthor();
        let comments = await this.getComments();
        let commentsData = [];
        for (let index = 0; index < comments.length; index++) {
            const element = comments[index];
            commentsData.push(await element.getData());
        }
        let likes = await this.getLikes();
        let likeData = [];
        for (let index = 0; index < likes.length; index++) {
            const element = likes[index];
            likeData.push(await element.getData());
        }
        return {
            id: this.entityId,
            title: this.title,
            desc: this.desc,
            comments: commentsData,
            likes: likeData,
            author: await author.getData(),
            created: this.created,
            modified: this.modified,
        };
    }

    async getRepo(schema: any) {
        let client = await getRedisClient();
        let repo = client.fetchRepository(commentSchema);
        return repo;
    }

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

    async getLikes() {
        let client = await getRedisClient();
        let repo = client.fetchRepository(likeSchema);
        let likes = await repo.search().where('object').eq('topic').where('objectid').eq(this.entityId).return.all();
        return likes;
    }
}

export const topicSchema = new Schema(Topic, {
    title: { type: 'string' },
    desc: { type: 'string' },
    author: { type: 'string' },
    created: { type: 'date' },
    modified: { type: 'date' },
})
