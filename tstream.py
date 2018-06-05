#!venv/bin/python

# all the imports


from flask import Flask, request
from config import CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET
import re
import json
import sys
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import requests


import tweepy, redis
import simplejson as json

red = redis.StrictRedis()
with open('cities.json') as json_data:
    cities = json.load(json_data)

def findWholeWord(w):
   return re.compile(r'\b({0})\b'.format(w), flags=re.IGNORECASE).search

def get_coordinates(locator):

    geolocator = Nominatim()
    url = "https://geocode.xyz/"+locator+"?json=1"


    try:

        location = geolocator.geocode(locator,timeout = 10)
        #location = requests.get(url)

        #print ('wtf')
        #print (location.json())
        #output = location.json() for xyz
        #long = output['longt'] for xyz
        #lat = output['latt'] for xyz
        long = location.longitude
        lat = location.latitude
        print ('fucking works')
        return [lat, long]
    except GeocoderTimedOut as e:
        print("Error: geocode failed on input %s with message %s" % (location, e.msg))






# listener that handles streaming data
class StdOutListener(tweepy.StreamListener):

    # method called when raw data is received from connection
    def on_data(self, data):
        decoded = json.loads(data)
        print(decoded)
        # listen only for tweets that is geo-location enabled
        try:

            if decoded['geo']:
                tweet = {}
                tweet['screen_name'] = '@'+decoded['user']['screen_name']
                tweet['text'] = decoded['text'].encode('ascii', 'ignore')
                tweet['coord'] = decoded['geo']['coordinates']
                tweet['created_at'] = decoded['created_at']
                print 'A tweet received'
                print tweet
                # publish to 'tweet_stream' channel
                red.publish('tweet_stream', json.dumps(tweet))
                return True
            elif decoded['coordinates']:
                location = decoded['coordinates'].encode('ascii', 'ignore')
                print ('A tweet with no geo data but with coordinates received from ' + location)
            elif decoded['place']:
                place = decoded['place'].encode('ascii', 'ignore')
                print ('A tweet with no geo data or coordinated but with place received from ' + place)
            elif decoded['user']['location']:

                location = decoded['user']['location'].encode('ascii', 'ignore')
                if get_coordinates(location):

                    geo = get_coordinates(location)
                    tweet = {}
                    tweet['screen_name'] = '@' + decoded['user']['screen_name']
                    tweet['text'] = decoded['text'].encode('ascii', 'ignore')
                    tweet['coord'] = geo
                    tweet['created_at'] = decoded['created_at']
                    print ('A tweet received via user location' + location)
                    print tweet
                    #publish to 'tweet_stream' channel
                    red.publish('tweet_stream', json.dumps(tweet))
                    sys.exit("Error message")
                    return True
            else:
                print 'Hello'
                #print ('A tweet with no geo data or location or place received ' + '@'+decoded['user']['screen_name'] + ' ' + decoded['user']['location'])
        except:
            pass

    def on_error(self, status):
        print status

