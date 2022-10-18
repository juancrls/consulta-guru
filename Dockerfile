FROM danlynn/ember-cli:4.4.0-node_16.15
COPY package.json package-lock.json* ./
RUN npm ci && npm install -g firebase-tools && npm cache clean --force 
COPY . .
RUN ember build --prod
CMD firebase deploy --token ${FIREBASE_TOKEN}
EXPOSE 4200