"use client"

import type { LearningPrediction } from "@/types/prediction"
import { Progress } from "@/components/ui/progress"

interface OverallProgressChartProps {
  data: LearningPrediction["overallProgress"]
}

export function OverallProgressChart({ data }: OverallProgressChartProps) {
  const currentPercent = data.current * 100
  const predicted30DaysPercent = data.predicted30Days * 100
  const predicted90DaysPercent = data.predicted90Days * 100

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Recently</span>
            <span className="font-medium">{currentPercent.toFixed(0)}%</span>
          </div>
          <Progress value={currentPercent} className="h-3" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">30 days</span>
            <span className="font-medium">{predicted30DaysPercent.toFixed(0)}%</span>
          </div>
          <Progress value={predicted30DaysPercent} className="h-3" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">90 days</span>
            <span className="font-medium">{predicted90DaysPercent.toFixed(0)}%</span>
          </div>
          <Progress value={predicted90DaysPercent} className="h-3" />
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="font-medium mb-1">test</h4>
            
          </div>
          <div className="text-2xl font-bold">{(data.confidence * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {(predicted30DaysPercent - currentPercent).toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">test</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {(predicted90DaysPercent - currentPercent).toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">test
</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(((predicted90DaysPercent - currentPercent) / 90) * 100) / 100}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">test</div>
        </div>
      </div>
    </div>
  )
}
