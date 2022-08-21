// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'redis-om';
import { topicSchema } from '../../entity/topic';
import { getRedisClient, isEntityExist } from '../../services/redis';

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let client = await getRedisClient();
  let repo = client.fetchRepository(topicSchema);
  let method = req.method;

  const handleGet = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    let s = repo.search();
    let getdata;
    if (id) {
      const exists = await isEntityExist(client, 'Topic', id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      getdata = await repo.fetch(id as string);
    } else {
      getdata = await s.return.all();
    }
    return res.status(200).json(getdata)
  }

  const handlePost = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { title, desc } = req.body;
    const postdata = await repo.createAndSave({
      title, desc, created: new Date()
    });
    return res.status(200).json(postdata)
  }

  const handleDelte = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    if (id) {
      const exists = await isEntityExist(client, 'Topic', id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      repo.remove(id as string);
    }
    return res.status(200).json({});
  }

  const handlePut = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    const { title, desc } = req.body;
    if (id) {
      const exists = await isEntityExist(client, 'Topic', id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      let data = await repo.fetch(id as string);
      if (title) {
        data.title = title;
      }
      if (desc) {
        data.desc = desc;
      }
      repo.save(data);
      return res.status(200).json(data)
    }
    return res.status(404).json({})
  }

  switch (method) {
    case 'GET':
      return await handleGet(req, res);
    case 'POST':
      return await handlePost(req, res);
    case 'PUT':
      return await handlePut(req, res);
    case 'DELETE':
      return await handleDelte(req, res);
    default:
      res.status(400).json({
        'error': 'asdas'
      })
  }
}