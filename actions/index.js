"use server"

import { revalidatePath } from "next/cache";

export default async function revalidateData(id) {
    revalidatePath(`/preview/${id}`)
    revalidatePath(`/create/${id}`)
    revalidatePath('/', 'page')
}
