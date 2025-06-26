import { scenes } from "../app"
import DynamicSprite from "../data-types/dynamicsprite"

export default class CameraManager
{
    scene
    cameras
    mainCamera
    target
    parallax

    offsetX
    offsetY
    lerp

    constructor(scene)
    {
        this.scene = scene
        this.cameras = new Map()
        this.mainCamera = null
        this.target = false

        this.offsetX = 0
        this.offsetY = 0
        this.lerp = 0.66
    }

    add(name, camera, 
        {
            main = false,
            fixed = false,
            parallax = 1.0,
            deadzone = null
        } = {})
    {
        this.cameras.set(name, { camera, fixed, parallax, deadzone })
        if (main) this.setMain(name)
        if (fixed) camera.setScroll(0, 0)
        return this;
    }

    setOffset(x, y)
    {
        this.offsetX = x
        this.offsetY = y
        return this
    }

    setLerp(v)
    {
        this.lerp = Phaser.Math.Clamp(v, 0.01, 1)
        return this
    }

    setMain(name)
    {
        let entry = this.cameras.get(name)
        if (entry)
        {
            this.mainCamera = entry.camera
            this.parallax = entry.parallax
        }
    }

    setFollow(target, mainName = null)
    {
        if (mainName) this.setMain(mainName)
        this.target = this.mainCamera.startFollow(target)
        if (this.mainCamera)
        {
            this.mainCamera.stopFollow()
            this.mainCamera.setScroll(this.mainCamera.scrollX, this.mainCamera.scrollY)
        }
    }

    update()
    {
        if (!this.mainCamera || !this.target) return

        let baseX = this.mainCamera.scrollX / this.parallax
        let baseY = this.mainCamera.scrollY / this.parallax

        this.cameras.forEach(( { camera, fixed, parallax }) =>
        {
            if (!fixed && camera !== this.mainCamera)
            {
                camera.setScroll(baseX * parallax, baseY * parallax)
            }
        })
    }
}