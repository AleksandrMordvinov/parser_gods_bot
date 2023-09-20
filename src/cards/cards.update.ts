import { Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { CardsService } from './cards.service';


const URL_ETH = `https://marketplace-api.immutable.com/v1/stacked-assets/0xacb3c6a43d15b907e8433077b6d38ae40936fe2c/search?direction=asc&order_by=buy_quantity_with_fees&page_size=5500&token_type=ETH`
const URL_GODS = `https://marketplace-api.immutable.com/v1/stacked-assets/0xacb3c6a43d15b907e8433077b6d38ae40936fe2c/search?direction=desc&order_by=buy_quantity_with_fees&page_size=5000&token_address=0xccc8cb5229b0ac8069c51fd58367fd1e622afd97&token_type=ERC20`
let price_USD = 1600
let price_GODS = 0.16
const allOldCardsEth = []
const allOldCardsGODS = []
const allCardsArray = []

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly cardsService: CardsService,
    ) {}

  

  @Hears('Price')
  async price(ctx: Context) {
    try {
     
    const price = await this.cardsService.getPrice()
    price_USD = +price.ethereum.usd
    price_GODS = +price['gods-unchained'].usd

    await ctx.reply('price ready')
    await ctx.reply(`${price_USD}`)
    await ctx.reply(`${price_GODS}`)
    } catch (error) {
      console.log(error)
    }
  }

  @Hears('Cards')
  async getCards(ctx: Context) {
try {
  allOldCardsEth.length = 0
  allOldCardsGODS.length = 0
  const oldCardsETH = await this.cardsService.getCards(URL_ETH, price_USD)
  const oldCardsGODS = await this.cardsService.getCards(URL_GODS, price_GODS)
  allOldCardsEth.push(...oldCardsETH)
  allOldCardsGODS.push(...oldCardsGODS)
  await ctx.reply('Ready')
  await ctx.reply(`${allOldCardsEth.length}`)
  await ctx.reply(`${allOldCardsGODS.length}`)

  
 
} catch (error) {
  console.log(error)
}
  }

  @Hears('Start')
  async start(ctx: Context) {
    setInterval(async ()=>{
      try {
        const newCardsArrETH = await this.cardsService.getCards(URL_ETH, price_USD)
        const newCardsArrGODS = await this.cardsService.getCards(URL_GODS, price_GODS)
        const cardsArrETH = await this.cardsService.calculatePrice(allOldCardsEth, newCardsArrETH, price_USD, allOldCardsGODS)
        const cardsArrGODS = await this.cardsService.calculatePrice(allOldCardsGODS, newCardsArrGODS, price_GODS, allOldCardsEth)
        if(cardsArrETH?.length===0) return
        await cardsArrETH.map(async card=>{
          try {
            await ctx.replyWithPhoto(card.image, {
              caption: `Ethereum  percent--${card.percent}%
          old_price--${card.old_price.toFixed(2)}$
          new_price--${card.new_price.toFixed(2)}$
          ETH----${card.meteoritePriceETH}--${card.shadowPriceETH}--${card.goldPriceETH}--${card.diamondPriceETH}
          GODS----${card.meteoritePriceGODS}--${card.shadowPriceGODS}--${card.goldPriceGODS}--${card.diamondPriceGODS}
          `,
            });
          } catch (error) {
            console.log(error, 'eth999999999999999999999')
          }
        
       })
       cardsArrETH.length=0
       if(cardsArrGODS?.length===0) return
       await cardsArrGODS.map(async card=>{
        try {
          await ctx.replyWithPhoto(card.image, {
            caption: `Gods  percent--${card.percent}%
        old_price--${card.old_price.toFixed(2)}$
        new_price--${card.new_price.toFixed(2)}$
        GODS----${card.meteoritePriceETH}--${card.shadowPriceETH}--${card.goldPriceETH}--${card.diamondPriceETH}
        ETH----${card.meteoritePriceGODS}--${card.shadowPriceGODS}--${card.goldPriceGODS}--${card.diamondPriceGODS}
        `,
          });
        } catch (error) {
          console.log(error, '1323333333333333')
        }
       
      })
      cardsArrGODS.length=0
      return
      } catch (error) {
        console.log(error, '+++++++++++++++++')
      }
   }, 20000)
  }
}
