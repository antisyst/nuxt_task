FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-stage /app/.output /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]