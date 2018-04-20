module.exports = {

	apps : [

	// First application
	{
	  name      : 'API',
	  script    : 'index.js',
	  env: {
		COMMON_VARIABLE: 'true'
	  },
	  env_production : {
		NODE_ENV: 'production'
	  }
	},
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
	production : {
	  	user : 'node',
	  	host : '14.0.0.75',
		ref  : 'origin/master',
		repo : 'https://github.com/anhquoctran/vp9_camera.git',
		path : '.',
		'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
	},
	dev : {
		user : 'node',
		host : '127.0.0.1',
		ref  : 'origin/master',
		repo : 'https://github.com/anhquoctran/vp9_camera.git',
		path : '.',
		'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
		env  : {
			NODE_ENV: 'dev'
		}
	}
  }
};
