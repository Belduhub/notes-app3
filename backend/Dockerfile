# Gunakan Node.js versi LTS
FROM node:20-alpine
# Set working directory di dalam container
WORKDIR /app
# Copy package.json dan package-lock.json terlebih dahulu
# (untuk memanfaatkan Docker layer caching)
COPY package*.json ./

# Install dependencies (tanpa devDependencies)
RUN npm install --omit=dev
# Copy seluruh source code ke dalam container
COPY . .
# Expose port yang digunakan aplikasi
EXPOSE 8080
# Jalankan aplikasi
CMD ["node", "index.js"]
