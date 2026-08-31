import os
import re

files = [
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/live-payments/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/risk/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/proactive-alerts/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/learning/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/demo/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/audit-trail/page.tsx",
    "c:/Users/sushb/PAYVISHWAS/frontend/src/app/agent-activity/page.tsx"
]

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        content = re.sub(r'"http://127\.0\.0\.1:8000(/.*?)"', r'`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}\1`', content)
        content = re.sub(r'`http://127\.0\.0\.1:8000(/.*?)`', r'`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}\1`', content)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

print("Done replacing.")
