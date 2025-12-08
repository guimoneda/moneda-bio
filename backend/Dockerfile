# Use official Python image
FROM python:3.9-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Default command (will be overwritten by docker-compose, but good to have)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]