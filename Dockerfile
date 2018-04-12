#使用nodejs
FROM finfosoft/nodejs-cnpm

#维护者信息
MAINTAINER niuzhifa "1944044667@qq.com"

ADD ff-intelligent-web-test.tar /home/app/webapps/

WORKDIR /home/app/webapps/ff-intelligent-web-test

RUN npm install

RUN npm install -g http-server

RUN npm run build

WORKDIR /home/app/webapps/ff-intelligent-web-test/dist

EXPOSE 8080

CMD ["hs"]
