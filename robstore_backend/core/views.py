# pylint: disable=no-member

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
)

from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    OrderSerializer,
)


# =========================
# PUBLIC
# =========================

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# =========================
# CART
# =========================

class CartDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response(
                {"error": "product_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(Product, id=product_id)
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": quantity},
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(
            {"message": "Product added to cart"},
            status=status.HTTP_200_OK
        )


class RemoveFromCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            product_id=product_id
        )

        cart_item.delete()

        return Response(
            {"message": "Product removed from cart"},
            status=status.HTTP_200_OK
        )


class UpdateCartItemQuantityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        action = request.data.get("action")

        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            product_id=product_id
        )

        if action == "increase":
            cart_item.quantity += 1
        else:
            cart_item.quantity -= 1
            if cart_item.quantity <= 0:
                cart_item.delete()
                return Response({"message": "Product removed"})

        cart_item.save()
        return Response({"quantity": cart_item.quantity})


class ClearCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared"})


# =========================
# CHECKOUT
# =========================

class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        if not cart.items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = sum(
            item.product.price * item.quantity
            for item in cart.items.all()
        )

        order = Order.objects.create(
            user=request.user,
            total=total
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        cart.items.all().delete()

        return Response(
            {
                "message": "Payment successful",
                "order_id": order.pk,
                "total": total
            }
        )


# =========================
# ADMIN
# =========================

class AdminProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class AdminProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class AdminOrderListAPIView(generics.ListAPIView):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
