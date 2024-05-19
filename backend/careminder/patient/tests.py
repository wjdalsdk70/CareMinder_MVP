from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from patient.views import PatientListCreateView, PatientRetrieveUpdateDestroyView
from patient.models import Patient
from unittest.mock import patch


class TestPatient(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PatientListCreateView.as_view()
        self.uri = "/patient/"

        self.patient = Patient.objects.create(
            first_name="Test", last_name="Patient", age=30
        )

    @patch("patient.models.Patient.objects.create")
    def test_list_patients(self, mock_create):
        mock_create.return_value = self.patient
        request = self.factory.get(self.uri)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    @patch("patient.models.Patient.objects.create")
    def test_create_patient(self, mock_create):
        mock_create.return_value = self.patient
        data = {
            "first_name": "New",
            "last_name": "Patient",
            "age": 40,
            "doctor_first_visit": False,
            "hospitalization": Patient.Severity.LOW,
        }
        request = self.factory.post(self.uri, data=data)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    @patch("patient.models.Patient.objects.get")
    def test_retrieve_patient(self, mock_get):
        mock_get.return_value = self.patient
        view = PatientRetrieveUpdateDestroyView.as_view()
        uri = f"/patient/{self.patient.id}/"  # type: ignore
        request = self.factory.get(uri)
        response = view(request, pk=self.patient.id)  # type: ignore
        self.assertEqual(response.status_code, 200)

    @patch("patient.models.Patient.objects.get")
    def test_update_patient(self, mock_get):
        mock_get.return_value = self.patient
        view = PatientRetrieveUpdateDestroyView.as_view()
        uri = f"/patient/{self.patient.id}/"  # type: ignore
        data = {
            "first_name": "Updated",
        }
        request = self.factory.put(uri, data=data)
        response = view(request, pk=self.patient.id)  # type: ignore
        self.assertEqual(response.status_code, 200)

    @patch("patient.models.Patient.objects.get")
    def test_delete_patient(self, mock_get):
        mock_get.return_value = self.patient
        view = PatientRetrieveUpdateDestroyView.as_view()
        uri = f"/patient/{self.patient.id}/"  # type: ignore
        request = self.factory.delete(uri)
        response = view(request, pk=self.patient.id)  # type: ignore
        self.assertEqual(response.status_code, 204)
