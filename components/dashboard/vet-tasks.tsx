"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Phone, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface Task {
  id: string
  type: "callback" | "recheck" | "follow_up"
  pet_name: string
  owner_name: string
  owner_phone: string
  due_date: string
  priority: "high" | "medium" | "low"
  notes: string
  status: "pending" | "completed"
}

export function VetTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const supabase = createClient()
      // Mock data for now - replace with actual query
      const mockTasks: Task[] = [
        {
          id: "1",
          type: "callback",
          pet_name: "Max",
          owner_name: "John Smith",
          owner_phone: "+1-555-0123",
          due_date: new Date().toISOString(),
          priority: "high",
          notes: "Follow up on blood work results",
          status: "pending",
        },
        {
          id: "2",
          type: "recheck",
          pet_name: "Luna",
          owner_name: "Sarah Johnson",
          owner_phone: "+1-555-0456",
          due_date: new Date(Date.now() + 86400000).toISOString(),
          priority: "medium",
          notes: "Recheck wound healing progress",
          status: "pending",
        },
      ]
      setTasks(mockTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const markCompleted = async (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "completed" as const } : task)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "callback":
        return <Phone className="h-4 w-4" />
      case "recheck":
        return <Clock className="h-4 w-4" />
      case "follow_up":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks & Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks & Follow-ups</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No pending tasks</div>
            ) : (
              pendingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(task.type)}
                      <span className="font-medium capitalize">{task.type.replace("_", " ")}</span>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                    <Button size="sm" onClick={() => markCompleted(task.id)}>
                      Mark Complete
                    </Button>
                  </div>

                  <div>
                    <p className="font-medium">
                      {task.pet_name} - {task.owner_name}
                    </p>
                    <p className="text-sm text-gray-600">{task.owner_phone}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>

                  {task.notes && <p className="text-sm bg-gray-50 p-2 rounded">{task.notes}</p>}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No completed tasks</div>
            ) : (
              completedTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3 opacity-60">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium capitalize">{task.type.replace("_", " ")}</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>

                  <div>
                    <p className="font-medium">
                      {task.pet_name} - {task.owner_name}
                    </p>
                    <p className="text-sm text-gray-600">{task.owner_phone}</p>
                  </div>

                  {task.notes && <p className="text-sm bg-gray-50 p-2 rounded">{task.notes}</p>}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
