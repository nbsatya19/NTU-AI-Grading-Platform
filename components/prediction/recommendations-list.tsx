"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircleIcon, TrendingUpIcon, BookOpenIcon, ClockIcon, BrainIcon } from "lucide-react"

interface RecommendationsListProps {
  recommendations: string[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  // 아이콘 선택 함수
  const getIconForRecommendation = (recommendation: string, index: number) => {
    if (recommendation.includes("능력") || recommendation.includes("스킬")) {
      return <BrainIcon className="h-5 w-5 text-blue-500" />
    } else if (recommendation.includes("시간")) {
      return <ClockIcon className="h-5 w-5 text-amber-500" />
    } else if (recommendation.includes("학습") || recommendation.includes("영역")) {
      return <BookOpenIcon className="h-5 w-5 text-emerald-500" />
    } else if (recommendation.includes("향상") || recommendation.includes("늘려")) {
      return <TrendingUpIcon className="h-5 w-5 text-purple-500" />
    } else {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIconForRecommendation(recommendation, index)}</div>
              <div>
                <p className="font-medium">{recommendation}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {getRecommendationDescription(recommendation, index)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// 추천 설명 생성 함수
function getRecommendationDescription(recommendation: string, index: number): string {
  if (recommendation.includes("능력 향상")) {
    return "이 영역에 집중하면 전체적인 언어 능력 향상에 큰 도움이 됩니다."
  } else if (recommendation.includes("영역을 더 학습")) {
    return "이 영역은 현재 가장 개선이 필요한 부분입니다."
  } else if (recommendation.includes("학습 시간")) {
    return "꾸준한 학습 시간 증가는 장기적인 성취도 향상에 중요합니다."
  } else if (recommendation.includes("대화 연습")) {
    return "실제 대화 연습은 언어 유창성을 크게 향상시킵니다."
  } else if (recommendation.includes("어휘 복습")) {
    return "어휘 복습 빈도를 높이면 장기 기억에 도움이 됩니다."
  } else {
    return "이 추천 사항은 AI 분석을 기반으로 개인화되었습니다."
  }
}
