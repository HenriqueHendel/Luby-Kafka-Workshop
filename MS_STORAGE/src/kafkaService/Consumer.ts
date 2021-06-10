import { Kafka, Consumer as KafkaConsumer } from "kafkajs";
import PurchaseProducService from "../services/PurchaseProductService";

interface IConsumeProps {
  topic: string;
  fromBeginning: boolean;
}

export default class Consumer {
  private consumer: KafkaConsumer;

  constructor(groupId: string) {
    const kafka = new Kafka({
      brokers: ["luby-kafka-workshop_kafka_1:29092"],
    });

    this.consumer = kafka.consumer({ groupId });
  }

  public async consume({ topic, fromBeginning }: IConsumeProps): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning });

    console.log("Iniciando busca...");

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = message.value?.toString();

        if (data !== undefined) {
          const { id, quantity } = JSON.parse(data);

          const service = new PurchaseProducService();

          const product = await service.execute({ id, quantity });

          console.log("product", product);
        }
      },
    });
  }
}
