import { scenes } from "../app"
import DynamicSprite from "../data-types/dynamicsprite"

export default class CameraManager
{
    scene
    cameras
    mainCamera
    parallax

    constructor(scene)
    {
        this.scene = scene
        this.cameras = new Map()
        this.mainCamera = null
    }

    add(name, camera, 
        {
            main = false,
            fixed = false,
            parallax = 1.0
        } = {})
    {
        this.cameras.set(name, { camera, fixed, parallax })
        if (main) this.setMain(name)
        if (fixed) camera.setScroll(0, 0)
        return this;
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
        if (this.mainCamera && target) this.mainCamera.startFollow(target)
    }

    update()
    {
        if (!this.mainCamera) return

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