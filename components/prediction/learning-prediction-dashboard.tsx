"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { LearningPrediction, PredictionModelParams } from "@/types/prediction"
import { generateLearningPrediction } from "@/lib/prediction-model-service"
import { SkillPredictionChart } from "./skill-prediction-chart"
import { CoursePredictionList } from "./course-prediction-list"
import { MasteryPredictionChart } from "./mastery-prediction-chart"
import { LearningCurveChart } from "./learning-curve-chart"
import { RecommendationsList } from "./recommendations-list"
import { OverallProgressChart } from "./overall-progress-chart"
import { Users } from "lucide-react"

interface Student {
  id: string
  name: string
  studentId: string
  course: string
}

interface LearningPredictionDashboardProps {
  userId: string
  initialTimeframe?: number
}

export function LearningPredictionDashboard({ userId, initialTimeframe = 90 }: LearningPredictionDashboardProps) {
  const [prediction, setPrediction] = useState<LearningPrediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState(initialTimeframe)
  const [selectedStudent, setSelectedStudent] = useState<string>("average")
  const [students] = useState<Student[]>(mockStudents)

  const fetchPrediction = async () => {
    setLoading(true)
    setError(null)

    try {
      const params: PredictionModelParams = {
        userId: selectedStudent === "average" ? userId : selectedStudent,
        timeframe,
        includeSkills: true,
        includeCourses: true,
        includeMastery: true,
        includeRecommendations: true,
      }

      const data = await generateLearningPrediction(params)
      setPrediction(data)
    } catch (err) {
      console.error("Failed to fetch prediction data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrediction()
  }, [userId, timeframe, selectedStudent])

  const handleTimeframeChange = (newTimeframe: number) => {
    setTimeframe(newTimeframe)
  }

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId)
  }

  const selectedStudentInfo = selectedStudent === "average" ? null : students.find((s) => s.id === selectedStudent)

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Error Occurred</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Performance Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            AI-powered analysis of student performance patterns and future achievement predictions.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedStudent} onValueChange={handleStudentChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">
                  <div className="flex items-center space-x-2">
                    <span>Average Student Performance</span>
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  </div>
                </SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {student.studentId} • {student.course}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={timeframe === 30 ? "default" : "outline"}
              onClick={() => handleTimeframeChange(30)}
              className={timeframe === 30 ? "bg-primary text-primary-foreground" : ""}
            >
              30 Days
            </Button>
            <Button
              variant={timeframe === 90 ? "default" : "outline"}
              onClick={() => handleTimeframeChange(90)}
              className={timeframe === 90 ? "bg-primary text-primary-foreground" : ""}
            >
              90 Days
            </Button>
            <Button
              variant={timeframe === 180 ? "default" : "outline"}
              onClick={() => handleTimeframeChange(180)}
              className={timeframe === 180 ? "bg-primary text-primary-foreground" : ""}
            >
              180 Days
            </Button>
          </div>
        </div>
      </div>

      {selectedStudentInfo && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{selectedStudentInfo.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Student ID: {selectedStudentInfo.studentId} • Course: {selectedStudentInfo.course}
                </p>
              </div>
              <Badge variant="outline" className="bg-background">
                Individual Analysis
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </div>
      ) : prediction ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance History</CardTitle>
                <CardDescription>
                  {selectedStudent === "average"
                    ? `Average student progress and expected progress after ${timeframe} days`
                    : `${selectedStudentInfo?.name}'s current progress and expected progress after ${timeframe} days`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OverallProgressChart data={prediction.overallProgress} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Curve History</CardTitle>
                <CardDescription>Expected performance curve over the next {timeframe} days</CardDescription>
              </CardHeader>
              <CardContent>
                <LearningCurveChart data={prediction.predictedLearningCurve} />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="skills">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="skills">Assessment Skills</TabsTrigger>
              <TabsTrigger value="courses">Course Completion</TabsTrigger>
              <TabsTrigger value="mastery">Mastery Prediction</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Skills Prediction</CardTitle>
                  <CardDescription>
                    Current level and expected level after {timeframe} days for each assessment type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillPredictionChart data={prediction.skillPredictions} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Course Completion Prediction</CardTitle>
                  <CardDescription>Expected completion schedule for courses in progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <CoursePredictionList data={prediction.completionPredictions} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mastery">
              <Card>
                <CardHeader>
                  <CardTitle>Mastery Prediction</CardTitle>
                  <CardDescription>
                    Current mastery and expected mastery after {timeframe} days for each learning area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MasteryPredictionChart data={prediction.masteryPredictions} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Learning Recommendations</CardTitle>
                  <CardDescription>AI-based personalized learning recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationsList recommendations={prediction.recommendedFocus} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Data</CardTitle>
            <CardDescription>Unable to load prediction data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchPrediction}>Try Again</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const mockStudents: Student[] = [
  { id: "s001", name: "Alice Chen", studentId: "S001234", course: "Business Fundamentals" },
  { id: "s002", name: "Bob Wilson", studentId: "S001235", course: "Business Fundamentals" },
  { id: "s003", name: "Carol Zhang", studentId: "S001236", course: "Business Fundamentals" },
  { id: "s004", name: "David Kumar", studentId: "S001237", course: "Financial Accounting" },
  { id: "s005", name: "Emma Rodriguez", studentId: "S001238", course: "Financial Accounting" },
  { id: "s006", name: "Frank Liu", studentId: "S001239", course: "Organizational Behavior" },
  { id: "s007", name: "Grace Park", studentId: "S001240", course: "Organizational Behavior" },
  { id: "s008", name: "Henry Tan", studentId: "S001241", course: "Corporate Finance" },
  { id: "s009", name: "Iris Wong", studentId: "S001242", course: "Marketing Management" },
  { id: "s010", name: "Jack Singh", studentId: "S001243", course: "Operations Management" },
]
