FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm run ci

COPY . .

RUN npm run build

# Usa un servidor estático como nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
