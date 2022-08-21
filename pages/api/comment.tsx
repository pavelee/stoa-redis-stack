// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { commentSchema } from '../../entity/comment';
import { getRedisClient } from '../../services/redis';

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let method = req.method;
  switch (method) {
    case 'GET':
      const { topic } = req.query;
      let client = await getRedisClient();
      let repo = client.fetchRepository(commentSchema);
      const search = repo.search();
      if (topic) {
        search.where('topic').eq(topic as string);
      }
      const data = await search.return.all();
      return res.status(200).json(data)
    default:
      res.status(400).json({
        'error': 'asdas'
      })
  }
}
