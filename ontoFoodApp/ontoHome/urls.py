from os import name
from . import views
from django.urls import path

urls_patterns = [

     path('', views.Home.as_view(), name="home_view"),
     path('test', views.TestView.as_view(), name="test_view")   

]