function showImage() {
    var user_id = document.getElementById("user_id").value;
    var request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:8000/api/profile/showimage?user_id=" + user_id, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.image_url) {
                document.getElementById("imageContainer").innerHTML = "<image src='" + response.image_url + "' alt='User Image'>";
            } else {
                alert("Error: " + response.message);
            }
        }
    };
    request.send();
}