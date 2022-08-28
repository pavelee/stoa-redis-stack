import { getRedisClient, isEntityExist } from '../services/redis';
import { Entity, Schema } from 'redis-om';
import { commentSchema } from './comment';
import { User, userSchema } from './user';
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
    async getData(user: User | null = null) {
        let author = await this.getAuthor();
        let comments = await this.getComments();
        let commentsData = [];
        for (let index = 0; index < comments.length; index++) {
            const element = comments[index];
            commentsData.push(await element.getData(user));
        }
        let likes = await this.getLikes();
        let likeData = [];
        // @TODO move to function, to keep DRY
        for (let index = 0; index < likes.length; index++) {
            const element = likes[index];
            likeData.push(await element.getData());
        }
        let isLiked = false;
        if (user) {
            for (let index = 0; index < likeData.length; index++) {
                const element = likeData[index];
                if (element.author.id === user.entityId) {
                    isLiked = true;
                    break;
                }
            }
        }
        return {
            id: this.entityId,
            title: this.title,
            desc: this.desc,
            comments: commentsData,
            likes: likeData,
            author: await author.getData(),
            created: JSON.parse(JSON.stringify(this.created)),
            modified: JSON.parse(JSON.stringify(this.modified)),
            isLiked: isLiked,
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
        let comments = await repo.search().where('object').eq('topic').where('objectid').eq(this.entityId).return.all();
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


export const fetchData = async (id: string | null = null, user: User | null = null) => {
    let client = await getRedisClient();
    let repo = client.fetchRepository(topicSchema);
    let s = repo.search();
    let getdata;
    if (id) {
        const exists = await isEntityExist(client, 'Topic', id as string);
        if (!exists) {
            throw new Error('Not Found');
        }
        getdata = await repo.fetch(id as string);
        return await getdata.getData(user);
    } else {
        getdata = await s.sortDesc('created').all()
    }
    let response = [];
    for (let index = 0; index < getdata.length; index++) {
        const element = getdata[index];
        response.push(await element.getData(user))
    }
    return response;
}