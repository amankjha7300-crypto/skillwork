def test_register_and_login(client):
    # Test registration
    reg_payload = {
        "full_name": "Test User",
        "email": "testuser@example.com",
        "password": "securepassword123",
        "phone_number": "+91 91234 56789"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "testuser@example.com"
    token = data["access_token"]

    # Test me endpoint
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["full_name"] == "Test User"

    # Test duplicate registration rejection
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # Test login with seed worker Aman
    login_res = client.post("/api/auth/login", json={"email": "aman@example.com", "password": "password123"})
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()
