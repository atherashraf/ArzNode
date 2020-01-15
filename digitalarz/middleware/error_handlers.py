from django.contrib import messages
from django.utils.deprecation import MiddlewareMixin
# Mixin for compatibility with Django <1.10
from digitalarz.middleware.utils.exceptions import BusinessLogicException
from digitalarz.middleware.utils.responses import RedirectToRefererResponse


class HandleBusinessExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if isinstance(exception, BusinessLogicException):
            message = "Invalid operation %s" % str(exception)
            messages.error(request, message)
            return RedirectToRefererResponse(request)