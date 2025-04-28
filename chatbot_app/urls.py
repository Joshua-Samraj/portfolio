from django.urls import path
from . import views

urlpatterns = [

    path('chat/', views.chat_view, name='chat'),
    path('api/chat/', views.chat_api, name='chat_api'),
    path('', views.portfolio_view, name='portfolio'),
]
