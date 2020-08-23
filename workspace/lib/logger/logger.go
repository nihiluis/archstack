package logger

import "go.uber.org/zap"

// Logger wraps the actual logging library
// Unfinished design
type Logger struct {
	logger *zap.SugaredLogger
}

// NewService creates a new Logger service
func NewService() *Logger {
	zap, _ := zap.NewProduction()
	sugar := zap.Sugar()

	logger := &Logger{logger: sugar}

	return logger
}

// // Infof wraps zap infof
// func (l *Logger) Infof(template string, args ...interface{}) {
// 	l.logger.Infof(template, args)
// }

// // Debugf wraps zap debugf
// func (l *Logger) Debugf(template string, args ...interface{}) {
// 	l.logger.Debugf(template, args)
// }

// // Warnf wraps zap warnf
// func (l *Logger) Warnf(template string, args ...interface{}) {
// 	l.logger.Warnf(template, args)
// }

// // Errorf wraps zap errorf
// func (l *Logger) Errorf(template string, args ...interface{}) {
// 	l.logger.Errorf(template, args)
// }

// Infow wraps zap infow
func (l *Logger) Infow(template string, args ...interface{}) {
	l.logger.Infow(template, args)
}

// Debugw wraps zap Debugw
func (l *Logger) Debugw(template string, args ...interface{}) {
	l.logger.Debugw(template, args)
}

// Warnw wraps zap Warnw
func (l *Logger) Warnw(template string, args ...interface{}) {
	l.logger.Warnw(template, args)
}

// Errorw wraps zap errorw
func (l *Logger) Errorw(template string, args ...interface{}) {
	l.logger.Errorw(template, args)
}
