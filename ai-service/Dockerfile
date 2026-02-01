FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# 🔥 Install CPU-only torch FIRST
RUN pip install --no-cache-dir torch==2.1.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Copy requirements AFTER torch
COPY requirements.txt .

# Install remaining deps (torch already satisfied)
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 80

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
