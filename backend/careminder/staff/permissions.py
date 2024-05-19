from rest_framework import permissions

from careminder.permissions import CustomDjangoModelPermissions


from rest_framework import permissions


class IsUserOrHasCustomModelPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True

        return CustomDjangoModelPermissions().has_permission(request, view)
