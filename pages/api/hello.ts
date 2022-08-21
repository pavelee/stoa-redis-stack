// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, Repository } from 'redis-om';
import { topicSchema } from '../../entity/topic';
import { redisClient } from '../../services/redis';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let redisUrl = process.env.REDIS_URL as string;
  let client = await redisClient(redisUrl);

  await client.set('bar', 'foo')
  const value = await client.execute(['GET', 'bar'])
  // [ 'bar', 'baz', 'qux', '42' ]
  const topicRepo = client.fetchRepository(topicSchema);
  // const topic = await topicRepo.createAndSave({
  //   desc: 'We are serious!'
  // })
  // console.log(topic.entityId);
  await topicRepo.createIndex();
  const topics = await topicRepo.search().return.all();
  console.log(topics);  
  for (let index = 0; index < topics.length; index++) {
    const topic = topics[index];
    console.log(`removing topic: ${topic.entityId}`)
    topicRepo.remove(topic.entityId)
  }
  await client.close();
  res.status(200).json({ name: value })
}
