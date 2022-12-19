FROM danlynn/ember-cli:4.4.0-node_16.15

RUN npm install -g ember-cli

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["ember", "test"]