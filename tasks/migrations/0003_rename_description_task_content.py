# Generated by Django 5.1.7 on 2025-03-26 17:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_rename_content_task_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='description',
            new_name='content',
        ),
    ]
