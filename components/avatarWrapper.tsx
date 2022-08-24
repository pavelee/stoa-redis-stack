import { FunctionComponent } from "react"
import { useUser } from "../services/useUser"
import { Avatar } from "./avatar";

export const AvatarWrapper: FunctionComponent<{}> = ({ }) => {
    const { user } = useUser();
    return (
        <div className="cursor-pointer">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
                {/* <span className="text-xl">{text}</span> */}
                {
                    user && <Avatar user={user} />
                }
            </div>
        </div>
    )
}