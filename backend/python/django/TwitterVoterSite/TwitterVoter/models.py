from django.db import models


class HashTag(models.Model):
    name = models.CharField(max_length=30)

    def __unicode__(self):
        return self.name

class VoteOption(models.Model):
    hashtag = models.ForeignKey(HashTag)
    name    = models.CharField(max_length=30)
    votes   = models.IntegerField()

    def __unicode__(self):
        return self.name