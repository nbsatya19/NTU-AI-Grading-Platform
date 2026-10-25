"use client"

import type { CompletionPrediction } from "@/types/prediction"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, CheckCircleIcon } from "lucide-react"

interface CoursePredictionListProps {
  data: CompletionPrediction[]
}

export function CoursePredictionList({ data }: CoursePredictionListProps) {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // 남은 일수 계산 함수
  const getDaysRemaining = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4">
      {data.map((course) => {
        const progressPercent = course.currentProgress * 100
        const daysRemaining = getDaysRemaining(course.predictedCompletionDate)

        return (
          <Card key={course.courseId} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium">{course.courseName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>예상 완료일: {formatDate(course.predictedCompletionDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {daysRemaining > 0 ? `${daysRemaining}일 남음` : "완료 예정일 지남"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (신뢰도: {(course.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">진행 상황</span>
                  <span className="text-sm font-medium">{progressPercent.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>
                  현재 진행 속도를 유지하면
                  <span className="font-medium text-foreground"> {formatDate(course.predictedCompletionDate)}</span>에
                  이 코스를 완료할 것으로 예상됩니다.
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
