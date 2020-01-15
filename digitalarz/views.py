from django.http import HttpResponse
from django.shortcuts import render
import urllib3

def home_index(request):
    return render(request, "index.html")


def sms_service(request):
    # paramsJson = get_url_params(request)
    contact_no = '03224785104'; #request.POST.get('contact_no')
    # dataUrl = 'http://pnddch.info/irrigation/onlinedataservice' + paramsJson
    # dataUrl = 'https://localhost:9898/irrigation/onlinedataservice' + paramsJson
    # data_url = shorten_url(dataUrl)

    # sms_url = 'http://api.bizsms.pk/api-send-branded-sms.aspx?username=d-sales-ay@bizsms.pk&pass=p5890hg99&text='+data_url\
    #           +'&masking=P&DD-FERRP&destinationnum='+contactNo+'&language=English'
    username="d-sales-ay@bizsms.pk"
    password= "s3al229d"
    message = "welcome to biz sms"
    sms_url = 'http://api.bizsms.pk/api-send-branded-sms.aspx?username=%s&pass=%s&text=%s' \
              '&destinationnum=%s&language=English' %(username,password,message,contact_no)

    # response = urllib2.urlopen(sms_url)
    http = urllib3.PoolManager()
    r = http.request('GET', sms_url)
    print(r.status)
    print(r.data)
    html = r.data
    return HttpResponse(html)
