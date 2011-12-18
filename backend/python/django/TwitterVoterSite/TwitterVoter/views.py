from django.http import HttpResponse

def counts(request):
    content = '{"total":181, "options": [{"name": "#awesome", "count": 144}, {"name": "#sucks", "count": 37}]}';
    return HttpResponse(content, content_type="application/json")

def tweets(request):
    content = "[]"
    return HttpResponse(content, content_type="application/json")