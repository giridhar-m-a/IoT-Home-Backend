import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Temperature {
    @Prop({ required: true })
    temperature: number;
}