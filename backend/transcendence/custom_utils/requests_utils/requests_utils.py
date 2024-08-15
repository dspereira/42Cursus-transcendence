from datetime import datetime, timedelta
import math

TIME_HOURS = 0
TIME_MINUTES = 5
TIME_SECONDS = 0

REQ_EXP_TIME_SECONDS = TIME_HOURS * 3600 + TIME_MINUTES * 60 + TIME_SECONDS

REQ_STATUS_ACCEPTED = "accepted"
REQ_STATUS_DECLINED = "declined"
REQ_STATUS_PENDING = "pending"
REQ_STATUS_ABORTED = "aborted"

def get_request_exp_time(request):
	current_time = datetime.now().timestamp()
	req_exp_time = request.exp.timestamp()
	diff_time_minutes = (req_exp_time - current_time) / 60
	if diff_time_minutes <= 0.3:
		return f"30 sec left"
	return f"{math.floor(diff_time_minutes) + 1} min left"

def update_request_status(request, new_status):
	if request:
		request.status = new_status
		request.save()

def set_exp_time(request):
	if request:
		request.exp = request.created + timedelta(seconds=REQ_EXP_TIME_SECONDS)
		request.save()
