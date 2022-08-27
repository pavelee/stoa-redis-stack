import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { useUser } from "../services/useUser";
import Router from 'next/router'

const LoginPage: NextPage = () => {
    const [name, setName] = useState('');

    const { user, mutateUser } = useUser()

    useEffect(() => {
        if (user && user.id) {
            Router.push('/');
        }
    }, [user])


    const signin = async (ev: FormEvent<any>) => {
        ev.preventDefault();

        const body = {
            name: name,
        }

        try {
            mutateUser(
                await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
            )
        } catch (error) {
            console.error('An unexpected error happened:', error)
        }
    }

    return (<>
        <div className="flex justify-center">
            <form className="" onSubmit={async (ev) => { await signin(ev); }}>
                <div>
                    <input required type="text" onChange={(ev) => { setName(ev.target.value) }} />
                </div>
                <div>
                    <input type="submit" />
                </div>
            </form>
        </div>
    </>)
}

export default LoginPage;