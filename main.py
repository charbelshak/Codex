from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Allow frontend to fetch from this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint to return Excel rules as plain text
@app.get("/rules")
def get_rules():
    try:
        # Read rules.xlsx (assume same folder)
        df = pd.read_excel("rules.xlsx", header=None)
        # Combine all cells into one plain text string
        rules_text = "\n".join([" ".join(map(str, row)) for row in df.values])
        return {"rules": rules_text}
    except Exception as e:
        return {"rules": f"Error loading Excel: {str(e)}"}
