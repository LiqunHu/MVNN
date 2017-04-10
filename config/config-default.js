var config = {
    // for db`
    dialect: 'mysql',
    database: 'test',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: 3306,
    // for
    loggerConfig: {
        level: 'DEBUG',
        config: {
            "appenders": [{
                "type": "clustered",
                "appenders": [{
                        "type": "dateFile",
                        "filename": "log/access.log",
                        "pattern": "-yyyy-MM-dd",
                        "category": "http"
                    },
                    {
                        "type": "file",
                        "filename": "log/app.log",
                        "maxLogSize": 10485760,
                        "numBackups": 3
                    },
                    {
                        "type": "logLevelFilter",
                        "level": "ERROR",
                        "appender": {
                            "type": "file",
                            "filename": "log/errors.log"
                        }
                    }
                ]
            }]
        }
    },
    // SECRET_KEY
    SECRET_KEY: 'zc7#_66#g%u2n$j_)j$-r(swt63d(2l%wc2y=wqt_m8kpy%04*'

};

module.exports = config;
