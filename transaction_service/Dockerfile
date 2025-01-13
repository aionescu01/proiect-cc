#FROM ubuntu:latest
#LABEL authors="alexa"
#
#ENTRYPOINT ["top", "-b"]

# Base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . /app/

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["python", "app.py"]