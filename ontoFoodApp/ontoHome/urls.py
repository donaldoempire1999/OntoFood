from . import views
from django.urls import path

urls_patterns = [

     path('', views.Home.as_view(), name="home_view")   

]