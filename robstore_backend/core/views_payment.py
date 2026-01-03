# pylint: disable=no-member

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
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
)


class CategoryListAPIView(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all()


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.all()


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

        if not product_id:
            return Response(
                {"error": "product_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

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
        action = request.data.get("action")  # "increase" | "decrease"

        if not product_id or action not in ["increase", "decrease"]:
            return Response(
                {"error": "product_id and valid action are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart = get_object_or_404(Cart, user=request.user)

        cart_item = get_object_or_404(
            CartItem,
            cart=cart,
            product_id=product_id
        )

        if action == "increase":
            cart_item.quantity += 1

        else:  # decrease
            cart_item.quantity -= 1
            if cart_item.quantity <= 0:
                cart_item.delete()
                return Response(
                    {"message": "Product removed from cart"},
                    status=status.HTTP_200_OK
                )

        cart_item.save()

        return Response(
            {
                "message": "Quantity updated",
                "quantity": cart_item.quantity
            },
            status=status.HTTP_200_OK
        )


class ClearCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()

        return Response(
            {"message": "Cart cleared successfully"},
            status=status.HTTP_200_OK
        )


class CheckoutAPIView(APIView):
    """Simulated checkout / payment process"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        if not cart.items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total = 0
        for item in cart.items.all():
            total += item.product.price * item.quantity

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

        cart.items.all().delete()  # 🧹 vacía el carrito

        return Response(
            {
                "message": "Payment successful (simulated)",
                "order_id": order.pk,
                "total": total
            },
            status=status.HTTP_200_OK
        )
