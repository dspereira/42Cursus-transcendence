from datetime import datetime

class EmailVerificationWaitManager:

	def new_code_sended(self, otp_options, timestamp):
		otp_options.nbr_codes_sended += 1
		otp_options.last_code_sended_timestamp = timestamp
		otp_options.save()

	def reset(self, otp_options):
		otp_options.nbr_codes_sended = 0
		otp_options.last_code_sended_timestamp = 0
		otp_options.wait_time_timestamp = 0
		otp_options.save()

	def get_wait_time(self, otp_options):
		if otp_options.nbr_codes_sended:
			if datetime.now().timestamp() > otp_options.wait_time_timestamp:
				if not otp_options.nbr_codes_sended % 5:
					nbr_seconds = ((otp_options.nbr_codes_sended / 5) * 5) * 60
					otp_options.wait_time_timestamp = otp_options.last_code_sended_timestamp + nbr_seconds
				else:
					otp_options.wait_time_timestamp = 0
		otp_options.save()
		return otp_options.wait_time_timestamp
