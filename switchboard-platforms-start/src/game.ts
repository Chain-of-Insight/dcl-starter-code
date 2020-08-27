import { Switchboard } from "./switchboard"

// Entities

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