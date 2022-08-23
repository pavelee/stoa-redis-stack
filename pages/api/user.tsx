// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { userSchema } from '../../entity/user';
import { getRedisClient, isEntityExist } from '../../services/redis';

type Data = any

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const entityName = 'User';
    let client = await getRedisClient();
    let repo = client.fetchRepository(userSchema);
    let method = req.method;

    const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
        const { id } = req.query;
        let s = repo.search();
        let getdata;
        if (id) {
            const exists = await isEntityExist(client, entityName, id as string);
            if (!exists) {
                return res.status(404).json({});
            }
            getdata = await repo.fetch(id as string);
            return res.status(200).json(await getdata.getData())
        }
        res.status(400).json({
            'error': 'Operation not allowed!'
        })
    }

    switch (method) {
        case 'GET':
            return await handleGet(req, res);
        // case 'POST':
        //     return await handlePost(req, res);
        // case 'PUT':
        //     return await handlePut(req, res);
        // case 'DELETE':
        //     return await handleDelte(req, res);
        default:
            res.status(400).json({
                'error': 'Operation not allowed!'
            })
    }
}
