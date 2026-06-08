import urllib.request
import urllib.parse
import re
import json

def get_image_url(query):
    try:
        # Encode the query
        url = "https://www.bing.com/images/search?q=" + urllib.parse.quote(query) + "&form=HDRSC2&first=1"
        
        # Build request with a standard browser User-Agent
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}
        )
        
        # Fetch the HTML page
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
        # Search for murl (media URL) inside the Bing JSON attributes
        # Bing stores image info in json format: murl":"http://..."
        matches = re.findall(r'murl&quot;:&quot;(http.*?)&quot;', html)
        if not matches:
            # Try alternate match if the format is slightly different
            matches = re.findall(r'"murl"\s*:\s*"(http.*?)"', html)
            
        if matches:
            # Filter out some bad extensions if any, or return the first hit
            for m in matches:
                # Make sure it looks like a clean image URL
                if any(ext in m.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    return m
            return matches[0]
            
        return None
    except Exception as e:
        print(f"Error scraping for query '{query}': {e}")
        return None

# Test with a few items
test_queries = ["Paneer Indian food", "Motichoor Laddu sweet", "Ratlami Sev snack"]
for q in test_queries:
    img = get_image_url(q)
    print(f"Query: {q} => Image URL: {img}")
