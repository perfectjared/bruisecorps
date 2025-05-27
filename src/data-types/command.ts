import { scenes } from "../app"

export default class Command
{
  source: any
  target: any
  change: { key: string, value: any }
  dataManager: Phaser.Data.DataManager
  original: { key: string, value: any}
  time: number
  step: number

  constructor
  (
    source: any, 
    target: any, 
    change: { key: string, value: any }, 
  )
  {
    this.Set(source, target, {key: change.key, value: change.value})
  }

  Set(source, target, change: {key: string, value: any })
  {
    // let data = dataManager.get(change.key)
    // if (data == undefined) 
    // {
    //   console.log('undefined data ' + change.key)
    //   return
    // }

    this.source = source
    this.target = target
    this.change = change
    // this.dataManager = dataManager
    // this.original = { key: change.key, value: data }
    this.time = 0 //TODO
    this.step = scenes.game.state.step //TODO
    
    let newData = { key: change.key, value: change.value }
    // dataManager.set(newData.key, newData.value)
    console.log("command: " + change.key + " to " + newData.value)
  }
}