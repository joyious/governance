# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY ./ /app/
ARG FRONTEND_ENV=production
ENV VUE_APP_ENV=${FRONTEND_ENV}
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]