import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../services/session'
import { NextApiRequest, NextApiResponse } from 'next'
import { getRedisClient } from '../../services/redis';
import { userSchema } from '../../entity/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username } = await req.body

    try {
        let client = await getRedisClient();
        let repo = client.fetchRepository(userSchema);
        let user = await repo.search().where('username').eq(username).return.all();

        req.session.user = user
        await req.session.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export default withIronSessionApiRoute(handler, sessionOptions)