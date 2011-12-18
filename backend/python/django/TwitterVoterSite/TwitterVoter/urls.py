from django.conf.urls.defaults import patterns, include, url


urlpatterns = patterns('',
    # TODO: The API bit should probably be a bit more resilient than simple views..
    url(r'^counts/$', 'TwitterVoter.views.counts'),
    url(r'^tweets/$', 'TwitterVoter.views.tweets'),
    
)