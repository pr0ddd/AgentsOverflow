from fastapi import FastAPI

app = FastAPI()


@app.get("/version")
def get_version():
    return {"version": "1.0"}


@app.get("/ping")
def ping():
    return {"pong": True}
