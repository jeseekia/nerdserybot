# token_response_data = "$(curl --location 'https://id.twitch.tv/oauth2/device' --form client_id=$TWITCH_CLIENT_ID --form scopes='chat:read chat:edit')"
TOKEN_RESPONSE_DATA = "$(echo "$(curl -s --location 'https://id.twitch.tv/oauth2/device' --form client_id=$TWITCH_CLIENT_ID --form scopes='chat:read chat:edit')")"
# token_response_data
# curl --location 'https://id.twitch.tv/oauth2/token' --form client_id=$TWITCH_CLIENT_ID --form scope="chat:read chat:edit" --form device_code=$TWITCH_DEVICE_CODE --form grant_type="urn:ietf:params:oauth:grant-type:device_code"