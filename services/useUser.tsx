import { useEffect, useState } from "react"

export const useUser = () => {
    const [user, setUser] = useState(null);

    const fetchGlobalUser = async () => {
        let r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/user?id=01GB6631KMCW04WT2GXEEZVXAN`);
        let d = await r.json()
        return d;
    }

    useEffect(() => {
        const loadUser = async () => {
            let u = await fetchGlobalUser();
            setUser(u);
        }
        loadUser();
    }, [])


    return { user };
}