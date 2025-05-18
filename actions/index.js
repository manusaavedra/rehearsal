"use server"

import { revalidatePath } from "next/cache";

export default async function revalidateData(id) {
    revalidatePath(`/preview/${id}`, 'page')
    revalidatePath(`/create/${id}`, 'page')
    revalidatePath('/', 'page')
}
