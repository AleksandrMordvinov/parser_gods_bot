import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Context } from 'telegraf';
import { Update, Ctx, Hears } from 'nestjs-telegraf'
import axios from 'axios';
import { Console } from 'console';

@Injectable()
export class CardsService {
  create(createCardDto: CreateCardDto) {
    return 'This action adds a new card';
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }



 async getAllCardsEth(){
  const num = 5300
  const URL_ETH = `https://marketplace-api.immutable.com/v1/stacked-assets/0xacb3c6a43d15b907e8433077b6d38ae40936fe2c/search?direction=asc&order_by=buy_quantity_with_fees&page_size=${num}&token_type=ETH`
  const URL_GODS = `https://marketplace-api.immutable.com/v1/stacked-assets/0xacb3c6a43d15b907e8433077b6d38ae40936fe2c/search?direction=desc&order_by=buy_quantity_with_fees&page_size=${num}&token_address=0xccc8cb5229b0ac8069c51fd58367fd1e622afd97&token_type=ERC20`
  const price = await this.getPrice()
  
  const oldCards = await this.getCards(URL_ETH, price.ethereum.usd)
  const array = []

    setInterval(async ()=>{
      try {
        const newCards = await this.getCards(URL_ETH, price.ethereum.usd)
        newCards && oldCards.forEach(item=>{
          if(array.length>0&&array.find(it=>it.name===item.name&&it.quality===item.quality)) return

          let card = newCards.find(el=>el.name === item.name && el.quality === item.quality)
          if (card === undefined) return
          
          
          if (
           item.price > card.price &&
           item.price > card.price + card.price * 0.3
          ){
            
            
            array.push(card)
            
          }
        })
        console.log(array, array.length, oldCards.length, newCards.length)
      } catch (error) {
        console.log(error)
      }
    
   
    //console.log(arrayCardsETH)
    //return array;
  }, 20000)

     return array;
 }



 async getCards(URL, price){
  try {
    const arrayCards=[]
    const resp = await axios.get(URL);
    
    resp.data.result.map((el, index) => {
      
        const cards = {
        id: index,
        proto: el.asset_stack_search_properties.proto,
        name: el.name,
        image: el.image_url,
        price: Number(el.assets_floor_price.quantity_with_fees) *0.000000000000000001,
        quality: el.asset_stack_properties.quality,
        rarity: el.asset_stack_search_properties.rarity,
        set: el.asset_stack_search_properties.set,
        priceUSD:(Number(el.assets_floor_price.quantity_with_fees) *0.000000000000000001)*price,
        token_type: el.assets_floor_price.token_type,
       
      }
          arrayCards.push(cards)
    })
    return arrayCards
  }
  
  
   catch (error) {
    console.log(error, '-------------------------------')
  }
 }

 async calculatePrice(arrOld, arrNew, price_USD, array){
  try {
    const cardsArr=[]
 await arrNew&&arrOld.forEach(oldCard=>{
    let card = arrNew.find(el=>el.name === oldCard.name && el.quality === oldCard.quality&&el.token_type === oldCard.token_type)
    if (card === undefined) return
    
    if (oldCard.price > card.price+card.price*0.2){
      let percent1 = 1 - card.price / oldCard.price;
      let percent = (percent1 * 100).toFixed(2);

      let meteoritePriceETH=0
      let shadowPriceETH = 0
      let goldPriceETH = 0
      let diamondPriceETH =0
      let meteoritePriceGODS=0
      let shadowPriceGODS = 0
      let goldPriceGODS = 0
      let diamondPriceGODS =0

      arrOld.forEach(it=>{
        if(card.name === it.name) {
          if(it.quality === 'Meteorite') {meteoritePriceETH = it.priceUSD}
          if(it.quality === 'Shadow') {shadowPriceETH = it.priceUSD}
          if(it.quality === 'Gold') {goldPriceETH = it.priceUSD}
          if(it.quality === 'Diamond') {diamondPriceETH = it.priceUSD}
        }
      })

            array.forEach(it=>{
        if(card.name === it.name) {
          if(it.quality === 'Meteorite') {meteoritePriceGODS = it.priceUSD}
          if(it.quality === 'Shadow') {shadowPriceGODS = it.priceUSD}
          if(it.quality === 'Gold') {goldPriceGODS = it.priceUSD}
          if(it.quality === 'Diamond') {diamondPriceGODS = it.priceUSD}
        }
      })
         
       
      cardsArr.push({
        proto: card.proto,
        quality: card.quality,
        rarity: card.rarity,
        set: card.set,
        old_price: +oldCard.price*price_USD,
        new_price: +card.price*price_USD,
        percent,
        token_type: card.token_type,
        name: card.name,
        image: card.image,
        price: card.price,
        meteoritePriceETH: meteoritePriceETH.toFixed(2),
        shadowPriceETH:shadowPriceETH.toFixed(2),
        goldPriceETH:goldPriceETH.toFixed(2),
        diamondPriceETH:diamondPriceETH.toFixed(2),
        meteoritePriceGODS: meteoritePriceGODS.toFixed(2),
        shadowPriceGODS: shadowPriceGODS.toFixed(2),
        goldPriceGODS: goldPriceGODS.toFixed(2),
        diamondPriceGODS: diamondPriceGODS.toFixed(2),
      })
      oldCard.price=card.price
      oldCard.priceUSD=card.priceUSD
    }
  })
  
  

  return await cardsArr
  } catch (error) {
    console.log(error, '------------------------------')
  }
 }

 async getPrice(){
  try {
    const resp = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum%2Cgods-unchained',
    )
    //console.log(resp.data.ethereum.usd);
    return resp.data;
  } catch (e) {
    console.log(e, '+++++++++++++++++++++++++++++++++++++++++++');
  }
 }



}
