from tweepy.streaming import StreamListener, Stream
from django.core.management.base import BaseCommand
from django.conf import settings
from mystreamlistener import MyStreamListener
from TwitterVoter.models import HashTag, VoteOption

class Command(BaseCommand):
    args = '#hashtag #option1 #option2 ..'
    help = 'Starts the listener to the Twitter Streaming api.\n The first argument should be the hashtag for this vote. The following should be hashtags that express the options'

    def handle(self, *args, **options):
        if not args or len(args) < 3:
           self.stdout.write('No hashtags and/or options provided.\n')
        else:
            # Fetch info from DB
            hashtag_name = args.pop(0)
            hashtag = HashTag.objects.get(name = hashtag_name)
            options = VoteOption.objects.filter(hashtag=hashtag)
            self.stdout.write('Following: %s\n' % hashtag_name)
            self.stdout.write('Options: %s\n' % ', '.join(options))
            self.stdout.flush()

             # OAuth connect 
            consumer_key        = settings.TWITTERVOTER['consumer_key']
            consumer_secret     = settings.TWITTERVOTER['consumer_secret']
            access_token        = settings.TWITTERVOTER['access_token']
            access_token_secret = settings.TWITTERVOTER['access_token_secret']
            auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
            auth.set_access_token(access_token, access_token_secret)

            # Connect too the streaming API.
            mylisten = MyStreamListener(self.stdout)
            mystream = Stream(auth, mylisten,timeout=30)
            mystream.filter(track=args)