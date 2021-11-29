FROM nats-streaming:0.23.2-alpine3.14

LABEL maintainer=guligon90@gmail.com

COPY entrypoint.sh /usr/local/bin

RUN chmod 777 /usr/local/bin/entrypoint.sh \
   && ln -s /usr/local/bin/entrypoint.sh /

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 4222 8222

CMD [ \
  "nats-streaming-server", \
  # Port published for clients' connection
  "-p", \
  "4222", \
  # Port published for monitoring the streaming server (eg. via http://localhost:8222/streaming)
  "-m", \
  "8222", \
  # How often the streaming server is going to do a heartbeat (hb) request to each of its clients
  "-hbi", \
  "5s", \
  # How log each client has to respond to a hb request
  "-hbt", \
  "5s", \
  # Number of times that each client can fail before the streaming server assumes that the client connection is dead and gone
  "-hbf", \
  "2", \
  # Enable STAN debugging output
  "-SD", \
  # Cluster identification (for STAN building)
  "-cid", \
  "healthcheck" \
]
