# myproject/settings.py

INSTALLED_APPS = [
    # ...
    "corsheaders", # Add this
    # ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware", # Add this at the top
    "django.middleware.security.SecurityMiddleware",
    # ...
]

# Whitelist your frontend's URL so it can make requests
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]