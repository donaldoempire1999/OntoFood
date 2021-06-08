import json
from django.http.response import HttpResponse
from django.shortcuts import render, resolve_url
from django.views import View
from ontoFoodApp.onto_class import OntoFoodDao

# Create your views here.
class Home(View):
    def get(self, request):
        return render(request=request , template_name='ontoHome/index.html')




class TestView(View):
    def get(self , request):
        ontoDao = OntoFoodDao()
        sauces = ontoDao.get_all_sauces()
        print(sauces)
        
        return render(request=request, template_name="ontoHome/sauces.html", context={'sauces': sauces})