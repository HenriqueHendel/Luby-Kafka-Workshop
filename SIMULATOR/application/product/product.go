package product

import (
	"bufio"
	"encoding/json"
	"os"
)

type Product struct {
	ProductID  int     `json:"productId"`
	PurchaseID int   `json:"purchaseId"`
	Percentages []string `json:"percentage"`
}

type PartialProductPercentage struct {
	ProductID int    `json:"productId"`
	PurchaseID int   `json:"purchaseId"`
	Percentage []string `json:"percentage"`
	Finished bool      `json:"finished"`
}

func NewProduct() *Product {
	return &Product{}
}

func (p *Product) LoadPercentages() error {
	f, err := os.Open("percentages/percentages.txt")
	if err != nil {
		return err
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		p.Percentages = append(p.Percentages, scanner.Text())
	}
	return nil
}

func (p *Product) ExportJsonPercentage() ([]string, error) {
	var product PartialProductPercentage
	var result []string
	total := len(p.Percentages)
	for k, v := range p.Percentages {
		product.ProductID = p.ProductID
		product.PurchaseID = p.PurchaseID
		product.Percentage = []string{v}
		product.Finished = false
		if total-1 == k {
			product.Finished = true
		}
		jsonProduct, err := json.Marshal(product)
		if err != nil {
			return nil, err
		}
		result = append(result, string(jsonProduct))
	}
	return result, nil
}