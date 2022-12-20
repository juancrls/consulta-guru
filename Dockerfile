FROM danlynn/ember-cli:4.4.0-node_16.15

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["ember", "test"]