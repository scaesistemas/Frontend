#!/bin/bash
if [ $ambiente == "development" ]; then
    npm run build-dev
else
    npm run build
    sed -i 's/development/sistema/g' appspec.yml
fi

echo '#!/bin/bash' > before_install.sh
echo 'sudo rm -fr /opt/codedeploy-agent/deployment-root/deployment-instructions' >> before_install.sh

if [ $ambiente == "development" ]; then
    echo 'cp -a /var/www/development/.htaccess /var/www/temp/' >> before_install.sh
    echo 'rm -rf /var/www/development/' >> before_install.sh
else
    echo 'cp -a /var/www/sistema/.htaccess /var/www/temp/' >> before_install.sh
    echo 'rm -rf /var/www/sistema/' >> before_install.sh
fi

echo '#!/bin/bash' > after_install.sh

if [ $ambiente == "development" ]; then
    echo 'cp -a /var/www/temp/.htaccess /var/www/development' >> after_install.sh
else
    echo 'cp -a /var/www/temp/.htaccess /var/www/sistema' >> after_install.sh
fi