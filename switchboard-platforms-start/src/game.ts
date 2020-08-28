import utils from "../node_modules/decentraland-ecs-utils/index"
import { Switchboard } from "./switchboard"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"
import * as ui from '../node_modules/@dcl/ui-utils/index'

// UI Counter
let coinCounter = new ui.UICounter(0, 0, 80, Color4.Yellow());
let coinIcon = new ui.MediumIcon('models/coins.png', -75, 80)

// Ground
const base = new Entity()
base.addComponent(new GLTFShape('models/baseLight.glb'))
base.addComponent(new Transform({ scale: new Vector3(2, 1, 1) }))
engine.addEntity(base)

// Platforms
const platforms = new Entity()
platforms.addComponent(new GLTFShape('models/platforms.glb'))
engine.addEntity(platforms)

// Buttons
const btn1 = new Entity()
btn1.addComponent(new GLTFShape('models/buttonA.glb'))
btn1.addComponent(new Transform())

const btn2 = new Entity()
btn2.addComponent(new GLTFShape('models/buttonB.glb'))
btn2.addComponent(new Transform())

// Gears
const gears = new Entity()
gears.addComponent(new GLTFShape('models/gears.glb'))
gears.addComponent(new Transform())

// Switchboard
const switchboard = new Switchboard(new GLTFShape('models/switchboard.glb'), new Vector3(8, 3, 8), new Vector3(27, 3, 8), btn1, btn2, gears)

// Coin Pick Up
const coinPickUpSound = new Entity()
coinPickUpSound.addComponent(
  new AudioSource(
    new AudioClip('sounds/coinPickup.mp3')
  )
)
coinPickUpSound.addComponent(new Transform())
coinPickUpSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(coinPickUpSound)

// Coin
const coin = new Entity()
coin.addComponent(new GLTFShape('models/starCoin.glb'))
coin.addComponent(new Transform({
  position: new Vector3(19,7,8)
}))

engine.addEntity(coin)

coin.addComponent(
  new utils.TriggerComponent(
    new TriggerBoxShape(
      new Vector3(2,2,2), 
      new Vector3(0,1.25,0)
    ),
    null, null, null, null,
    // On camera enter:
    () => {
      // Coin pick up sound
      coinPickUpSound.getComponent(AudioSource).playOnce()
    },
    // On camera exit
    () => {
      // Remove coin display
      engine.removeEntity(coin)
      coinCounter.increase()
    }
    
  )
)