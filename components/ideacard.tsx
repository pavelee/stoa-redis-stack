import { FunctionComponent, useEffect, useState } from "react"
import { FcLike, FcLikePlaceholder } from "react-icons/fc"
import { Topic } from "../entity/topic"
import { Avatar } from "./avatar"
import Link from 'next/link';
import { addLike, getLike, getTopic, removeLike } from "../services/api";

export const IdeaCard: FunctionComponent<{ t: any, u: any }> = ({ t, u }) => {
    const [topic, setTopic] = useState(t);
    const [isShowLikes, setIsShowLikes] = useState(false);
    // const [isLiked, setIsLiked] = useState(null);

    // const isTopicAlreadyLiked = async (topic: any) => {
    //     let like = await getLike('topic', topic.entityId);
    //     // console.log(like, like && like.objectid === topic.id);,
    //     setIsLiked(like && like.objectid === topic.id);
    // }

    // useEffect(() => {
    //     const loadIsTopicAlreadyLiked = async () => {
    //         await isTopicAlreadyLiked(topic);
    //     };
    //     loadIsTopicAlreadyLiked();
    // }, [])

    const toggleLike = async () => {
        if (topic.isLiked) {
            await removeLike('topic', topic.id);
            await refreshTopic();
        } else {
            await addLike('topic', topic.id);
            await refreshTopic();
        }
    }

    const doComment = async () => {
        
    }

    const refreshTopic = async () => {
        let data = await getTopic(t.id);
        if (data) {
            setTopic(data);
        }
    }

    return (
        <div className="bg-white shadow-xl rounded-lg cursor-pointer p-5">
            {/* <figure><img src="https://placeimg.com/1920/1080/arch" alt="Shoes" /></figure> */}
            <div className="flex gap-3">
                <div>
                    <Avatar user={topic.author} />
                </div>
                <div className="flex flex-col">
                    <div>{topic.author.name}</div>
                    <div className="text-gray-500">
                        <Link
                            href={`/topic/${topic.id}`}
                        >
                            <a className="bg-blue-100 p-1 rounded-xl shadow-sm">
                                {topic.created}
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 mt-3">
                <div>
                    <p>{topic.desc}</p>
                </div>
            </div>
            <div className="flex flex-row gap-3 mt-3 text-gray-500">
                <div className="(!isShowLikes ? 'hidden' : '')relative">
                    <span onClick={() => { setIsShowLikes(!isShowLikes) }}>{topic.likes.length} Polubień</span>
                    <div className={'bg-white border border-gray-200 rounded-xl shadow-sm absolute flex flex-col gap-3 p-3 w-80 overflow-scroll max-h-64 ' + (!isShowLikes ? 'hidden' : '')}>
                        <div onClick={() => { setIsShowLikes(false); }} className="text-right h-2">x</div>
                        {topic.likes.map(like => (
                            <div className="flex gap-3 justify-center items-center">
                                <div>
                                    <Avatar user={like.author} />
                                </div>
                                <div>
                                    {like.author.name}
                                </div>
                                <div className="text-gray-400">
                                    {like.created}
                                </div>
                            </div>
                        ))}
                    </div>
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
                <div className="text-3xl" onClick={() => { toggleLike() }}>
                    {!topic.isLiked && <FcLikePlaceholder />}
                    {topic.isLiked && <FcLike />}
                </div>
                <div>
                    {!topic.isLiked && <span>Do you support it?</span>}
                    {topic.isLiked && <span>You liked it!</span>}
                </div>
            </div>
            <hr className="mt-3 mb-3" />
            <div className="flex flex-col">
                <div>
                    {topic.comments.length <= 0 && <div className="flex justify-center items-center">
                        <span className="text-gray-500">Noone commented yet, be first! 🚀</span>
                    </div>}
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
                </div>
                <div>
                    <hr className="mt-3 mb-3" />
                </div>
                <div className="flex gap-3 justify-center items-center">
                    <Avatar user={u} />
                    <textarea className="bg-gray-100 flex-auto rounded-sm shadow-sm p-3"></textarea>
                    <button className="bg-blue-200 p-3 rounded-xl shadow-sm">comment</button>
                </div>
            </div>
        </div>
    )
}