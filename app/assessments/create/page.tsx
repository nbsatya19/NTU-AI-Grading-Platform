"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bot, Plus, Trash2, Lightbulb } from "lucide-react"

interface Question {
  id: string
  text: string
  points: number
  type: "essay" | "short-answer" | "multiple-choice"
}

export default function CreateAssessment() {
  const [assessmentData, setAssessmentData] = useState({
    title: "",
    course: "",
    type: "",
    dueDate: "",
    dueTime: "",
    description: "",
    totalPoints: 100,
    aiGradingEnabled: true,
    aiRubricGeneration: true,
    aiQuestionGeneration: false,
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [rubricCriteria, setRubricCriteria] = useState([
    { id: "1", name: "Content Knowledge", weight: 40 },
    { id: "2", name: "Critical Thinking", weight: 30 },
    { id: "3", name: "Communication", weight: 30 },
  ])

  const courses = [
    { id: "cor101", name: "COR101 - Business Fundamentals" },
    { id: "acc101", name: "ACC101 - Financial Accounting" },
    { id: "mgmt201", name: "MGMT201 - Organizational Behavior" },
    { id: "fin301", name: "FIN301 - Corporate Finance" },
  ]

  const assessmentTypes = [
    { value: "final-exam", label: "Final Exam" },
    { value: "midterm", label: "Mid-term Exam" },
    { value: "quiz", label: "Big Quiz" },
    { value: "assignment", label: "Assignment" },
    { value: "project", label: "Project" },
  ]

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      points: 10,
      type: "essay",
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const generateAIQuestions = () => {
    // Simulate AI question generation
    const aiQuestions: Question[] = [
      {
        id: Date.now().toString(),
        text: "Analyze the key principles of business fundamentals and their application in modern organizations.",
        points: 25,
        type: "essay",
      },
      {
        id: (Date.now() + 1).toString(),
        text: "Compare and contrast different organizational structures and their impact on business performance.",
        points: 20,
        type: "essay",
      },
    ]
    setQuestions([...questions, ...aiQuestions])
  }

  const generateAIRubric = () => {
    // Simulate AI rubric generation
    setRubricCriteria([
      { id: "1", name: "Content Accuracy", weight: 35 },
      { id: "2", name: "Analysis Depth", weight: 25 },
      { id: "3", name: "Evidence Usage", weight: 20 },
      { id: "4", name: "Writing Quality", weight: 20 },
    ])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Create New Assessment</h1>
        <p className="text-muted-foreground text-lg">
          Set up a new assessment with AI-powered grading and rubric generation.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mid-term Examination"
                  value={assessmentData.title}
                  onChange={(e) => setAssessmentData({ ...assessmentData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={assessmentData.course}
                  onValueChange={(value) => setAssessmentData({ ...assessmentData, course: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Assessment Type</Label>
                <Select
                  value={assessmentData.type}
                  onValueChange={(value) => setAssessmentData({ ...assessmentData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={assessmentData.dueDate}
                  onChange={(e) => setAssessmentData({ ...assessmentData, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={assessmentData.dueTime}
                  onChange={(e) => setAssessmentData({ ...assessmentData, dueTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide instructions and context for this assessment..."
                value={assessmentData.description}
                onChange={(e) => setAssessmentData({ ...assessmentData, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistance Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI-Powered Grading</Label>
                <p className="text-sm text-muted-foreground">Enable automatic grading with AI assistance</p>
              </div>
              <Switch
                checked={assessmentData.aiGradingEnabled}
                onCheckedChange={(checked) => setAssessmentData({ ...assessmentData, aiGradingEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Rubric Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Generate rubric criteria automatically based on assessment content
                </p>
              </div>
              <Switch
                checked={assessmentData.aiRubricGeneration}
                onCheckedChange={(checked) => setAssessmentData({ ...assessmentData, aiRubricGeneration: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Question Generation</Label>
                <p className="text-sm text-muted-foreground">
                  Generate questions based on course materials and learning objectives
                </p>
              </div>
              <Switch
                checked={assessmentData.aiQuestionGeneration}
                onCheckedChange={(checked) => setAssessmentData({ ...assessmentData, aiQuestionGeneration: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions</CardTitle>
              <div className="flex gap-2">
                {assessmentData.aiQuestionGeneration && (
                  <Button variant="outline" onClick={generateAIQuestions}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate AI Questions
                  </Button>
                )}
                <Button onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No questions added yet. Click "Add Question" to get started.
              </p>
            ) : (
              questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Question {index + 1}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Question Text</Label>
                      <Textarea
                        placeholder="Enter your question..."
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(question.id, "points", Number.parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => updateQuestion(question.id, "type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="essay">Essay</SelectItem>
                            <SelectItem value="short-answer">Short Answer</SelectItem>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Rubric */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Grading Rubric</CardTitle>
              {assessmentData.aiRubricGeneration && (
                <Button variant="outline" onClick={generateAIRubric}>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate AI Rubric
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rubricCriteria.map((criteria) => (
                <div key={criteria.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{criteria.name}</span>
                  <Badge variant="secondary">{criteria.weight}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Save as Draft</Button>
          <Button>Create Assessment</Button>
        </div>
      </div>
    </div>
  )
}
