from fastapi import FastAPI, HTTPException
from config import db

app = FastAPI()

@app.get("test/db")
async def test_db():
    try:
        collections = db.list_collection_names()
        return {"success": True, "collections": collections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)