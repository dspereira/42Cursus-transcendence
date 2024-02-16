
# Configurations of cors

class Cors:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return response_process(self.get_response(request))


def response_process(response):

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    response["Access-Control-Allow-Methods"] = "PUT, PATCH, DELETE"

    print(response["Access-Control-Allow-Origin"])

    return response