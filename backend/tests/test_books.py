
def create_test_user(client, username, email):

    client.post(
        "/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": "TestPassword123"
        }
    )

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "TestPassword123"
        }
    )

    return login_response.json()["access_token"]


def test_add_book(client):

    token = create_test_user(
        client,
        "reader1",
        "reader1@example.com"
    )

    response = client.post(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "Currently Reading"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Atomic Habits"
    assert data["author"] == "James Clear"
    assert data["status"] == "Currently Reading"


def test_get_user_books(client):

    token = create_test_user(
        client,
        "reader1",
        "reader1@example.com"
    )

    client.post(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "Want to Read"
        }
    )

    response = client.get(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Atomic Habits"


def test_update_book_status(client):

    token = create_test_user(
        client,
        "reader1",
        "reader1@example.com"
    )

    create_response = client.post(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "Want to Read"
        }
    )

    book_id = create_response.json()["id"]

    update_response = client.patch(
        f"/api/books/{book_id}/status",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "status": "Completed"
        }
    )

    assert update_response.status_code == 200
    assert update_response.json()["status"] == "Completed"


def test_update_nonexistent_book(client):

    token = create_test_user(
        client,
        "reader1",
        "reader1@example.com"
    )

    response = client.patch(
        "/api/books/9999/status",
        headers={
            "Authorization": f"Bearer {token}"
        },
        json={
            "status": "Completed"
        }
    )

    assert response.status_code == 404


def test_user_cannot_access_another_users_book(client):

    user1_token = create_test_user(
        client,
        "reader1",
        "reader1@example.com"
    )

    user2_token = create_test_user(
        client,
        "reader2",
        "reader2@example.com"
    )

    # User 1 creates a book.
    create_response = client.post(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {user1_token}"
        },
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "Want to Read"
        }
    )

    book_id = create_response.json()["id"]

    # User 2 tries to update User 1's book.
    response = client.patch(
        f"/api/books/{book_id}/status",
        headers={
            "Authorization": f"Bearer {user2_token}"
        },
        json={
            "status": "Completed"
        }
    )

    assert response.status_code == 404


def test_users_only_see_their_own_books(client):

    user1_token = create_test_user(
        client,
        "reader1",
        "reader1@example.com"
    )

    user2_token = create_test_user(
        client,
        "reader2",
        "reader2@example.com"
    )

    client.post(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {user1_token}"
        },
        json={
            "title": "Atomic Habits",
            "author": "James Clear",
            "status": "Want to Read"
        }
    )

    response = client.get(
        "/api/books/",
        headers={
            "Authorization": f"Bearer {user2_token}"
        }
    )

    assert response.status_code == 200
    assert response.json() == []
