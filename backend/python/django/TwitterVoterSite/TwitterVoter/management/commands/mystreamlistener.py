# Source: http://alexkessinger.net/2010/09/06/storing-data-from-the-twitter-streaming-api-within-a-django-project/
# Twitter streaming imports
import tweepy
from tweepy.streaming import StreamListener, Stream
# Parsing stuff
from datetime import datetime
import locale
import simplejson
import string
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from TwitterVoter.models import HashTag, VoteOption
import sys

# Parses twitter dates stored in json # from twitter-python
def parse_datetime(string):
    # Set locale for date parsing
    locale.setlocale(locale.LC_TIME, 'C')

    # We must parse datetime this way to work in python 2.4
    date = datetime(*(time.strptime(string, '%a %b %d %H:%M:%S +0000 %Y')[0:6]))

    # Reset locale back to the default setting
    locale.setlocale(locale.LC_TIME, '')
    return date


# You need to subclass the StreamListener
class MyStreamListener(StreamListener):
    """docstring for MyStreamListener"""

    def __init__(self, hashtag, options, printer=sys.stdout):
        self.hashtag = hashtag
        self.options = options
        self._printer = printer
        self.api = "streaming"


    def on_data(self, data):
        d = simplejson.loads(data)
        self._printer.write(data)
        self._printer.write("\n")
        self._printer.flush()
        
        # Loop over all the hashtags, and increment all the options that are in the tweet.
        for option in self.options:
            if string.find(d['text'], option.name) > -1:
                option.votes += 1
                option.save()

        # Keep listening.
        return True


    def on_timeout(self):
        self._printer.write("we got a time out")

    def on_error(self, status_code):
        self._printer.write("we got an error %s" % (status_code))
        return False
