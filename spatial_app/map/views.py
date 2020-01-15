from django.shortcuts import render

# Create your views here.
def sa_home_index(request):
    return render(request,'sa_index.html')