from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.forms import ImageForm
import base64
import imghdr

def get_image_url(user):
    if user.profile_image:
        profile_image = bytes(user.profile_image)
        image_type = imghdr.what(None, h=profile_image)
        if image_type:
            profile_image_base64 = base64.b64encode(profile_image).decode("utf-8")
            image_url = f"data:image/{image_type};base64,{profile_image_base64}"
        else:
            return
    else:
        image_url = "https://api.dicebear.com/8.x/bottts/svg?seed=" + user.default_image_seed
    return image_url