package dentist

import (
	"server/model"

	"gorm.io/gorm"
)

type DentistService struct {
	PostgresDB *gorm.DB
	DentistDB  *gorm.DB
}

func New(postgresDB *gorm.DB) *DentistService {
	dentistDB := postgresDB.Model(&model.Dentist{})

	return &DentistService{
		PostgresDB: postgresDB,
		DentistDB:  dentistDB,
	}
}
