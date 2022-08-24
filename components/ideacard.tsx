import { FunctionComponent } from "react"
import { FcLikePlaceholder } from "react-icons/fc"
import { Topic } from "../entity/topic"
import { Avatar } from "./avatar"
import Link from 'next/link';

export const IdeaCard: FunctionComponent<{ topic: any }> = ({ topic }) => {

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