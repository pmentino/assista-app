FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl zip libzip-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_mysql

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Build frontend
RUN npm install && npm run build

EXPOSE 8000
CMD sh -c "php artisan migrate:fresh --seed --force && php artisan optimize:clear && php artisan serve --host=0.0.0.0 --port=8000"
