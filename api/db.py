import urllib.request
import json

TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk5MjQ3MzgsImlkIjoiMDE5ZTZiYmYtN2IwMS03ODAwLTgxMjAtMmIxYWU3ZmY5NDhiIiwicmlkIjoiNTc5N2IxMTMtYWJkNS00NzNmLWE0ZDQtMjg3NDczZmYxOTFiIn0.XbdprTEP9RO1kuQywjbrwcLpTjyf5k4avD6UZrG7Ht54tYEq2_yu-dCmdAfdXvJiUC5M55DjeEf-EdwXvsa8CQ"
URL = "https://mam-ouzaif.aws-eu-west-1.turso.io/v2/pipeline"

def execute_query(sql, params=None):
    payload = {
        "requests": [
            {"type": "execute", "stmt": {"sql": sql, "args": params or []}},
            {"type": "close"}
        ]
    }
    data = json.dumps(payload).encode()
    req = urllib.request.Request(URL, data=data, headers={
        "Authorization": f"Bearer {TOKEN}", 
        "Content-Type": "application/json"
    })
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode())
