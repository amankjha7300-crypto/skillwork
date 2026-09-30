"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Task, TaskAssignment } from "@/types/task";
import { useAuth } from "./useAuth";

export function useTasks() {
  const { user, refreshProfile } = useAuth();
  const [availableWork, setAvailableWork] = useState<Task[]>([]);
  const [myTasks, setMyTasks] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [grabbingId, setGrabbingId] = useState<number | null>(null);
  const [grabError, setGrabError] = useState<string | null>(null);
  const [grabSuccess, setGrabSuccess] = useState<string | null>(null);

  const fetchWorkAndTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [work, tasks] = await Promise.all([
        api.getAvailableWork(),
        api.getMyTasks(),
      ]);
      setAvailableWork(work);
      setMyTasks(tasks);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWorkAndTasks();
  }, [fetchWorkAndTasks]);

  const grabWork = async (taskId: number) => {
    setGrabbingId(taskId);
    setGrabError(null);
    setGrabSuccess(null);
    try {
      const res = await api.grabWork(taskId);
      setGrabSuccess(res.message || "Work Assigned Successfully!");
      await fetchWorkAndTasks();
      await refreshProfile();
      return { success: true, assignmentId: res.assignment_id };
    } catch (err: any) {
      const msg = err.message || "Failed to grab work.";
      setGrabError(msg);
      return { success: false, error: msg };
    } finally {
      setGrabbingId(null);
    }
  };

  return {
    availableWork,
    myTasks,
    loading,
    grabbingId,
    grabError,
    grabSuccess,
    fetchWorkAndTasks,
    grabWork,
  };
}
