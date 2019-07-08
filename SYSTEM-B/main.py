from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def root():
    """
    Root router
    """
    return 'Welcome to BH Reco!'

@app.route("/generatenumber", methods=['GET'])
def generatenumber():
    """
    Generate Random Number
    """
    import random
    import json
    arr=[]
    
    
    # Genterating 6 random numbers 
    for x in range(2):
        arr.append(random.randrange(2,11,2))      
        arr.append(random.randrange(1,11,2))
        arr.append(random.randrange(2,11,2))
        arr.append(random.randrange(2,11,2))     
        
    return json.dumps(arr)


@app.route("/stats", methods=['GET'])
def stats():
    """
    Generate Random Number
    """
    import statistics
    import json

    arr=json.loads(request.args.get('entry'))
    # # x is odd count
    # # y is even count
    result = {
        "mean": statistics.mean(arr),
        "median": statistics.median(arr),
        "mode": statistics.variance(arr),
        "deviation": statistics.stdev(arr)
    }
    return json.dumps(result)
        
if __name__ == "__main__":
    app.run()