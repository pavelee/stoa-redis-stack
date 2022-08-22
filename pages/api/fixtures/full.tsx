// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, Repository } from 'redis-om';
import { topicSchema } from '../../../entity/topic';
import { userSchema } from '../../../entity/user';
import { commentSchema } from '../../../entity/comment';

type Data = any;

const resetAll = async (repo: any) => {
    await repo.createIndex();
    const entites = await repo.search().return.all();
    for (let index = 0; index < entites.length; index++) {
        const entity = entites[index];
        console.log(`removing topic: ${entity.entityId}`)
        repo.remove(entity.entityId)
    }
}

const createEntity = async (repo: any, data: object) => {
    const entity = await repo.createAndSave(data)
    return entity
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let client = await new Client().open(process.env.REDIS_URL);

    const userRepo = client.fetchRepository(userSchema);
    await resetAll(userRepo);
    const pciosek = await createEntity(userRepo, {
        username: 'pciosek',
        name: 'Paweł Ciosek',
        points: 23,
        created: new Date(),
    });    

    const topicRepo = client.fetchRepository(topicSchema);
    await resetAll(topicRepo);
    const topic = await createEntity(topicRepo, {
        title: 'serious!',
        desc: 'We are serious!',
        author: pciosek.entityId,
        created: new Date(),
    });

    const commentRepo = client.fetchRepository(commentSchema);
    await resetAll(commentRepo);
    await createEntity(commentRepo, {
        content: 'ala ma kota!',
        topic: topic.entityId,
        author: pciosek.entityId,
        created: new Date(),
    });
    await createEntity(commentRepo, {
        content: 'moj komentarz!',
        topic: topic.entityId,
        author: pciosek.entityId,
        created: new Date(),
    });

    res.status(200).json({})
}
