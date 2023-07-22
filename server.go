package main

import (
	dentist "server/api/dentist"
	"server/db"

	"github.com/labstack/echo"
)

var ()

func main() {
	echo := echo.New()
	postgresDB := db.ConnectDB()

	//service instance
	dentistService := dentist.New(postgresDB)

	//routing
	apiGroupRouter := echo.Group("/api")
	dentistGroupRouter := apiGroupRouter.Group("/dentist")

	//http instance
	dentist.NewHTTP(dentistService, dentistGroupRouter)

	// Start server
	echo.Logger.Fatal(echo.Start(":8080"))
}
