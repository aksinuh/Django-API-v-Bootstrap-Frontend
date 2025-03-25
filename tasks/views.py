from django.shortcuts import render,redirect




def tasks(request):
    return render(request,"tasks.html")

