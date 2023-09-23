import { redirect } from "@sveltejs/kit"

export async function load({ cookies }) {
    cookies.delete('token')
    throw redirect(301, '/')
}
