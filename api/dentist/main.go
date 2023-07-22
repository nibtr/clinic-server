package dentist

import (
	"server/model"

	"github.com/labstack/echo"
)

func (svc *DentistService) GetAll(c echo.Context) ([]*model.Dentist, error) {
	var dentists []*model.Dentist
	if res := svc.DentistDB.Find(&dentists); res.Error != nil {
		return nil, res.Error
	}

	return dentists, nil
}
