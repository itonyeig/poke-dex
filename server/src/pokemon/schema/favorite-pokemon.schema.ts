import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type FavoritePokemonDocument = FavoritePokemon & Document<Types.ObjectId>;

@Schema({
  timestamps: true,
  collection: 'favorite-pokemon',
})
export class FavoritePokemon {
  @Prop({ required: true, unique: true })
  pokemonId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], default: [] })
  types: string[];

  @Prop({ type: [String], default: [] })
  abilities: string[];

//   @Prop({
//     type: [
//       {
//         species: { type: String, required: true },
//         trigger: { type: String, default: null },
//         minLevel: { type: Number, default: null },
//         item: { type: String, default: null },
//       } satisfies SchemaDefinition<EvolutionOption>,
//     ],
//     default: [],
//   })
//   evolutions: EvolutionOption[];
}

export const FavoritePokemonSchema = SchemaFactory.createForClass(FavoritePokemon);

