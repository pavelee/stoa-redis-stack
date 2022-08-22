import type { NextPage } from 'next'
import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi'
import { FcLikePlaceholder, FcLike } from 'react-icons/fc';
import { Repository } from 'redis-om';
import { Comment } from '../entity/comment';
import { Topic, topicSchema } from '../entity/topic';
import { getRedisClient } from '../services/redis';
import { createRepository } from '../services/repositoryFactory';

const Avatar: FunctionComponent = ({ text = 'PC' }) => {
  return (
    <div className="cursor-pointer">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-14 h-14">
        {/* <span className="text-xl">{text}</span> */}
        <img className="rounded-full" src="https://placeimg.com/300/300/animals" />
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

const IdeaCard: FunctionComponent<{ topic: Topic }> = ({ topic }) => {

  return (
    <div className="bg-white shadow-xl rounded-lg cursor-pointer p-5">
      {/* <figure><img src="https://placeimg.com/1920/1080/arch" alt="Shoes" /></figure> */}
      <div className="flex gap-3">
        <div>
          <Avatar />
        </div>
        <div className="flex flex-col">
          <div>{topic.author.name}</div>
          <div className="text-gray-500">{topic.created}</div>
        </div>
      </div>
      <div className="flex gap-3 mt-3">
        <div>
          <p>{topic.desc}</p>
        </div>
      </div>
      <div className="flex flex-row gap-3 mt-3 text-gray-500">
        <div className="">
          0 Polubień
        </div>
        <div>
          {topic.comments.length} komentarze
        </div>
        <div>
          0 wyświetlenia
        </div>
      </div>
      <hr className="mt-3" />
      <div className="flex mt-3">
        <div className="text-3xl">
          <FcLikePlaceholder />
          {/* <FcLike /> */}
        </div>
      </div>
      <hr className="mt-3" />
      <div className="flex flex-col">
        {topic.comments.map((comment: Comment) => {
          return (<div className="flex gap-1 p-3">
            <div className="flex">
              <Avatar />
            </div>
            <div className="flex-auto">
              <div className="bg-gray-200 rounded-lg p-3">
                <div className="font-bold">Paweł Ciosek</div>
                <div>{comment.content}</div>
              </div>
              <div className="text-gray-400 text-sm">
                {comment.created}
              </div>
            </div>
          </div>)
        })}
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
                      <IdeaCard key={topic.entityId} topic={topic} />
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
  const fetchGlobalUser = async () => {
    r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/user?id=01GB3H6503G5N78AY0HZ7VB4TE`);
    d = await r.json()
    return d;
  }

  const fetchComments = async (topic: any) => {
    r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/comment?topic=${topic.elementId}`);
    d = await r.json()
    return d;
  }

  const fetchUser = async (topic: any) => {
    r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/user?id=${topic.author}`);
    d = await r.json()
    return d;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic`)
  const data = await res.json()

  let r, d = null;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    let comments = await fetchComments(element);
    let author = await fetchUser(element);
    element.comments = comments;
    element.author = author;
  }

  let user = await fetchGlobalUser();

  return {
    props: {
      user: user,
      topics: data,
    }, // will be passed to the page component as props
  }
}

export default Home
