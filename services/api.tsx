
export const logout = async () => {
    let r = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}/api/logout`);
    let d = await r.json()
    return d;
}