
def test_user_registration(client):

    response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data


def test_duplicate_registration(client):

    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "TestPassword123"
    }

    first_response = client.post(
        "/api/auth/register",
        json=user_data
    )

    second_response = client.post(
        "/api/auth/register",
        json=user_data
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409


def test_user_login(client):

    client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123"
        }
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "TestPassword123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["expires_in"] > 0


def test_invalid_login(client):

    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "WrongPassword123"
        }
    )

    assert response.status_code == 401


def test_get_current_user(client):

    client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "TestPassword123"
        }
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "TestPassword123"
        }
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"


def test_access_without_token(client):

    response = client.get("/api/auth/me")

    assert response.status_code == 401
