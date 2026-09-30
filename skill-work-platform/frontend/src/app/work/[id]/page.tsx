"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useTasks } from "@/hooks/useTasks";
import { WorkDetails } from "@/components/work/WorkDetails";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Task } from "@/types/task";

export default function WorkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = Number(params?.id);
  const { grabWork } = useTasks();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    if (!taskId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWorkDetails(taskId);
      setTask(data);
    } catch (err: any) {
      setError(err.message || "Failed to load work details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/work"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", fontWeight: 700, color: "#0284C7" }}
        >
          <ArrowLeft size={16} /> Back to Live Work
        </Link>
      </div>

      {loading && <LoadingState message="Loading work briefing..." />}
      {error && <ErrorState message={error} onRetry={fetchTask} />}
      {task && (
        <WorkDetails
          task={task}
          onGrab={grabWork}
          onSuccess={() => {
            router.push("/tasks");
          }}
        />
      )}
    </div>
  );
}
