import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritePokemon, FavoritePokemonSchema } from './schema/favorite-pokemon.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FavoritePokemon.name, schema: FavoritePokemonSchema }]),
    CacheModule.register({
      ttl: 86400000, // 1 day in milliseconds
      max: 50, // maximum number of items in cache
    }),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
