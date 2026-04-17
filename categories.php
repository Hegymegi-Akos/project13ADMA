# Apache rewrite szabályok

<IfModule mod_rewrite.c>
    RewriteEngine On

    # API kérések átirányítása
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ api/$1 [L]
</IfModule>

# Környezeti változók
<IfModule mod_env.c>
    SetEnv ADMIN_SECRET Admin123
</IfModule>

# CORS headerek
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With, X-Admin-Secret"
    Header always set Access-Control-Max-Age "3600"
</IfModule>

# OPTIONS preflight kezelése - adjunk üres 200-as választ
<IfModule mod_rewrite.c>
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ - [R=200,L]
</IfModule>
