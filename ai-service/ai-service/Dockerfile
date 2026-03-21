FROM python:3.10-bookworm

WORKDIR /app

# Minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements first (better caching)
COPY requirements.txt .

# Install Python deps (this installs playwright too)
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browser (THIS is the correct way)
RUN python -m playwright install chromium

# Copy app code
COPY . .

EXPOSE 80

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
