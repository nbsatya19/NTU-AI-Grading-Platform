import ClientPage from "./client-page"
import { COURSE_IDS } from "@/lib/static-params"

export function generateStaticParams() {
  return COURSE_IDS.map((courseId) => ({ courseId }))
}

export default function Page({ params }: { params: { courseId: string } }) {
  return <ClientPage params={params} />
}
