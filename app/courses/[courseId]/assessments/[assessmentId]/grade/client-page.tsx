"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { SmartCorrectionNotification } from "@/components/grading/smart-correction-notification"
import { CheckCircle, AlertCircle, Clock, Eye, Download, FileText, Users, Search, Edit3 } from "lucide-react"

interface GradingWorkbenchProps {
  params: {
    courseId: string
    assessmentId: string
  }
}

interface StudentSubmission {
  id: string
  studentId: string
  studentName: string
  answerPreview: string
  aiSuggestedGrade: number
  aiSuggestedFeedback: string
  instructorGrade: number
  instructorFeedback: string
  status: "needs-review" | "approved" | "in-progress"
  submissionUrl: string
  lastModified: string
}

export default function GradingWorkbench({ params }: GradingWorkbenchProps) {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(mockSubmissions)
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [aiGradeMin, setAiGradeMin] = useState<string>("")
  const [aiGradeMax, setAiGradeMax] = useState<string>("")
  const [finalGradeMin, setFinalGradeMin] = useState<string>("")
  const [finalGradeMax, setFinalGradeMax] = useState<string>("")
  const [showCorrectionNotification, setShowCorrectionNotification] = useState(false)
  const [lastCorrectionType, setLastCorrectionType] = useState<string>("")

  const assessment = getAssessmentById(params.assessmentId)
  const course = getCourseById(params.courseId)

  if (!assessment || !course) {
    return <div>Assessment or course not found</div>
  }

  const handleGradeChange = (submissionId: string, newGrade: number) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, instructorGrade: newGrade, status: "in-progress" as const } : sub,
      ),
    )

    // Trigger smart correction notification
    setLastCorrectionType("grade")
    setShowCorrectionNotification(true)
  }

  const handleFeedbackChange = (submissionId: string, newFeedback: string) => {
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === submissionId ? { ...sub, instructorFeedback: newFeedback, status: "in-progress" as const } : sub,
      ),
    )

    // Trigger smart correction notification
    setLastCorrectionType("feedback")
    setShowCorrectionNotification(true)
  }

  const handleStatusChange = (submissionId: string, newStatus: "needs-review" | "approved" | "in-progress") => {
    setSubmissions((prev) => prev.map((sub) => (sub.id === submissionId ? { ...sub, status: newStatus } : sub)))
  }

  const handleApproveSelected = () => {
    setSubmissions((prev) =>
      prev.map((sub) => (selectedSubmissions.includes(sub.id) ? { ...sub, status: "approved" as const } : sub)),
    )
    setSelectedSubmissions([])
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map((sub) => sub.id))
    } else {
      setSelectedSubmissions([])
    }
  }

  const handleSelectSubmission = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions((prev) => [...prev, submissionId])
    } else {
      setSelectedSubmissions((prev) => prev.filter((id) => id !== submissionId))
    }
  }

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter

    const matchesAiGrade =
      (aiGradeMin === "" || sub.aiSuggestedGrade >= Number.parseInt(aiGradeMin)) &&
      (aiGradeMax === "" || sub.aiSuggestedGrade <= Number.parseInt(aiGradeMax))

    const matchesFinalGrade =
      (finalGradeMin === "" || sub.instructorGrade >= Number.parseInt(finalGradeMin)) &&
      (finalGradeMax === "" || sub.instructorGrade <= Number.parseInt(finalGradeMax))

    return matchesSearch && matchesStatus && matchesAiGrade && matchesFinalGrade
  })

  const stats = {
    total: submissions.length,
    needsReview: submissions.filter((s) => s.status === "needs-review").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    inProgress: submissions.filter((s) => s.status === "in-progress").length,
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/courses/${params.courseId}/assessments`} className="hover:text-foreground">
            {course.code}
          </Link>
          <span>/</span>
          <span className="text-foreground">Grading Workbench</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Grading Workbench: {assessment.name}</h1>
            <p className="text-muted-foreground text-lg">AI-assisted grading with smart correction propagation</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="academic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All student submissions</p>
          </CardContent>
        </Card>
        <Card className="academic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.needsReview}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card className="academic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>
        <Card className="academic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Finalized grades</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="needs-review">Needs Review</option>
              <option value="in-progress">In Progress</option>
              <option value="approved">Approved</option>
            </select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">AI Grade:</span>
              <Input
                type="number"
                placeholder="Min"
                value={aiGradeMin}
                onChange={(e) => setAiGradeMin(e.target.value)}
                className="w-16 text-sm"
                min="0"
                max="100"
              />
              <span className="text-sm text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={aiGradeMax}
                onChange={(e) => setAiGradeMax(e.target.value)}
                className="w-16 text-sm"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Final Grade:</span>
              <Input
                type="number"
                placeholder="Min"
                value={finalGradeMin}
                onChange={(e) => setFinalGradeMin(e.target.value)}
                className="w-16 text-sm"
                min="0"
                max="100"
              />
              <span className="text-sm text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={finalGradeMax}
                onChange={(e) => setFinalGradeMax(e.target.value)}
                className="w-16 text-sm"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleApproveSelected}
            disabled={selectedSubmissions.length === 0}
            className="academic-button bg-transparent"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Selected ({selectedSubmissions.length})
          </Button>
          <Button variant="outline" className="academic-button bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export Results to CSV
          </Button>
          <Button variant="outline" className="academic-button bg-transparent">
            <FileText className="mr-2 h-4 w-4" />
            Download All Feedback as PDFs
          </Button>
        </div>
      </section>

      <section>
        <Card className="academic-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="resizable-table-container">
                <Table className="grading-table resizable-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 resizable-column">
                        <Checkbox
                          checked={
                            selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="resizable-column">
                        Student ID
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="resizable-column">
                        Student Name
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-48 resizable-column">
                        Answer Preview
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-24 resizable-column">
                        AI Grade
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-64 resizable-column">
                        AI Feedback
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-24 resizable-column">
                        Final Grade
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-64 resizable-column">
                        Final Feedback
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-32 resizable-column">
                        Status
                        <div className="resize-handle"></div>
                      </TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedSubmissions.includes(submission.id)}
                            onCheckedChange={(checked) => handleSelectSubmission(submission.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{submission.studentId}</TableCell>
                        <TableCell>{submission.studentName}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-auto p-0 text-left justify-start">
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {submission.answerPreview}
                                </div>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Student Submission: {submission.studentName}</DialogTitle>
                                <DialogDescription>Full submission document</DialogDescription>
                              </DialogHeader>
                              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Document preview would appear here
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <div className="text-center font-medium">{submission.aiSuggestedGrade}/100</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground line-clamp-3">
                            {submission.aiSuggestedFeedback}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={submission.instructorGrade}
                            onChange={(e) => handleGradeChange(submission.id, Number.parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={submission.instructorFeedback}
                            onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                            className="min-h-[80px] text-sm"
                            placeholder="Add your feedback..."
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-auto p-1 hover:bg-muted/50">
                                <Badge
                                  variant={
                                    submission.status === "approved"
                                      ? "default"
                                      : submission.status === "in-progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className={`status-badge cursor-pointer ${
                                    submission.status === "needs-review"
                                      ? "status-needs-review"
                                      : submission.status === "approved"
                                        ? "status-approved"
                                        : "status-in-progress"
                                  }`}
                                >
                                  {submission.status === "needs-review" && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {submission.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {submission.status === "in-progress" && <Clock className="w-3 h-3 mr-1" />}
                                  {submission.status.replace("-", " ")}
                                  <Edit3 className="w-3 h-3 ml-1 opacity-60" />
                                </Badge>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(submission.id, "needs-review")}>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Needs Review
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(submission.id, "in-progress")}>
                                <Clock className="w-4 h-4 mr-2" />
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(submission.id, "approved")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approved
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <SmartCorrectionNotification
        isVisible={showCorrectionNotification}
        onClose={() => setShowCorrectionNotification(false)}
        correctionType={lastCorrectionType}
        onApplyToSimilar={() => {
          // Handle applying correction to similar submissions
          setShowCorrectionNotification(false)
        }}
        onJustThisOne={() => {
          setShowCorrectionNotification(false)
        }}
      />
    </div>
  )
}

function getCourseById(courseId: string) {
  const courses = {
    cor101: {
      id: "cor101",
      code: "COR101",
      name: "Business Fundamentals",
    },
  }
  return courses[courseId as keyof typeof courses]
}

function getAssessmentById(assessmentId: string) {
  const assessments = {
    "midterm-2024": {
      id: "midterm-2024",
      name: "Mid-term Examination",
      description: "Comprehensive assessment covering chapters 1-6",
    },
  }
  return assessments[assessmentId as keyof typeof assessments]
}

const mockSubmissions: StudentSubmission[] = [
  {
    id: "1",
    studentId: "S001234",
    studentName: "Alice Chen",
    answerPreview: "The business model of Tesla focuses on vertical integration and sustainable transportation...",
    aiSuggestedGrade: 85,
    aiSuggestedFeedback:
      "Strong analysis of Tesla's business model. Good understanding of vertical integration concepts. Could improve discussion of competitive advantages.",
    instructorGrade: 85,
    instructorFeedback:
      "Strong analysis of Tesla's business model. Good understanding of vertical integration concepts. Could improve discussion of competitive advantages.",
    status: "needs-review",
    submissionUrl: "/submissions/1.pdf",
    lastModified: "2024-10-15 14:30",
  },
  {
    id: "2",
    studentId: "S001235",
    studentName: "Bob Wilson",
    answerPreview: "Tesla's approach to manufacturing differs from traditional automakers in several key ways...",
    aiSuggestedGrade: 78,
    aiSuggestedFeedback:
      "Good understanding of manufacturing processes. Analysis could be more detailed. Missing discussion of supply chain implications.",
    instructorGrade: 78,
    instructorFeedback:
      "Good understanding of manufacturing processes. Analysis could be more detailed. Missing discussion of supply chain implications.",
    status: "approved",
    submissionUrl: "/submissions/2.pdf",
    lastModified: "2024-10-15 15:45",
  },
  {
    id: "3",
    studentId: "S001236",
    studentName: "Carol Zhang",
    answerPreview: "The financial performance of Tesla shows significant growth in recent years...",
    aiSuggestedGrade: 92,
    aiSuggestedFeedback:
      "Excellent financial analysis with comprehensive data interpretation. Strong use of financial ratios and trend analysis.",
    instructorGrade: 92,
    instructorFeedback:
      "Excellent financial analysis with comprehensive data interpretation. Strong use of financial ratios and trend analysis.",
    status: "in-progress",
    submissionUrl: "/submissions/3.pdf",
    lastModified: "2024-10-15 16:20",
  },
]
