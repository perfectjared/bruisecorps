declare module 'phaser3-rex-plugins/templates/ui/ui-plugin' {
  export default class UIPlugin extends Phaser.Plugins.ScenePlugin {
    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager);
  }
}

declare module 'phaser3-rex-plugins/templates/ui/ui-components' {
  export class Sizer extends Phaser.GameObjects.Zone {
    constructor(scene: Phaser.Scene, config?: any);
  }
  // Add other component classes as needed
}

declare module 'phaser3-rex-plugins/plugins/dragrotate-plugin' {
  export default class DragRotatePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager);
  }
}

declare module 'phaser3-rex-plugins/plugins/anchor-plugin' {
  export default class AnchorPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager);
  }
}

declare module 'phaser3-rex-plugins/plugins/roundrectangle-plugin' {
  export default class RoundRectanglePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager);
  }
}

declare module 'phaser3-rex-plugins/plugins/slider-plugin' {
  export default class SliderPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager);
  }
}

declare module 'phaser3-rex-plugins/plugins/anchor' {
  export default class Anchor extends Phaser.GameObjects.GameObject {
    constructor(gameObject: Phaser.GameObjects.GameObject, config?: any);
  }
}
