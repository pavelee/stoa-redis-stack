import type { NextPage } from 'next'
import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi'
import { Repository } from 'redis-om';
import { Topic } from '../entity/topic';
import { createRepository } from '../services/repositoryFactory';

const Avatar: FunctionComponent = ({ text = 'PC' }) => {
  return (
    <div className="avatar placeholder cursor-pointer">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-14 h-14">
        {/* <span className="text-xl">{text}</span> */}
        <img src="https://placeimg.com/300/300/animals" />
      </div>
    </div>
  )
}

const UserInfo: FunctionComponent = ({ }) => {
  return (<div className="card">
    <div className="card-body bg-base-100">
      <div className="flex justify-center items-center">
        <div className="flex-col">
          <div className="avatar placeholder cursor-pointer">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-36 h-36">
              {/* <span className="text-xl">{text}</span> */}
              <img src="https://placeimg.com/300/300/animals" />
            </div>
          </div>
          <div className="text-center text-2xl">
            Paweł Ciosek
          </div>
        </div>
      </div>
    </div>
  </div>);
}

const NotificationBell: FunctionComponent = ({ notifications = [] }) => {
  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn rounded-full text-2xl w-14 h-14">
        <FiBell />
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-24">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </div>
  )
}

const PointCounter: FunctionComponent = ({ }) => {
  return (
    <div className="w-14 h-14 bg-[#ffd700] rounded-full border-4 border-[#ccad00] flex justify-center items-center font-bold">
      0
    </div>
  )
}

const InputIdeaCard: FunctionComponent = ({ placeholder = "What's on your mind?" }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex gap-5">
          <Avatar />
          <textarea className="flex-auto textarea bg-gray-200 text-gray-600 rounded-xl h-14" placeholder={placeholder}></textarea>
          <button className="btn btn-active btn-primary">publish</button>
        </div>
      </div>
    </div>
  )
}

const IdeaCardWrapper: FunctionComponent<{ topic: Topic }> = ({ topic }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async (topic: Topic) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/comment?topic=${topic.entityId}`);
    const data = await res.json();
    setComments(data);
  }

  useEffect(() => {
    fetchComments(topic);
  }, [])

  return <IdeaCard topic={topic} comments={comments} />
}

const IdeaCard: FunctionComponent<{ topic: Topic, comments: Array<any> }> = ({ topic, comments }) => {

  return (
    <div className="card bg-base-100 shadow-xl cursor-pointer">
      {/* <figure><img src="https://placeimg.com/1920/1080/arch" alt="Shoes" /></figure> */}
      <div className="card-body">
        <div className="flex gap-3">
          <div>
            <Avatar />
          </div>
          <div>
            <h2 className="card-title">
              {topic.title}
              <div className="badge badge-secondary">Produkcja</div>
            </h2>
            <p>{topic.desc}</p>
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div className="">
            0 Polubień
          </div>
          <div>
            {comments.length} komentarze
          </div>
          <div>
            0 wyświetlenia
          </div>
        </div>
      </div>
    </div>
  )
}

const SideMenu: FunctionComponent = ({ }) => {
  return (
    <ul className="menu bg-base-100 rounded-xl">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
      <li><a>Item 3</a></li>
    </ul >
  )
}

const Home: NextPage = ({ topics }: any) => {
  console.log('asdas');
  return (
    <div className="h-screen">
      <div className="navbar">
        <div className="container mx-auto">
          <div className="flex rounded-b-sm w-full">
            <div className="shrink">
              <Image
                src={'/logo.svg'}
                width={64}
                height={64}
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-end items-center gap-5">
                <PointCounter />
                <NotificationBell />
                <Avatar />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 h-full p-5 md:p-0 md:pt-5">
        <div className="container mx-auto">
          <div className="flex gap-3">
            <div className="hidden md:block md:w-1/4 flex justify-center">
              <UserInfo />
              <div className="h-3"></div>
              <SideMenu />
            </div>
            <div className="w-full space-y-3 md:w-3/4 flex-col justify-center items-start">
              <InputIdeaCard />
              <div className="space-y-3">
                {
                  topics.map((topic: Topic) => {
                    return (
                      <IdeaCardWrapper key={topic.entityId} topic={topic} />
                    );
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic`)
  const data = await res.json()

  return {
    props: {
      topics: data
    }, // will be passed to the page component as props
  }
}

export default Home
