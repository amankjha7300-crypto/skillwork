def test_skills_and_assessment(client):
    # Login as Aman
    login_res = client.post("/api/auth/login", json={"email": "aman@example.com", "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List all skills
    skills_res = client.get("/api/skills")
    assert skills_res.status_code == 200
    skills = skills_res.json()
    assert len(skills) > 0

    # Get Aman's current worker skills
    worker_skills_res = client.get("/api/skills/worker", headers=headers)
    assert worker_skills_res.status_code == 200
    w_skills = worker_skills_res.json()
    assert any(s["skill"]["name"] == "Python" for s in w_skills)

    # Get assessment for Python
    python_id = next(s["id"] for s in skills if s["name"] == "Python")
    assess_res = client.get(f"/api/skills/{python_id}/assessment", headers=headers)
    assert assess_res.status_code == 200
    assessment = assess_res.json()
    assert assessment["total_questions"] == 5

    # Submit assessment with answers: [1, 1, 1, 2, 1] (all correct)
    submit_res = client.post(
        "/api/skills/assessment",
        json={"assessment_id": assessment["id"], "answers": [1, 1, 1, 2, 1]},
        headers=headers
    )
    assert submit_res.status_code == 200
    result = submit_res.json()
    assert result["score"] == 100
    assert result["achieved_level"] == "Expert"
    assert result["passed"] is True
