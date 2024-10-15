from custom_decorators import accepted_methods
from django.http import HttpResponse

@accepted_methods(['GET'])
def check(request):
    return HttpResponse(status=200)
