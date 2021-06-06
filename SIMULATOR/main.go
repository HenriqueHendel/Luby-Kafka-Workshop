package main

import (
	"fmt"
	"workshop/application/product"
	"workshop/infra/kafka"
	"github.com/joho/godotenv"
	"log"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	kafka2 "workshop/application/kafka"
)

func testReadFile() {
	product:= product.Product{
		ProductID: 1,
	}

	product.LoadPercentages()
	stringjson, _ := product.ExportJsonPercentage()
	fmt.Println(stringjson[0])
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loafing .env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)

	go consumer.Consume()

	for msg := range msgChan {
		go kafka2.Produce(msg)
		fmt.Println(string(msg.Value))
	}
	// producer := kafka.NewKafkaProducer()
	// kafka.Publish("Henrique", "new-percentage", producer)

	// for {
	// 	_ = 1
	// }

}