# Generated by Django 4.1.3 on 2023-12-12 07:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("patient", "0002_remove_patient_doctor_first_visit_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="patient",
            name="doctor",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="doctor_tablets",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="patient",
            name="severity",
            field=models.PositiveSmallIntegerField(
                choices=[(0, "Low"), (1, "Middle"), (2, "High")], null=True
            ),
        ),
    ]
