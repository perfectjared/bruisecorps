// DECKER TRANSPARENCY AND RENDERING
// Based on lines 6972-7010 of ddecker.html
// This handles the critical transparency rendering that you need working

// Transparency rendering system
let id = null;

// Main sync function - handles transparency rendering
function sync() {
    // DECKER TRANSPARENCY SYSTEM
    // BG_MASK (100) pixels in framebuffer = transparent
    // Everything else = opaque with color from COLORS array
    
    pick_palette(deck)
    const anim=deck.patterns.anim, pal=deck.patterns.pal.pix, mask=dr.trans_mask&&uimode=='draw', fc=dr.show_anim?0|(frame_count/4):0
    const anim_ants   =(x,y)=>(0|((x+y+(0|(frame_count/2)))/3))%2?15:0
    const anim_pattern=(pix,x,y)=>pix<28||pix>31?pix: anim[pix-28][fc%max(1,anim[pix-28].length)]
    const draw_pattern=(pix,x,y)=>pix<2?(pix?1:0): pix>31?(pix==32?0:1): pal_pat(pal,pix,x,y)&1
    const draw_color  =(pix,x,y)=>pix==ANTS?anim_ants(x,y): pix>47?0: pix>31?pix-32: draw_pattern(pix,x,y)?15:0
    if(!id||id.width!=fb.size.x||id.height!=fb.size.y){id=new ImageData(fb.size.x,fb.size.y);id.data.fill(0)}
    
    // CRITICAL: Canvas context with alpha support
    const g = document.getElementById('display').getContext('2d', { alpha: true })
    g.clearRect(0, 0, g.canvas.width, g.canvas.height)
    
    // Render pixels with transparency
    for(let z=0,d=0,y=0;y<id.height;y++)for(let x=0;x<id.width;x++,z++,d+=4){
        const pix=fb.pix[z], a=anim_pattern(pix,x,y), c=(a==0&&mask)?13:draw_color(a,x,y), cv=COLORS[c]
        
        if(pix == BG_MASK) {
            // Transparent pixel
            id.data[d  ]=0
            id.data[d+1]=0
            id.data[d+2]=0
            id.data[d+3]=0
        } else {
            // Opaque pixel
            id.data[d  ]=0xFF&(cv>>16)
            id.data[d+1]=0xFF&(cv>> 8)
            id.data[d+2]=0xFF&(cv    )
            id.data[d+3]=255
        }
    }
    
    g.putImageData(id, 0, 0)
    g.imageSmoothingEnabled=zoom!=(0|zoom),g.save(),g.scale(zoom,zoom),g.restore()
}

// Responsive sizing
function update_responsive_size() {
    // Handle responsive sizing logic
}

// Export transparency functions
window.DECKER_RENDER = {
    sync,
    update_responsive_size
};

// Note: This is the critical transparency code extracted from ddecker.html lines 6972-7010
// The key fix is the canvas context with { alpha: true }
