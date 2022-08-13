import type { NextPage } from 'next'
import Image from 'next/image';
import { FunctionComponent } from 'react';
import { FiBell } from 'react-icons/fi'

const Avatar: FunctionComponent = ({ text = 'PC' }) => {
  return (
    <div className="avatar placeholder cursor-pointer">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-14 h-14">
        <span className="text-xl">{text}</span>
      </div>
    </div>
  )
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

const IdeaCard: FunctionComponent = ({ }) => {
  return (
    <div className="card bg-base-100 shadow-xl cursor-pointer">
      {/* <figure><img src="https://placeimg.com/1920/1080/arch" alt="Shoes" /></figure> */}
      <div className="card-body">
        <div className="flex gap-5">
          <div className="flex-col">
            <div className="">
              10 Polubień
            </div>
            <div>
              2 komentarze
            </div>
          </div>
          <div>
            <h2 className="card-title">
              Ekspres kawy na trzecim piętrze
              <div className="badge badge-secondary">Produkcja</div>
            </h2>
            <p>Brakuje nam eskpresu na trzecim piętrze. Biegamy po schodach z kawą!</p>
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

const Home: NextPage = () => {
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
              <SideMenu />
            </div>
            <div className="w-full md:w-3/4 flex-col justify-center items-start">
              <InputIdeaCard />
              <div className="h-5"></div>
              <IdeaCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
