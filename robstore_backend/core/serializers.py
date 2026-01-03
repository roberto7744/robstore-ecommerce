from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "created_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "total", "items", "created_at"]


# ✅ NUEVO — JWT con info de admin
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that adds user role information
    (username and is_staff) to the token payload.
    """

    # pylint: disable=abstract-method

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["is_staff"] = user.is_staff

        return token

class AdminProductSerializer(serializers.ModelSerializer):
    """
    Serializer para CRUD admin de productos.
    Acepta category por ID e image por archivo.
    """

    class Meta:
        model = Product
        fields = "__all__"
        
        
    
