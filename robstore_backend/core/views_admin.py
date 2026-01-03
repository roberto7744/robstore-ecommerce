# pylint: disable=no-member
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Product
from .serializers import AdminProductSerializer


class AdminProductListCreateAPIView(generics.ListCreateAPIView):
    """
    Admin API:
    - GET  → Listar todos los productos
    - POST → Crear un nuevo producto (con imagen)
    """
    queryset = Product.objects.all()
    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]


class AdminProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin API:
    - GET    → Ver producto
    - PUT    → Editar producto
    - DELETE → Eliminar producto
    """
    queryset = Product.objects.all()
    serializer_class = AdminProductSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
