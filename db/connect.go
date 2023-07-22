package db

import (
	"fmt"
	"server/db/migration"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const (
	host     = "localhost"
	port     = 3306
	user     = "csdl"
	password = "csdl"
	dbname   = "csdl"
)

func ConnectDB() *gorm.DB {
	dbConn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, dbname)
	mysqlDB, err := gorm.Open(mysql.Open(dbConn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	fmt.Println("--------------------- DB connected! ---------------------")
	migration.Run(mysqlDB)
	return mysqlDB
}
