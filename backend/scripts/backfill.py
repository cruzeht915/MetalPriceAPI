from app.utils import backfill_data #manual_day_purge

if __name__ == "__main__":
    metals = ["ALU", "XPB", "XCU", "IRON", "XLI", "NI", "ZNC", "XSN"]
    backfill_data(metals, 90)
