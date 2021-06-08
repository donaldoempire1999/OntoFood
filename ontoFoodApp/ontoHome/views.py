from django.shortcuts import render
from django.views import View
from ontoFoodApp.onto_class import OntoFoodDao

# Create your views here.
class Home(View):
    def get(self, request):
        return render(request=request , template_name='ontoHome/index.html')




"""class TestView(View):
    def get(self , request):
        # ontoDao = OntoFoodDao.get_all_sauces()"""