// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { commentSchema } from '../../entity/comment';
import { getRedisClient, isEntityExist } from '../../services/redis';

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const entityName = 'Comment';
  let client = await getRedisClient();
  let repo = client.fetchRepository(commentSchema);
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
      getdata = [await repo.fetch(id as string)];
    } else {
      getdata = await s.return.all();
    }
    let response = [];
    for (let index = 0; index < getdata.length; index++) {
      const element = getdata[index];
      response.push(await element.getData())
    }
    return res.status(200).json(getdata)
  }

  const handlePost = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { content, topic } = req.body;
    if (!content) {
      return res.status(400).json({
        'error': 'content parametr required'
      })
    }
    if (!topic) {
      return res.status(400).json({
        'error': 'topic parametr required'
      })
    }
    if (!await isEntityExist(client, 'Topic', topic)) {
      return res.status(400).json({
        'error': 'topic dosent exists'
      })
    }
    const postdata = await repo.createAndSave({
      content, topic, created: new Date()
    });
    return res.status(200).json(await postdata.getData())
  }

  const handleDelte = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    if (id) {
      const exists = await isEntityExist(client, entityName, id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      repo.remove(id as string);
    }
    return res.status(200).json({});
  }

  const handlePut = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query;
    const { content } = req.body;
    if (id) {
      const exists = await isEntityExist(client, entityName, id as string);
      if (!exists) {
        return res.status(404).json({});
      }
      let data = await repo.fetch(id as string);
      data.modified = new Date();
      if (content) {
        data.content = content;
      }
      repo.save(data);
      return res.status(200).json(await data.getData())
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
        'error': 'Operation not allowed!'
      })
  }
}
