
package kafka

import (
	"encoding/json"
	"workshop/application/product"
	"workshop/infra/kafka"
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"log"
	"os"
	"time"
)

func Produce(msg *ckafka.Message) {
	producer := kafka.NewKafkaProducer()
	product := product.NewProduct()
	json.Unmarshal(msg.Value, &product)
	product.LoadPercentages()
	percentages, err := product.ExportJsonPercentage()
	if err != nil {
		log.Println(err.Error())
	}
	for _, p := range percentages {
		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)
		time.Sleep(time.Millisecond * 500)
	}
}
