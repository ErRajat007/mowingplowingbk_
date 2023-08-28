const settings = env => {
  const clientUrl =
    env === 'dev'
      ? 'http://localhost:3001'
      : '<domain-name>'; //'http://IP'
  const apiBaseUrl =
    env === 'dev'
      ? 'http://localhost:3001'
      : '<domain-name>:4000'; //'http://IP:4000'
  const sendgridApiKey =
    env === 'dev'
      ? ''
      : '';
  const mysqlPassword =
    env === 'dev' ? '' : '';

  const mysqlHost =
    env === 'dev' ? 'localhost' : 'localhost';

  const mysqlUser = env === 'dev' ? 'root' : 'root';

  return {
    port: 3001,
    db: {
      host: 'localhost',
      name: 'stage_mowingplowing',//data base ko connect kiya gaya h
      user: mysqlUser,
      password:mysqlPassword
    },
    role: {
      admin: 2,
      normal: 1
    },
    token: {
      secret: 'react sdgfa dsf asdfasdf',
      expired: '1d',
      maxAge: 2.592e9
    },
    bcrypt: {
      saltRounds: 10
    },
    clientUrl: clientUrl,
    apiBaseUrl: apiBaseUrl,
    sendgridApiKey: sendgridApiKey,
    errCode: {
      1000: 'User not exist',
      1001: 'Wrong email or password',
      1002: 'Permission denied',
      1004: 'User not exist'
    },
    aws: {
      AWS_ACCESS_KEY: '',
      AWS_SECRET_KEY: '/',
      BUCKET: '<bucket-name>'
    },
    STRIPE_TEST_SECRET_KEY: '',
    GOOGLE_KEY: ''
  };
};

const config =
  process.env.NODE_ENV === 'development' ? settings('dev') : settings('prod');

console.log('Running variant:3001');
module.exports = config;