]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/django_static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Base URL to access media files in the browser
MEDIA_URL = '/media/'

# Where files are physically stored on the NAS container
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Enable WhiteNoise compression and caching
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Allow React to talk to Django
CORS_ALLOWED_ORIGINS = [
    "https://guimoneda.com",
    "http://localhost:3000",