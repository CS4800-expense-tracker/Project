import sys
import urllib.request

response_code = urllib.request.urlopen("https://www.stackoverflow.com").getcode()

if response_code == 200:
    sys.exit()
else:
    sys.exit(1)
