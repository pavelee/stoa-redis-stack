import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";
import { IdeaCard } from "../../components/ideacard";
import { sessionOptions } from "../../services/session";
import { useRouter } from 'next/router'
import { fetchData } from "../../entity/topic";

const TopicPage: NextPage = ({ topic, user }: any) => {
    return (
        <>
            <IdeaCard t={topic} u={user} />
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async function ({
    req,
    res,
}) {
    let splited = req.url.split('/');
    const id = splited[2];
    const data = await fetchData(id, req.session.user);

    let user = null;
    if (req.session.user) {
        user = req.session.user;
    }

    return {
        props: {
            user: user,
            topic: data,
        }, // will be passed to the page component as props
    }
},
    sessionOptions)

export default TopicPage;