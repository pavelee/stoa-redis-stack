import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { Logo } from '../components/logo';
import { PointCounter } from '../components/pointCounter';
import { NotificationBell } from '../components/notificationBell';
import { FunctionComponent, useState } from 'react';
import { useUser } from '../services/useUser';
import { Avatar } from '../components/avatar';
import Link from 'next/link';
import { logout } from '../services/api';
import Router from 'next/router'

const UserInfo: FunctionComponent<{ user: any }> = ({ user }) => {
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
          { user.name }
        </div>
      </div>
    </div>
  );
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

const AvatarMenu: FunctionComponent<{user: any, doLogout: any}> = ({ user, doLogout }) => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  return (<>
    {
      user &&
      <div className="relative">
        <div onClick={() => { setIsShowMenu(!isShowMenu); }}>
          <Avatar user={user} />
        </div>
        <div className={'bg-white p-5 border rounded-xl -left-10 border-black absolute ' + (!isShowMenu ? 'hidden' : '')}>
          <div className="text-blue-600 cursor-pointer" onClick={() => { doLogout() }}>singout</div>
        </div>
      </div>
    }
    {
      !user && <Link href={'/login'}><a className="bg-blue-200 p-2 rounded-xl shadow-sm">Sign in</a></Link>
    }
  </>)
}

function MyApp({ Component, pageProps }: AppProps) {

  const doLogout = async () => {
    await logout();
    Router.reload();
  }

  const { user } = useUser();
  return (
    <div>
      <Head>
        <title>Stoa</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="h-screen min-h-full">
        <div className="bg-white">
          <div className="container mx-auto p-3">
            <div className="flex rounded-b-sm w-full items-center">
              <div className="shrink">
                <Logo imagePath={'/logo.svg'} size={64} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-end items-center gap-5">
                  <div className="flex justify-center items-center">
                    <button className="bg-blue-400 text-white p-3 shadow-sm rounded-xl font-bold">Zacznij nowy temat</button>
                  </div>
                  <PointCounter />
                  <NotificationBell notifications={[]} />
                  <AvatarMenu user={user} doLogout={doLogout} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 h-full p-5 md:p-0 md:pt-5">
          <div className="container mx-auto">
            <div className="flex gap-3">
              <div className="hidden md:block md:w-1/4 flex justify-center">
                {user && <UserInfo user={user} />}
                <div className="bg-white flex justify-center items-center p-5">
                  {
                    !user && <Link href={'/login'}><a className="bg-blue-200 p-2 rounded-xl shadow-sm">Sign in</a></Link>
                  }
                </div>
                <div className="h-3"></div>
                <SideMenu />
              </div>
              <div className="w-full space-y-3 md:w-3/4 flex-col justify-center items-start">
                <Component {...pageProps} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  let r, d = null;

  const fetchGlobalUser = async () => {
    r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/user?id=01GB63BZ8WX8E62WKW3AFDF93K`);
    d = await r.json()
    return d;
  }

  let user = await fetchGlobalUser();

  return {
    props: {
      user: user,
    }, // will be passed to the page component as props
  }
}

export default MyApp
