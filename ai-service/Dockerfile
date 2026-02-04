FROM python:3.10-bullseye

WORKDIR /app

# System deps (stable Debian)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements first
COPY requirements.txt .

# Install Python deps (torch CPU auto-resolves)
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 80

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
