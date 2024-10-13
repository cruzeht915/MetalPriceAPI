from fastapi import FastAPI
from app.routes import router as api_router
from app.utils import fetch_and_store_prices, purge_old_data, backfill_data
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import uvicorn

app = FastAPI()

app.include_router(api_router)

scheduler = BackgroundScheduler()

scheduler.add_job(fetch_and_store_prices, 'interval', hours=4)
scheduler.add_job(purge_old_data, 'interval', days=1)
scheduler.add_job(backfill_data, 'date', run_date=datetime.utcnow(), args=(["ALU", "XCU", "IRON", "XPB"], 60))
scheduler.start()

if(__name__=="__main__"):
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True, debug=True)
