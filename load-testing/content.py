from locust import HttpUser, task, between
import random

class ActivityEditViewUser(HttpUser):
    host="https://dev3.doenet.org"
    wait_time = between(1, 3)
    content_ids = []

    def on_start(self):
        response = self.client.post("/api/login/createOrLoginAsTest", headers={"Content-Type": "application/json"}, json={"email": "test@abc.org"}, catch_response=True)
        print(response.status_code)

    @task(1)
    def get_content(self):
        response = self.client.get("/api/contentList/getSharedWithMe")

    @task(1)
    def get_sign_in_page(self):
        response = self.client.get("/signIn", catch_response=True)


    @task(1)
    def browse_explore(self):
        custom_headers = {
            "Content-Type": "application/json"
        }
        response = self.client.post("/api/explore/browseExplore", json={"categories": [], "isUnclassified": False}, headers=custom_headers)
        if response.status_code == 200:
            data = response.json()
            self.content_ids = [item["id"] for item in data.get("content", [])]

    @task(3)
    def get_activity_viewer_data(self):
        if self.content_ids:
            content_id = random.choice(self.content_ids)
            self.client.get(f"/api/activityEditView/getActivityViewerData/{content_id}")

    @task(2)
    def get_content_source(self):
        if self.content_ids:
            content_id = random.choice(self.content_ids)
            self.client.get(f"/api/activityEditView/getContentSource/{content_id}")

    @task(2)
    def get_public_content(self):
        if self.content_ids:
            content_id = random.choice(self.content_ids)
            self.client.get(f"/api/activityEditView/getPublicContent/{content_id}")

    @task(1)
    def get_public_content_by_cid(self):
        if self.content_ids:
            content_id = random.choice(self.content_ids)
            self.client.get(f"/api/activityEditView/getPublicContentByCid/{content_id}")
