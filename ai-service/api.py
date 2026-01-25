from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://leadequator.live",
        "https://www.leadequator.live",
        "https://leadequator-ai-service-arfwaze2cyesckgj.centralindia-01.azurewebsites.net",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
