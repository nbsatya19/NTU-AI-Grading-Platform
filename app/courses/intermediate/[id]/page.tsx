import ClientPage from "./client-page"
import { LEVEL_COURSE_IDS } from "@/lib/static-params"

export function generateStaticParams() {
  return LEVEL_COURSE_IDS.map((id) => ({ id }))
}

export default function Page({ params }: { params: { id: string } }) {
  return <ClientPage params={params} />
}
