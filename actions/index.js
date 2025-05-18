"use server"

import { revalidatePath } from "next/cache";

export default async function revalidateData() {
    revalidatePath('/preview/${id}', 'page')
    revalidatePath('/create/${id}', 'page')
    revalidatePath('/', 'page')
}
