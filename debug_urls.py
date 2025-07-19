#!/usr/bin/env python3
"""
Debug script to check Django URL configuration
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.urls import get_resolver
from django.conf import settings

def print_urls(urlpatterns, prefix=''):
    """Print all URL patterns"""
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            # This is an include() pattern
            print(f"{prefix}{pattern.pattern} -> INCLUDE")
            print_urls(pattern.url_patterns, prefix + "  ")
        else:
            # This is a regular pattern
            print(f"{prefix}{pattern.pattern} -> {pattern.callback}")

def main():
    print("🔍 Django URL Configuration Debug")
    print("=" * 50)
    
    print(f"Django Settings Module: {settings.SETTINGS_MODULE}")
    print(f"Installed Apps: {settings.INSTALLED_APPS}")
    print()
    
    print("📋 URL Patterns:")
    print("-" * 30)
    
    try:
        resolver = get_resolver()
        print_urls(resolver.url_patterns)
    except Exception as e:
        print(f"❌ Error loading URL patterns: {e}")
        return
    
    print()
    print("✅ URL configuration loaded successfully!")

if __name__ == "__main__":
    main()
