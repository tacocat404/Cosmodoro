# One container: the server (sign-in, sync, calendar feed) also serves the web pages.
# The SQLite file lives in /data, so mount a volume there or it's gone on every deploy.
FROM node:24-slim
WORKDIR /app
COPY server/package.json server/package-lock.json server/
RUN npm ci --omit=dev --prefix server
COPY server/src server/src
COPY apps/web apps/web
ENV NODE_ENV=production PORT=8787 DB_PATH=/data/cosmodoro.db
EXPOSE 8787
CMD ["node", "server/src/index.js"]
