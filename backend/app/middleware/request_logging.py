
import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        start_time = time.perf_counter()

        try:

            response = await call_next(request)

            duration = time.perf_counter() - start_time

            logger.info(
                "method=%s path=%s status_code=%s duration_seconds=%.4f",
                request.method,
                request.url.path,
                response.status_code,
                duration
            )

            return response

        except Exception:

            duration = time.perf_counter() - start_time

            logger.exception(
                "Request failed: method=%s path=%s duration_seconds=%.4f",
                request.method,
                request.url.path,
                duration
            )

            raise
