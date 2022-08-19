from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("main.urls")),
    path("account/", include("account.urls")),
    path("bucket-list/", include("bucket_list.urls")),
    path("customer-support/", include("customer_support.urls")),
]
