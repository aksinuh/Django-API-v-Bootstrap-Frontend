from django.contrib import admin
from .models import Task

@admin.register(Task)
class Taskadmin(admin.ModelAdmin):
    list_display = ["id", "user", "title", "content"]
    list_display_links = ["id"]
