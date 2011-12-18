from django.contrib import admin
from models import HashTag, VoteOption

class HashTagAdmin(admin.ModelAdmin):
    list_display = ['name']

class VoteOptionAdmin(admin.ModelAdmin):
    list_display = ['hashtag', 'name', 'votes']    

admin.site.register(HashTag, HashTagAdmin)
admin.site.register(VoteOption, VoteOptionAdmin)