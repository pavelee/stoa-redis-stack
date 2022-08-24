import { FunctionComponent } from "react"
import { User } from "../entity/user"

export const Avatar: FunctionComponent<{ user: User }> = ({ user }) => {
    return (
        <div className="cursor-pointer">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
                {/* <span className="text-xl">{text}</span> */}
                {
                    user && <img className="rounded-full" src={user.avatar} />
                }
            </div>
        </div>
    )
}