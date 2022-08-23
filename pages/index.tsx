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

const Avatar: FunctionComponent = ({ user, text = 'PC' }: any) => {
  return (
    <div className="cursor-pointer">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
        {/* <span className="text-xl">{text}</span> */}
        <img className="rounded-full" src={user.avatar} />
      </div>
    </div>
  )
}

const UserInfo: FunctionComponent = ({ }) => {
  return (
    <div className="bg-white flex justify-center items-center rounded-xl shadow-xl p-5">
      <div className="flex-col">
        <div className="cursor-pointer">
          <div className="bg-neutral-focus text-neutral-content w-36 h-36">
            {/* <span className="text-xl">{text}</span> */}
            <img className="rounded-full" src="https://placeimg.com/300/300/animals" />
          </div>
        </div>
        <div className="text-center text-2xl">
          Paweł Ciosek
        </div>
      </div>
    </div>
  );
}

const NotificationBell: FunctionComponent = ({ notifications = [] }) => {
  return (
    <div className="dropdown border border-black p-3 rounded-full">
      <label tabIndex={0} className="btn rounded-full text-2xl w-14 h-14">
        <FiBell />
      </label>
      <ul tabIndex={0} className="hidden">
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
      </ul>
    </div>
  )
}

const PointCounter: FunctionComponent = ({ }) => {
  return (
    <div className="w-12 h-12 bg-[#ffd700] rounded-full border-4 border-[#ccad00] flex justify-center items-center font-bold">
      0
    </div>
  )
}

const InputIdeaCard: FunctionComponent = ({ placeholder = "What's on your mind?" }) => {
  return (
    <div className="bg-white shadow-xl p-5 rounded-xl">
      <div className="flex gap-5">
        {/* <Avatar /> */}
        <textarea className="flex-auto p-3 bg-gray-200 text-gray-600 rounded-xl h-14" placeholder={placeholder}></textarea>
      </div>
    </div>
  )
}

const IdeaCard: FunctionComponent<{ topic: any }> = ({ topic }) => {

  return (
    <div className="bg-white shadow-xl rounded-lg cursor-pointer p-5">
      {/* <figure><img src="https://placeimg.com/1920/1080/arch" alt="Shoes" /></figure> */}
      <div className="flex gap-3">
        <div>
          <Avatar user={topic.author} />
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
          {topic.likes.length} Polubień
        </div>
        <div>
          {topic.comments.length} komentarze
        </div>
        <div>
          0 wyświetlenia
        </div>
      </div>
      <hr className="mt-3" />
      <div className="flex mt-3 gap-5 items-center">
        <div className="text-3xl">
          <FcLikePlaceholder />
          {/* <FcLike /> */}
        </div>
        <div>
          <button className="bg-blue-100 p-1 rounded-xl shadow-sm">wyświetl</button>
        </div>
      </div>
      <hr className="mt-3" />
      <div className="flex flex-col">
        {topic.comments.map((comment: any) => {
          return (
          <div className="flex gap-1 p-3">
            <div className="flex">
              <Avatar user={comment.author} />
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
        <div className="flex justify-center items-center">
          <button className="bg-blue-200 p-3 rounded-xl shadow-sm">skomentuj</button>
        </div>
      </div>
    </div>
  )
}

const SideMenu: FunctionComponent = ({ }) => {
  return (
    <ul className="bg-white rounded-xl p-5">
      <li><a>Item 1</a></li>
      <li><a>Item 2</a></li>
      <li><a>Item 3</a></li>
    </ul >
  )
}

const Home: NextPage = ({ topics, user }: any) => {
  return (
    <div className="h-screen">
      <div className="bg-white">
        <div className="container mx-auto p-3">
          <div className="flex rounded-b-sm w-full items-center">
            <div className="shrink">
              <Image
                src={'/logo.svg'}
                width={64}
                height={64}
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-end items-center gap-5">
                <div className="flex justify-center items-center">
                  <button className="bg-blue-400 text-white p-3 shadow-sm rounded-xl font-bold">Zacznij nowy temat</button>
                </div>
                <PointCounter />
                <NotificationBell />
                <Avatar user={user} />
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
  let r, d = null;

  const fetchGlobalUser = async () => {
    r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/user?id=01GB63BZ8WX8E62WKW3AFDF93K`);
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

  // let r, d = null;
  // for (let index = 0; index < data.length; index++) {
  //   const element = data[index];
  //   let comments = await fetchComments(element);
  //   let author = await fetchUser(element);
  //   element.comments = comments;
  //   element.author = author;
  //   console.log(element);
  // }

  let user = await fetchGlobalUser();

  return {
    props: {
      user: user,
      topics: data,
    }, // will be passed to the page component as props
  }
}

export default Home
