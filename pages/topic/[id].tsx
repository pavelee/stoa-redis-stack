import { NextPage } from "next";
import { IdeaCard } from "../../components/ideacard";

const TopicPage: NextPage = ({ topic }: any) => {
    return (
        <>
            <IdeaCard topic={topic} />
        </>
    )
}

export async function getServerSideProps(context: any) {
    const { id } = context.query;

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/topic?id=${id}`)
    const data = await res.json()

    return {
        props: {
            topic: data[0],
        }, // will be passed to the page component as props
    }
}

export default TopicPage;