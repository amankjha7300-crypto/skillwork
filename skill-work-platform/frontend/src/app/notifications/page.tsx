"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, Zap } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useTasks } from "@/hooks/useTasks";
import { PageHeader } from "@/components/layout/PageHeader";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { WorkNotification } from "@/components/notifications/WorkNotification";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const { grabWork } = useTasks();

  const handleGrabFromNotification = async (taskId: number) => {
    const res = await grabWork(taskId);
    if (res.success) {
      alert("Work successfully assigned to you! Redirecting to workspace...");
      window.location.href = `/tasks/${res.assignmentId}`;
    }
  };

  const workNotifications = notifications.filter((n) => n.type === "NEW_WORK");
  const otherNotifications = notifications.filter((n) => n.type !== "NEW_WORK");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <PageHeader
        title="Notification Center"
        subtitle="Real-time alerts for incoming work opportunities, approvals, and level updates."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllAsRead} icon={<CheckCheck size={16} />}>
              Mark all as read
            </Button>
          ) : undefined
        }
      />

      {/* Urgent Work Allocations */}
      {workNotifications.length > 0 && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Zap size={18} color="#0284C7" fill="#38BDF8" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A" }}>
              Active Work Allocations
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {workNotifications.map((wn) => (
              <WorkNotification
                key={wn.id}
                taskId={wn.task_id || 1}
                title={wn.title}
                category="Backend Development"
                reward={900}
                slots={1}
                onGrab={handleGrabFromNotification}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Notifications List */}
      <section>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: "12px" }}>
          All Notifications ({notifications.length})
        </h3>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={32} />}
            title="You're all caught up!"
            description="You don't have any unread notifications. Stay available to receive live alerts."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={markAsRead}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
