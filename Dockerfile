FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN ls -la && npm ci --verbose 2>&1
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
