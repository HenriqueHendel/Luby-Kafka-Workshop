import { Kafka, Consumer as KafkaConsumer } from "kafkajs";
import { socketServer } from "../server";

interface IConsumer {
  groupId: string;
}

interface IConsume {
  topic: string;
  fromBeginning: boolean;
}

export default class Consumer {
  private consumer: KafkaConsumer;

  constructor({ groupId }: IConsumer) {
    const kafka = new Kafka({
      brokers: ["workshop_kafka_1:29092"],
    });

    this.consumer = kafka.consumer({ groupId });
  }

  public async consume({ topic, fromBeginning }: IConsume) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning });

    console.log(`Consuming topic ${topic}`);
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value?.toString(),
        });

        socketServer.emit("new-percentage", message.value?.toString());
      },
    });
  }
}
