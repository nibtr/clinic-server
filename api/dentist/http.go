package dentist

import (
	"net/http"
	"server/model"

	"github.com/labstack/echo"
)

type HTTP struct {
	service Service
}

type Service interface {
	GetAll(c echo.Context) ([]*model.Dentist, error)
}

func NewHTTP(service Service, routeGroup *echo.Group) {
	http := HTTP{service}
	routeGroup.GET("", http.list)
}

func (h *HTTP) list(c echo.Context) error {
	dentists, err := h.service.GetAll(c)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, dentists)
}
