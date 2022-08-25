import type { NextPage } from 'next'
import Image from 'next/image';
import { FunctionComponent } from 'react';
import { FiBell } from 'react-icons/fi'
import { FcLikePlaceholder } from 'react-icons/fc';
import { Topic } from '../entity/topic';
import { Logo } from '../components/logo';
import { PointCounter } from '../components/pointCounter';
import { NotificationBell } from '../components/notificationBell';
import { Avatar } from '../components/avatar';
import { IdeaCard } from '../components/ideacard';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../services/session';
import { useUser } from '../services/useUser';

const InputIdeaCard: FunctionComponent<{ placeholder: string }> = ({ placeholder = "What's on your mind?" }) => {
  return (
    <div className="bg-white shadow-xl p-5 rounded-xl">
      <div className="flex gap-5">
        {/* <Avatar /> */}
        <textarea className="flex-auto p-3 bg-gray-200 text-gray-600 rounded-xl h-14" placeholder={placeholder}></textarea>
      </div>
    </div>
  )
}

const Home: NextPage = ({ topics, user }: any) => {
  return (
    <>
      <div className="space-y-3">
        {
          topics.map((topic: Topic) => {
            return (
              <IdeaCard key={topic.entityId} topic={topic} user={user} />
            );
          })
        }
      </div>
    </>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic`)
  const data = await response.json()

  let user = null;
  if (req.session.user) {
    user = req.session.user;
  }

  return {
    props: {
      user: user,
      topics: data,
    }, // will be passed to the page component as props
  }
},
  sessionOptions)

export default Home
