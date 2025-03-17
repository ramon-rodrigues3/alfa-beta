from fastapi import FastAPI

app = FastAPI()

@app.get("/home")
def home_page():
    return {"mensagem": "Olá, Mundo!"}