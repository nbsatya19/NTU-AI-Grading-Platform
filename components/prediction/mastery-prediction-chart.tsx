"use client"

import type { MasteryPrediction } from "@/types/prediction"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts"

interface MasteryPredictionChartProps {
  data: MasteryPrediction[]
}

export function MasteryPredictionChart({ data }: MasteryPredictionChartProps) {
  // 레이더 차트 데이터 준비
  const radarData = data.map((item) => ({
    subject: item.category,
    현재: Number.parseFloat((item.currentMastery * 100).toFixed(0)),
    예측: Number.parseFloat((item.predictedMastery * 100).toFixed(0)),
    fullMark: 100,
  }))

  return (
    <div className="space-y-6">
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="현재 숙련도" dataKey="현재" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
            <Radar name="예상 숙련도" dataKey="예측" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((mastery) => {
          const currentPercent = mastery.currentMastery * 100
          const predictedPercent = mastery.predictedMastery * 100
          const improvement = predictedPercent - currentPercent

          return (
            <Card key={mastery.category} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{mastery.category}</h3>
                  <span className="text-sm text-muted-foreground">{mastery.timeframe}일 예측</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">현재 숙련도</span>
                      <span className="text-sm font-medium">{currentPercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={currentPercent} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">예상 숙련도</span>
                      <span className="text-sm font-medium">{predictedPercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={predictedPercent} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <span className="font-medium">
                      {improvement > 0
                        ? `+${improvement.toFixed(0)}% 향상 예상`
                        : `${improvement.toFixed(0)}% 변화 예상`}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      (신뢰도: {(mastery.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
