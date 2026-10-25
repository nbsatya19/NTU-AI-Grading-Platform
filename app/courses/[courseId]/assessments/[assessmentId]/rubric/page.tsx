import ClientPage from "./client-page"
import { ASSESSMENT_IDS, COURSE_IDS } from "@/lib/static-params"

export function generateStaticParams() {
  return COURSE_IDS.flatMap((courseId) => ASSESSMENT_IDS.map((assessmentId) => ({ courseId, assessmentId })))
}

export default function Page({ params }: { params: { courseId: string; assessmentId: string } }) {
  return <ClientPage params={params} />
}
