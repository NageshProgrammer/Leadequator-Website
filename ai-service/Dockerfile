FROM python:3.10-bookworm

# -----------------------------
# App directory
# -----------------------------
WORKDIR /app

# -----------------------------
# System dependencies (MINIMAL & STABLE)
# -----------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Python deps
# -----------------------------
RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# -----------------------------
# Playwright
# -----------------------------
RUN playwright install chromium --with-deps

# -----------------------------
# Copy source
# -----------------------------
COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
