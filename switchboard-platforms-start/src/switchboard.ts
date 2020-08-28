import utils from "../node_modules/decentraland-ecs-utils/index"
import { TriggerBoxShape } from "../node_modules/decentraland-ecs-utils/triggers/triggerSystem"
import { MoveTransformComponent } from "../node_modules/decentraland-ecs-utils/transform/component/move"

// Sounds
const switchSound = new Entity()
switchSound.addComponent(
  new AudioSource(
    new AudioClip('sounds/switch.mp3')
  )
)
switchSound.addComponent(new Transform())
switchSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(switchSound)

const platformLockingSound = new Entity()
platformLockingSound.addComponent(
  new AudioSource(
    new AudioClip('sounds/platform.mp3')
  )
)
platformLockingSound.addComponent(new Transform())
platformLockingSound.getComponent(Transform).position = Camera.instance.position
engine.addEntity(platformLockingSound)

export class Switchboard extends Entity {
  constructor(
    model: GLTFShape,
    startPosition: Vector3, 
    endPosition: Vector3, 
    public btn1: Entity, 
    public btn2: Entity,
    public gears: Entity
  ) {
    super()
    engine.addEntity(this)
    
    // Switchboard
    this.addComponent(model)
    this.addComponent(new Transform({ position: startPosition }))
    
    // Child elements
    btn1.setParent(this)
    btn1.addComponent(
      new utils.TriggerComponent(
        new TriggerBoxShape(
          new Vector3(2,2,2), 
          new Vector3(1.5,2,0)
        ),
        null, null, null, null, 
        // On camera enter:
        () => {
          let btn1Position = -0.12
          let btn2Position = 0
          this.moveTransform(btn1Position, btn2Position, -180, endPosition)
        }
      )
    )

    btn2.setParent(this)
    btn2.addComponent(
      new utils.TriggerComponent(
        new TriggerBoxShape(
          new Vector3(2,2,2), 
          new Vector3(-1.5,2,0)
        ),
        null, null, null, null, 
        // On camera enter:
        () => {
          let btn1Position = 0
          let btn2Position = -0.12
          this.moveTransform(btn1Position, btn2Position, 180, startPosition)
        }
      )
    )

    gears.setParent(this)
  }

  private moveTransform(
    btn1Position: number, 
    btn2Position: number, 
    gearsDirection: number,
    destination: Vector3,
    buttonReset: number = 0
  ) {
    // Play button sound
    switchSound.getComponent(AudioSource).playOnce()

    // Toggle highlighted button
    this.btn1.getComponent(Transform).position.y = btn1Position
    this.btn2.getComponent(Transform).position.y = btn2Position

    // Begin rotating gears
    this.gears.addComponentOrReplace(
      new utils.KeepRotatingComponent(
        Quaternion.Euler(0, 0 ,gearsDirection)
      )
    )

    // Move platform
    let currentPosition = this.getComponent(Transform).position
    let duration = Math.abs(destination.x - currentPosition.x) * 0.25
    this.addComponentOrReplace(
      new MoveTransformComponent(
        // Begin moving at:
        currentPosition,
        // Move until:
        destination,
        // Duration (seconds):
        duration,
        // On finished callback
        () => {
          this.gears.getComponent(utils.KeepRotatingComponent).stop()
          this.btn1.getComponent(Transform).position.y = buttonReset
          this.btn2.getComponent(Transform).position.y = buttonReset
          platformLockingSound.getComponent(AudioSource).playOnce()
        }
      )
    )
  }
}
