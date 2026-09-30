def test_earnings_and_withdrawal(client):
    # Login as Aman
    login_res = client.post("/api/auth/login", json={"email": "aman@example.com", "password": "password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get earnings summary
    earnings_res = client.get("/api/earnings", headers=headers)
    assert earnings_res.status_code == 200
    earnings = earnings_res.json()
    assert earnings["available_balance"] > 0
    current_balance = earnings["available_balance"]

    # Request withdrawal of 1000
    withdraw_res = client.post(
        "/api/earnings/withdraw",
        json={
            "amount": 1000.0,
            "method": "UPI",
            "payout_details": "aman@okaxis"
        },
        headers=headers
    )
    assert withdraw_res.status_code == 200
    withdrawal = withdraw_res.json()
    assert withdrawal["amount"] == 1000.0
    assert withdrawal["status"] == "COMPLETED"

    # Verify updated balance
    updated_res = client.get("/api/earnings", headers=headers)
    assert updated_res.status_code == 200
    updated = updated_res.json()
    assert updated["available_balance"] == current_balance - 1000.0

    # Overdraw attempt should fail with 400
    fail_res = client.post(
        "/api/earnings/withdraw",
        json={
            "amount": 999999.0,
            "method": "UPI",
            "payout_details": "aman@okaxis"
        },
        headers=headers
    )
    assert fail_res.status_code == 400
