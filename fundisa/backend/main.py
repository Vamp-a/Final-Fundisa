from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, students, educators, admins

app = FastAPI(
    title="Fundisa API",
    description="AI-Powered Multilingual Education Platform for South Africa",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow Flutter/React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route groups
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(educators.router)
app.include_router(admins.router)


@app.get("/", tags=["health"])
async def root():
    return {
        "message": "Welcome to Fundisa API 🎓",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}