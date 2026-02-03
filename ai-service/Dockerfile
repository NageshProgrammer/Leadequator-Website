FROM python:3.10-slim

# -----------------------------
# System setup
# -----------------------------
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Python setup
# -----------------------------
RUN pip install --no-cache-dir --upgrade pip

# -----------------------------
# Install dependencies
# -----------------------------
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# -----------------------------
# Playwright setup (IMPORTANT)
# -----------------------------
RUN playwright install chromium --with-deps

# -----------------------------
# Copy application code
# -----------------------------
COPY . .

# -----------------------------
# Runtime
# -----------------------------
EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
