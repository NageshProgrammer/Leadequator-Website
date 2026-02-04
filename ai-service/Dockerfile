# ✅ Pin to stable Debian (NO trixie)
FROM python:3.10-bookworm

WORKDIR /app

# Minimal, safe system deps (NO build-essential)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements
COPY requirements.txt .

# Install Python deps
# Torch will install CPU wheel automatically
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
