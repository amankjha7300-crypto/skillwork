def test_task_lifecycle_workflow(client):
    # 1. Login as Aman
    login_res = client.post("/api/auth/login", json={"email": "aman@example.com", "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get available work
    work_res = client.get("/api/work", headers=headers)
    assert work_res.status_code == 200
    work_list = work_res.json()
    assert len(work_list) > 0
    available_task = next(t for t in work_list if t["status"] == "AVAILABLE" and t["available_slots"] > 0)
    task_id = available_task["id"]

    # 3. Grab work
    grab_res = client.post(f"/api/work/{task_id}/grab", headers=headers)
    assert grab_res.status_code == 200
    grab_data = grab_res.json()
    assert grab_data["success"] is True
    assignment_id = grab_data["assignment_id"]

    # 4. Check tasks list
    tasks_res = client.get("/api/tasks", headers=headers)
    assert tasks_res.status_code == 200
    my_tasks = tasks_res.json()
    assert any(a["id"] == assignment_id for a in my_tasks)

    # 5. Start task
    start_res = client.post(f"/api/tasks/{assignment_id}/start", headers=headers)
    assert start_res.status_code == 200
    assert start_res.json()["status"] == "IN_PROGRESS"

    # 6. Submit task
    submit_res = client.post(
        f"/api/tasks/{assignment_id}/submit",
        json={
            "submission_notes": "Implemented and tested all endpoints.",
            "files": [{"name": "solution.zip", "size": 15000, "type": "application/zip", "url": "/uploads/solution.zip"}]
        },
        headers=headers
    )
    assert submit_res.status_code == 200
    assert submit_res.json()["status"] in ["SUBMITTED", "APPROVED"]
