package migration

import (
	"fmt"

	"server/model"

	"gorm.io/gorm"
)

func Run(mysqlDB *gorm.DB) {

	if !mysqlDB.Migrator().HasTable(&model.Dentist{}) {
		mysqlDB.Migrator().CreateTable(&model.Dentist{})
		mysqlDB.Model(&model.Dentist{}).Create([]map[string]interface{}{
			{"name": "jinzhu_1", "age": 18},
			{"name": "jinzhu_2", "age": 20},
		})
	}

	fmt.Println("--------------------- DB migrated! ---------------------")
}
