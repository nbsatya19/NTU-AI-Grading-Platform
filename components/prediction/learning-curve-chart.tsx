"use client"

import type { LearningPrediction } from "@/types/prediction"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"

interface LearningCurveChartProps {
  data: LearningPrediction["predictedLearningCurve"]
}

export function LearningCurveChart({ data }: LearningCurveChartProps) {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // 차트 데이터 준비
  const chartData = data.map((item) => ({
    date: formatDate(item.date),
    level: Number.parseFloat(item.predictedLevel.toFixed(1)),
    lowerBound: Number.parseFloat(item.lowerBound.toFixed(1)),
    upperBound: Number.parseFloat(item.upperBound.toFixed(1)),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        
        <YAxis />
        <Tooltip formatter={(value) => [`${value}`, "레벨"]} labelFormatter={(label) => `날짜: ${label}`} />
        
        <Area
          type="monotone"
          dataKey="upperBound"
          stroke="transparent"
          fill="#4f46e5"
          fillOpacity={0.1}
          name="상한 예측"
        />
        <Area
          type="monotone"
          dataKey="lowerBound"
          stroke="transparent"
          fill="#4f46e5"
          fillOpacity={0.1}
          name="하한 예측"
        />
        <Line
          type="monotone"
          dataKey="level"
          stroke="#4f46e5"
          strokeWidth={2}
          name="예상 레벨"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
