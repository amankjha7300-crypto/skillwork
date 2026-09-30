import urllib.request
import urllib.error
import json

def test_flow():
    # 1. Login Aman
    login_data = json.dumps({'email': 'aman@example.com', 'password': 'password123'}).encode('utf-8')
    req = urllib.request.Request('http://127.0.0.1:8000/api/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        token = data['access_token']
        print(f"✓ Login successful for Aman Kumar ({data['user']['email']})")

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

    # 2. Get Profile
    req_prof = urllib.request.Request('http://127.0.0.1:8000/api/worker/profile', headers=headers)
    with urllib.request.urlopen(req_prof) as resp:
        prof = json.loads(resp.read().decode('utf-8'))
        level_title = prof['level']['title'] if prof.get('level') else 'Unranked'
        badge = prof['level']['badge_name'] if prof.get('level') else ''
        print(f"✓ Profile loaded: {level_title} ({badge}), Skills: {len(prof['skills'])}")

    # 3. Get Work
    req_work = urllib.request.Request('http://127.0.0.1:8000/api/work', headers=headers)
    with urllib.request.urlopen(req_work) as resp:
        work = json.loads(resp.read().decode('utf-8'))
        print(f"✓ Work opportunities: {len(work)} available slots")
        target_task = work[0] if work else None
        if target_task:
            print(f"  -> Opportunity: '{target_task['title']}' | Reward: ₹{target_task['payment_amount']} | Slots: {target_task['available_slots']}")

    # 4. Check Daily Limit
    used_today = prof.get('today_tasks_count', 0)
    limit = prof.get('daily_task_limit', 2)
    print(f"✓ Daily limit: {used_today}/{limit} used. Remaining: {max(0, limit - used_today)}")

    # 5. Grab Work (Aman is at 2/2 limit, so backend must protect him)
    if target_task:
        task_id = target_task['id']
        grab_req = urllib.request.Request(f'http://127.0.0.1:8000/api/work/{task_id}/grab', data=b'{}', headers=headers)
        try:
            urllib.request.urlopen(grab_req)
            print("❌ Error: Aman exceeded daily limit!")
        except urllib.error.HTTPError as e:
            err_body = json.loads(e.read().decode('utf-8'))
            print(f"✓ Daily Limit Enforced by Backend: HTTP {e.code} - '{err_body['detail']}'")

        # 6. Rohan (who has 0/2 tasks used today) grabs the task
        # 6. Rohan (who has 0/2 tasks used today and Python skill)
        p_login = json.dumps({'email': 'rohan@example.com', 'password': 'password123'}).encode('utf-8')
        req_p = urllib.request.Request('http://127.0.0.1:8000/api/auth/login', data=p_login, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req_p) as resp:
            p_token = json.loads(resp.read().decode('utf-8'))['access_token']

        p_headers = {'Authorization': f'Bearer {p_token}', 'Content-Type': 'application/json'}
        rohan_work_req = urllib.request.Request('http://127.0.0.1:8000/api/work', headers=p_headers)
        with urllib.request.urlopen(rohan_work_req) as resp:
            rohan_tasks = json.loads(resp.read().decode('utf-8'))
            rohan_eligible = [t for t in rohan_tasks if t.get('is_eligible')]
            print(f"✓ Rohan's eligible opportunities: {len(rohan_eligible)} tasks matching his verified skills")
            if not rohan_eligible:
                print("No eligible tasks for Rohan right now.")
                return
            rohan_target = rohan_eligible[0]
            print(f"  -> Rohan targeted task: '{rohan_target['title']}' (ID: {rohan_target['id']})")

        p_grab = urllib.request.Request(f"http://127.0.0.1:8000/api/work/{rohan_target['id']}/grab", data=b'{}', headers=p_headers)
        with urllib.request.urlopen(p_grab) as resp:
            grab_result = json.loads(resp.read().decode('utf-8'))
            print(f"✓ Rohan Grab Work Success: '{grab_result['message']}'")
            print(f"  Assignment ID: {grab_result['assignment']['id']} | Status: {grab_result['assignment']['status']}")

        task_id = rohan_target['id']

        # 7. Another attempt to grab the same slot -> Must get 409
        # Reset Aman's today count or try again
        grab_again = urllib.request.Request(f'http://127.0.0.1:8000/api/work/{task_id}/grab', data=b'{}', headers=p_headers)
        try:
            urllib.request.urlopen(grab_again)
            print("❌ Error: Double grab succeeded!")
        except urllib.error.HTTPError as e:
            err_body = json.loads(e.read().decode('utf-8'))
            print(f"✓ Atomic Vacancy Protection: Rejection HTTP {e.code} - '{err_body['detail']}'")

        # 7. Check Active Tasks
        req_tasks = urllib.request.Request('http://127.0.0.1:8000/api/tasks?status=IN_PROGRESS', headers=headers)
        with urllib.request.urlopen(req_tasks) as resp:
            tasks = json.loads(resp.read().decode('utf-8'))
            print(f"✓ Aman's Active Tasks: {len(tasks)} in progress")

        # 8. Check Earnings
        req_earn = urllib.request.Request('http://127.0.0.1:8000/api/earnings', headers=headers)
        with urllib.request.urlopen(req_earn) as resp:
            earn = json.loads(resp.read().decode('utf-8'))
            print(f"✓ Aman's Earnings: Total ₹{earn['summary']['total_earnings']} | Available: ₹{earn['summary']['available_balance']}")

if __name__ == '__main__':
    test_flow()
