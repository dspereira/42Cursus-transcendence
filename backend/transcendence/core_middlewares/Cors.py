
# Configurations of cors headers

origin_name = "Access-Control-Allow-Origin"
origin_data = [
    "http://127.0.0.1:8080",
]

headers_name = "Access-Control-Allow-Headers"
headers_data = [
    "Content-Type",
]

methods_name = "Access-Control-Allow-Methods"
methods_data = [
    "GET",
    "POST",
    "DELETE",
]

class Cors:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return process_response(self.get_response(request))

def process_response(response):

    create_header(response, origin_name, origin_data)
    create_header(response, headers_name, headers_data)
    create_header(response, methods_name, methods_data)

    return response

def create_header(response, name, data):

    response[name] = ""
    list_len = len(data)
    if (list_len == 0):
        return response
    for idx, item in enumerate(data):
        if (idx < list_len - 1):
            item += ", "
        response[name] += item
    return response
    