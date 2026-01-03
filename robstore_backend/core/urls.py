from django.urls import path
#from .views_payment import SimulatedPaymentAPIView

from .views import (
    CategoryListAPIView,
    ProductListAPIView,
    CartDetailAPIView,
    AddToCartAPIView,
    RemoveFromCartAPIView,
    UpdateCartItemQuantityAPIView,
    ClearCartAPIView,
    CheckoutAPIView,
)

from .views_admin import (
    AdminProductListCreateAPIView,
    AdminProductDetailAPIView,
)

urlpatterns = [
    # PUBLIC
    path("categories/", CategoryListAPIView.as_view()),
    path("products/", ProductListAPIView.as_view()),

    # CART
    path("cart/", CartDetailAPIView.as_view()),
    path("cart/add/", AddToCartAPIView.as_view()),
    path("cart/remove/", RemoveFromCartAPIView.as_view()),
    path("cart/update/", UpdateCartItemQuantityAPIView.as_view()),
    path("cart/clear/", ClearCartAPIView.as_view()),
    path("checkout/", CheckoutAPIView.as_view()),

    # 🔐 ADMIN PRODUCTS
    path("admin/products/", AdminProductListCreateAPIView.as_view()),
    path("admin/products/<int:pk>/", AdminProductDetailAPIView.as_view()),
]
