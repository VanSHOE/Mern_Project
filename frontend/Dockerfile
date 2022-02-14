# Stage 1
FROM node:14 as build-stage
WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
# Stage 2
# FROM nginx:1.17.0-alpine
# COPY --from=build-stage /frontend/build /usr/share/nginx/html
# EXPOSE 3000
# CMD nginx -g 'daemon off;'
RUN npm install -g serve
CMD serve -s build