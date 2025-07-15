// LIL SCRIPTING LANGUAGE
// Based on lines 117-6294 of ddecker.html
// This is the core Lil interpreter that powers Decker scripts

VERSION="1.56"

DANGEROUS=0

// lil: Learning in Layers

let allocs=0,calldepth=0,do_panic=0
NIL  =                   {t:'nil'},                       linil=x=>x&&x.t=='nil'
lmn  =x      =>(allocs++,{t:'num',v:isFinite(x)?+x:0}),   lin  =x=>x&&x.t=='num'
lms  =x      =>(allocs++,{t:'str',v:''+x }),              lis  =x=>x&&x.t=='str'
lml  =x      =>(allocs++,{t:'lst',v:x    }),              lil  =x=>x&&x.t=='lst'
lmd  =(k,v)  =>(allocs++,{t:'dic',k:k||[],v:v||[]}),      lid  =x=>x&&x.t=='dic'
lmt  =_      =>(allocs++,{t:'tab',v:new Map()}),          lit  =x=>x&&x.t=='tab'
lmi  =(f,n,x)=>(allocs++,{t:'int',f,n}),                  lii  =x=>x&&x.t=='int'
lmon =(n,a,b)=>(allocs++,{t:'on' ,n:n,a:a,b:b,c:null}),   lion =x=>x&&x.t=='on'
lmnat=f      =>(allocs++,{t:'nat',f:f}),                  linat=x=>x&&x.t=='nat'

// Export Lil functions for use by other modules
window.LIL = {
    // Core type constructors
    NIL, lmn, lms, lml, lmd, lmt, lmi, lmon, lmnat,
    
    // Type checkers
    linil, lin, lis, lil, lid, lit, lii, lion, linat,
    
    // Will be populated with more functions as we extract them
    VERSION,
    DANGEROUS
};

// Note: The full Lil interpreter would be extracted here from ddecker.html lines 117-6294
// This is a placeholder showing the structure for clean separation
