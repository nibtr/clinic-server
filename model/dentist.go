package model

type Dentist struct {
	ID   int    `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}
