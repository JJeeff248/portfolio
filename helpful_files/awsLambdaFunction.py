"""
Send an email using AWS Lambda and SES

 * Email Format

    * Name: ${name}
    * Email: ${email}
    * Message: ${message}

    * reply to: ${email}
"""

import boto3
from botocore.exceptions import ClientError
import json

SENDER = "csphotography@chris-sa.com"
RECEVER = "csphotographynz@gmail.com"
AWS_REGION = "ap-southeast-2"


def lambda_handler(event, context):
    body = json.loads(event['body'])
    name = body['name']
    email = body['email']
    message = body['message']

    subject = 'New Message from ' + name
    body_text = "Name: " + name + "\nEmail: " + email + "\nMessage: " + message
    body_html = """<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        background-color: #f2f2f2;
        font-family: Arial, Helvetica, sans-serif;
      }

      main {
        margin: 0 auto;
        width: 90%;
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 0 10px #8b8b8b80;
      }

      img {
        width: 100%;
        max-width: 300px;
        display: block;
        margin: 0 auto;
      }

      h2 {
        text-align: left;
        margin-bottom: 0;
        font-size: 1rem;
      }

      div {
        padding: 10px;
      }

      div p {
        margin: 0;
      }

      #message {
        padding: 10px;
        margin-top: 10px;
        border-radius: 8px;
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
    <main>
      <img
        src="https://csphotography.chris-sa.com/images/logo_300.png"
        alt="CSPhotography"
      />
      <h2>Contact information:</h2>
      <div id="contact-info">
        <p>Name: """ + name + """</p>
        <p>Email: <a href="mailto:""" + email + """">""" + email + """</a></p>
      </div>
        <h2>Message:</h2>
        <div id="message">
          <p>""" + message + """</p>
        </div>
    </main>
  </body>
</html>
"""

    CHARSET = "UTF-8"

    client = boto3.client('ses', region_name=AWS_REGION)

    if event['headers']['origin'] != 'https://csphotography.chris-sa.com':
        return {
            'statusCode': '400',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': 'Origin not allowed'
        }

    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECEVER,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': body_html,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': body_text,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': subject,
                },
            },
            Source=SENDER,
            ReplyToAddresses=[
                email,
            ],
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': '400',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': e.response['Error']['Message']
        }
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])
        return {
            'statusCode': '200',
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': 'Email sent! Message ID: ' + response['MessageId']
        }
