import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";
import { IdeaCard } from "../../components/ideacard";
import { sessionOptions } from "../../services/session";
import { useRouter } from 'next/router'

const TopicPage: NextPage = ({ topic, user }: any) => {
    return (
        <>
            <IdeaCard topic={topic} user={user} />
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
}) {
    let splited = req.url.split('/');
    console.log(splited[2]);
    const id = splited[2];
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic?id=${id}`)
    const data = await response.json()

    let user = null;
    if (req.session.user) {
        user = req.session.user;
    }

    return {
        props: {
            user: user,
            topic: data ? data[0] : null,
        }, // will be passed to the page component as props
    }
},
    sessionOptions)

export default TopicPage;