// import winston from 'winston';
// import config from './config.js';

// const customLevelsOptions = {
//     levels: {
//         fatal: 0,
//         error: 1,
//         warning: 2,
//         info: 3,
//         http: 4,
//         debug: 5
//     },
//     colors: {
//         fatal: 'red',
//         error: 'cyan',
//         warning: 'yellow',
//         http: 'green',
//         info: 'blue',
//         debug: 'white'
//     }
// };

// winston.addColors(customLevelsOptions.colors);

// // Formato específico para la consola que incluye colorización
// const consoleFormat = winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     winston.format.colorize({ all: true }),
//     winston.format.printf(info => `${info.timestamp} - ${info.level} --- ${info.message}`)
// );

// // Formato específico para archivos sin colorización
// const fileFormat = winston.format.combine(
//     winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
//     winston.format.json(info => `${info.timestamp} - ${info.level} --- ${info.message}`)
// );

// // Logger para desarrollo
// const devLogger = winston.createLogger({
//     levels: customLevelsOptions.levels,
//     format: consoleFormat,
//     transports: [
//         new winston.transports.Console({ level: 'debug' }),
//         new winston.transports.File({
//             filename: 'logs/error.log',
//             level: 'error',
//             format: fileFormat
//         }),
//     ],
// });

// // Logger para producción
// const prodLogger = winston.createLogger({
//     levels: customLevelsOptions.levels,
//     format: consoleFormat, 
//     transports: [
//         new winston.transports.Console({ level: 'info' }), 
//         new winston.transports.File({
//             filename: 'logs/error.log',
//             level: 'error',
//             format: winston.format.combine(
//                 winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
//                 winston.format.json()
//             )
//         }),
//     ],
// });

// export const addLogger = (req, res, next) => {
//     req.logger = config.environment === 'dev' ? devLogger : prodLogger;
//     next();
// };

import winston from 'winston';

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'cyan',
    warning: 'yellow',
    http: 'green',
    info: 'blue',
    debug: 'white'
  }
};

winston.addColors(customLevelsOptions.colors);

// Formateador para consola que incluye colorización.
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => `${info.timestamp} - ${info.level} --- ${info.message}`)
);

// Formateador para archivos sin colorización, usando formato JSON.
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);


const logger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat
    })
  ]
});


export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
