"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Priority = "High" | "Medium" | "Low";
export type Category = "Personal" | "Work" | "Urgent" | "Health";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  dueDate?: string;
  completed: boolean;
  createdAt: number;
}

export interface ActivityEvent {
  id: string;
  action: "Created" | "Completed" | "Uncompleted" | "Deleted" | "Restored" | "Permanently Deleted";
  taskTitle: string;
  timestamp: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
}

interface TaskContextType {
  tasks: Task[];
  deletedTasks: Task[];
  activityLog: ActivityEvent[];
  notifications: NotificationItem[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  emptyTrash: () => void;
  clearActivityLog: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem["type"]) => void;
  clearNotifications: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskify_tasks");
    const savedDeleted = localStorage.getItem("taskify_deleted_tasks");
    const savedLog = localStorage.getItem("taskify_activity_log");
    const savedNotifs = localStorage.getItem("taskify_notifications");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedDeleted) setDeletedTasks(JSON.parse(savedDeleted));
    if (savedLog) setActivityLog(JSON.parse(savedLog));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("taskify_tasks", JSON.stringify(tasks));
      localStorage.setItem("taskify_deleted_tasks", JSON.stringify(deletedTasks));
      localStorage.setItem("taskify_activity_log", JSON.stringify(activityLog));
      localStorage.setItem("taskify_notifications", JSON.stringify(notifications));
    }
  }, [tasks, deletedTasks, activityLog, notifications, isLoaded]);

  const addNotification = (title: string, message: string, type: NotificationItem["type"] = "info") => {
    setNotifications(prev => [
      { id: Math.random().toString(36).substr(2, 9), title, message, type, timestamp: Date.now() },
      ...prev
    ].slice(0, 20)); // Keep max 20 notifications
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const logActivity = (action: ActivityEvent["action"], taskTitle: string) => {
    setActivityLog(prev => [
      { id: Math.random().toString(36).substr(2, 9), action, taskTitle, timestamp: Date.now() },
      ...prev
    ].slice(0, 50)); // Keep only last 50 events to prevent massive storage
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity("Created", newTask.title);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map(t => {
      if (t.id === id) {
        const isCompleted = !t.completed;
        logActivity(isCompleted ? "Completed" : "Uncompleted", t.title);
        if (isCompleted) {
          addNotification("Task Completed", `Great job finishing "${t.title}"!`, "success");
        }
        return { ...t, completed: isCompleted };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setDeletedTasks(prev => [taskToDelete, ...prev]);
      setTasks(prev => prev.filter(t => t.id !== id));
      logActivity("Deleted", taskToDelete.title);
    }
  };

  const restoreTask = (id: string) => {
    const taskToRestore = deletedTasks.find(t => t.id === id);
    if (taskToRestore) {
      setTasks(prev => [taskToRestore, ...prev]);
      setDeletedTasks(prev => prev.filter(t => t.id !== id));
      logActivity("Restored", taskToRestore.title);
      addNotification("Task Restored", `"${taskToRestore.title}" has been restored to active tasks.`, "info");
    }
  };

  const permanentlyDeleteTask = (id: string) => {
    const taskToDelete = deletedTasks.find(t => t.id === id);
    if (taskToDelete) {
      setDeletedTasks(prev => prev.filter(t => t.id !== id));
      logActivity("Permanently Deleted", taskToDelete.title);
    }
  };

  const emptyTrash = () => {
    setDeletedTasks([]);
    logActivity("Permanently Deleted", "All tasks in trash");
  };

  const clearActivityLog = () => {
    setActivityLog([]);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, deletedTasks, activityLog, notifications,
      addTask, toggleTask, deleteTask, 
      restoreTask, permanentlyDeleteTask, emptyTrash, clearActivityLog,
      addNotification, clearNotifications
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
