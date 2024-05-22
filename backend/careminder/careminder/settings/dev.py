from .base import *

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "43.203.5.18"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cmdb',
        'USER': 'cmuser',
        'PASSWORD': '1234',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}