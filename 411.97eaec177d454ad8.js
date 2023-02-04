"use strict";(self.webpackChunkbd_client=self.webpackChunkbd_client||[]).push([[411],{3411:(ht,A,s)=>{s.r(A),s.d(A,{LabModule:()=>pt});var l=s(6362),Z=s(1119),d=s(587),b=s(2218),W=s(9095),y=s(6942),K=s(328),F=s(14),$=s(7928);function _(n,o=K.P){const i=function q(n){return n instanceof Date&&!isNaN(+n)}(n)?+n-o.now():Math.abs(n);return r=>r.lift(new ee(i,o))}class ee{constructor(o,t){this.delay=o,this.scheduler=t}call(o,t){return t.subscribe(new w(o,this.delay,this.scheduler))}}class w extends F.L{constructor(o,t,i){super(o),this.delay=t,this.scheduler=i,this.queue=[],this.active=!1,this.errored=!1}static dispatch(o){const t=o.source,i=t.queue,r=o.scheduler,c=o.destination;for(;i.length>0&&i[0].time-r.now()<=0;)i.shift().notification.observe(c);if(i.length>0){const a=Math.max(0,i[0].time-r.now());this.schedule(o,a)}else this.unsubscribe(),t.active=!1}_schedule(o){this.active=!0,this.destination.add(o.schedule(w.dispatch,this.delay,{source:this,destination:this.destination,scheduler:o}))}scheduleNotification(o){if(!0===this.errored)return;const t=this.scheduler,i=new te(t.now()+this.delay,o);this.queue.push(i),!1===this.active&&this._schedule(t)}_next(o){this.scheduleNotification($.P.createNext(o))}_error(o){this.errored=!0,this.queue=[],this.destination.error(o),this.unsubscribe()}_complete(){this.scheduleNotification($.P.createComplete()),this.unsubscribe()}}class te{constructor(o,t){this.time=o,this.notification=t}}var p=s(5921),B=s(9151),N=s(8642),e=s(2311),h=s(2818),S=s(4978),R=s(4505);let E=(()=>{class n{constructor(){this.MEDIA_QUERIES={largeScreen:"(min-width: 1200px)"},this.hasOpenedRightSidebar$=new R.X(!1)}get hasOpenedRightSidebar(){return this.hasOpenedRightSidebar$.value}get openedRightSidebar(){return this.hasOpenedRightSidebar$.asObservable()}toggleRightSidebar(t){this.hasOpenedRightSidebar!==t&&this.hasOpenedRightSidebar$.next(t)}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();var ne=s(4015),M=s(2238);function oe(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"span",2),e.NdJ("click",function(){const c=e.CHM(t).$implicit;return e.oxw().setMode(c)})("keyup.enter",function(){const c=e.CHM(t).$implicit;return e.oxw().setMode(c)}),e.ALo(1,"async"),e.qZA()}if(2&n){const t=o.$implicit,i=o.index,r=e.oxw();e.Gre("icon icon-layout-",t," layout mb-3"),e.ekj("active",e.lcZ(1,6,r.isActive(t))),e.s9C("title","Layout "+(i+1))}}let ie=(()=>{class n{constructor(t){this.labService=t,this.layoutModes=[M.X.Single,M.X.BottomRight,M.X.BottomLeft]}setMode(t){this.labService.setLayoutMode(t)}isActive(t){return this.labService.layoutModeChanged.pipe((0,y.U)(({mode:i})=>i===t))}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(h.y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-layout-selector"]],decls:2,vars:1,consts:[[1,"d-flex","flex-column"],["tabindex","0",3,"class","title","active","click","keyup.enter",4,"ngFor","ngForOf"],["tabindex","0",3,"title","click","keyup.enter"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0),e.YNc(1,oe,2,8,"span",1),e.qZA()),2&t&&(e.xp6(1),e.Q6J("ngForOf",i.layoutModes))},directives:[l.sg],pipes:[l.Ov],styles:[""]}),n})();var U=s(9810),Q=s(786),re=s(9500);function se(n,o){if(1&n&&(e.ynx(0),e._UZ(1,"bd-playground-icon",3),e.ALo(2,"async"),e.BQk()),2&n){const t=o.$implicit,i=e.oxw();e.xp6(1),e.Q6J("icon",e.lcZ(2,3,i.getIcon(t)))("position",t)("canRotate",t!==i.IconPosition.Background)}}let ce=(()=>{class n{constructor(t,i){this.labService=t,this.backgroundService=i,this.IconPosition=U.q,this.availablePositions$=this.labService.availablePositionsChanged,this.backgroundColor$=this.backgroundService.backgroundColorChanged}get artboardSize(){return Q.j.getArtboardSize(!!this.backgroundService.background)}getIcon(t){return this.labService.getIcon(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(h.y),e.Y36(S.J))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-playground"]],decls:5,vars:11,consts:[[1,"playground-wrapper"],[1,"position-relative","playground-body"],[4,"ngFor","ngForOf"],[3,"icon","position","canRotate"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0),e.ALo(1,"async"),e.TgZ(2,"div",1),e.YNc(3,se,3,5,"ng-container",2),e.ALo(4,"async"),e.qZA()()),2&t&&(e.Udp("background-color",e.lcZ(1,7,i.backgroundColor$)),e.xp6(2),e.Udp("width",i.artboardSize.width,"px")("height",i.artboardSize.height,"px"),e.xp6(1),e.Q6J("ngForOf",e.lcZ(4,9,i.availablePositions$)))},directives:[l.sg,re.S],pipes:[l.Ov],styles:[".playground-wrapper[_ngcontent-%COMP%]{border:1px solid #f3eefc;border-radius:.5rem;display:flex;justify-content:center;align-items:center;width:340px;height:340px}.playground-wrapper[_ngcontent-%COMP%]   .playground-body[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center}"]}),n})();var ae=s(3459);const le=["exportDropdown"];let de=(()=>{class n{constructor(t,i){this.labService=t,this.renderer=i,this.exportDropdownOpened=!1,this.IconType=N.T}ngOnInit(){this.listenerFn=this.renderer.listen("window","click",t=>{t.composedPath().includes(this.exportDropdown.nativeElement)||(this.exportDropdownOpened=!1)})}ngOnDestroy(){this.listenerFn()}saveToGallery(){}export(t){this.labService.exportImage(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(h.y),e.Y36(e.Qsj))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-lab-actions"]],viewQuery:function(t,i){if(1&t&&e.Gf(le,5),2&t){let r;e.iGM(r=e.CRH())&&(i.exportDropdown=r.first)}},decls:14,vars:2,consts:[[1,"d-flex","justify-content-between","p-3","lab-actions"],["disabled","",1,"btn",3,"click"],[1,"dropdown","dropdown-export"],["exportDropdown",""],["type","button",1,"btn","btn-secondary","dropdown-toggle",3,"click"],[1,"dropdown-menu"],[1,"dropdown-item",3,"click"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"button",1),e.NdJ("click",function(){return i.saveToGallery()}),e._uU(2,"Save to Gallery"),e.qZA(),e.TgZ(3,"div",2,3)(5,"button",4),e.NdJ("click",function(){return i.exportDropdownOpened=!i.exportDropdownOpened}),e._uU(6," Export "),e.qZA(),e.TgZ(7,"ul",5)(8,"li")(9,"a",6),e.NdJ("click",function(){return i.export(i.IconType.Vector)}),e._uU(10,"Export SVG"),e.qZA()(),e.TgZ(11,"li")(12,"a",6),e.NdJ("click",function(){return i.export(i.IconType.Raster)}),e._uU(13,"Export PNG"),e.qZA()()()()()),2&t&&(e.xp6(7),e.ekj("opened",i.exportDropdownOpened))},styles:[".lab-actions[_ngcontent-%COMP%]{background-color:#f8f5fe;border-radius:1rem}.btn[_ngcontent-%COMP%]{padding:.75rem 3rem}.dropdown.dropdown-export[_ngcontent-%COMP%]   .dropdown-menu.opened[_ngcontent-%COMP%]{top:auto;bottom:100%}"]}),n})();var pe=s(6526),O=s(9288);function J(n){return Array.isArray(n)?n:[n]}var he=s(7716),ge=s(7283),me=s(7473),fe=s(3910);class ye{constructor(o){this.total=o}call(o,t){return t.subscribe(new ve(o,this.total))}}class ve extends F.L{constructor(o,t){super(o),this.total=t,this.count=0}_next(o){++this.count>this.total&&this.destination.next(o)}}var D=s(823),_e=s(5722);let P;try{P="undefined"!=typeof Intl&&Intl.v8BreakIterator}catch(n){P=!1}let Ce=(()=>{class n{constructor(t){this._platformId=t,this.isBrowser=this._platformId?(0,l.NF)(this._platformId):"object"==typeof document&&!!document,this.EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent),this.TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent),this.BLINK=this.isBrowser&&!(!window.chrome&&!P)&&"undefined"!=typeof CSS&&!this.EDGE&&!this.TRIDENT,this.WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT,this.IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window),this.FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent),this.ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT,this.SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT}}return n.\u0275fac=function(t){return new(t||n)(e.LFG(e.Lbi))},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();const j=new Set;let f,Se=(()=>{class n{constructor(t){this._platform=t,this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):Oe}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&function Me(n){if(!j.has(n))try{f||(f=document.createElement("style"),f.setAttribute("type","text/css"),document.head.appendChild(f)),f.sheet&&(f.sheet.insertRule(`@media ${n} {body{ }}`,0),j.add(n))}catch(o){console.error(o)}}(t),this._matchMedia(t)}}return n.\u0275fac=function(t){return new(t||n)(e.LFG(Ce))},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();function Oe(n){return{matches:"all"===n||""===n,media:n,addListener:()=>{},removeListener:()=>{}}}let Pe=(()=>{class n{constructor(t,i){this._mediaMatcher=t,this._zone=i,this._queries=new Map,this._destroySubject=new b.xQ}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(t){return H(J(t)).some(r=>this._registerQuery(r).mql.matches)}observe(t){const r=H(J(t)).map(a=>this._registerQuery(a).observable);let c=(0,he.aj)(r);return c=(0,ge.z)(c.pipe((0,fe.q)(1)),c.pipe(function be(n){return o=>o.lift(new ye(n))}(1),(0,D.b)(0))),c.pipe((0,y.U)(a=>{const u={matches:!1,breakpoints:{}};return a.forEach(({matches:x,query:ut})=>{u.matches=u.matches||x,u.breakpoints[ut]=x}),u}))}_registerQuery(t){if(this._queries.has(t))return this._queries.get(t);const i=this._mediaMatcher.matchMedia(t),c={observable:new me.y(a=>{const u=x=>this._zone.run(()=>a.next(x));return i.addListener(u),()=>{i.removeListener(u)}}).pipe((0,_e.O)(i),(0,y.U)(({matches:a})=>({query:t,matches:a})),(0,p.R)(this._destroySubject)),mql:i};return this._queries.set(t,c),c}}return n.\u0275fac=function(t){return new(t||n)(e.LFG(Se),e.LFG(e.R0b))},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();function H(n){return n.map(o=>o.split(",")).reduce((o,t)=>o.concat(t)).map(o=>o.trim())}var z=s(8623),X=s(3298),ke=s(522),T=s(2340),I=s(284),Te=s(2276),Ie=s(5758),Le=s(6943),G=s(2569),Ae=s(1875),Ze=s(4605),L=s(2775);function Fe(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"bd-icon",4),e.NdJ("click",function(){const c=e.CHM(t).$implicit;return e.oxw().setIcon(c)}),e.qZA()}if(2&n){const t=o.$implicit;e.Q6J("icon",t)("title",t.name)}}let $e=(()=>{class n{constructor(t){this.labService=t,this.recentIcons$=this.labService.recentIconsChanged}trackIconsFn(t,i){return i.id}setIcon(t){this.labService.setIcon(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(h.y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-recently-used"]],decls:6,vars:4,consts:[[1,"mb-2"],["id","recently-used",1,"d-flex","align-items-center"],[1,"d-flex","align-items-center","scroll"],["class","icon-wrapper",3,"icon","title","click",4,"ngFor","ngForOf","ngForTrackBy"],[1,"icon-wrapper",3,"icon","title","click"]],template:function(t,i){1&t&&(e.TgZ(0,"h3",0),e._uU(1,"Recently used icons"),e.qZA(),e.TgZ(2,"section",1)(3,"div",2),e.YNc(4,Fe,1,2,"bd-icon",3),e.ALo(5,"async"),e.qZA()()),2&t&&(e.xp6(4),e.Q6J("ngForOf",e.lcZ(5,2,i.recentIcons$))("ngForTrackBy",i.trackIconsFn))},directives:[l.sg,L.o],pipes:[l.Ov],styles:["#recently-used[_ngcontent-%COMP%]{background-color:#f8f5fe;border-radius:.5rem;margin-bottom:2rem}#recently-used[_ngcontent-%COMP%]   .scroll[_ngcontent-%COMP%]{overflow-x:auto;overflow-y:hidden;max-width:100%}#recently-used[_ngcontent-%COMP%]   .icon-wrapper[_ngcontent-%COMP%]{margin:0 .5rem;overflow:visible}#recently-used[_ngcontent-%COMP%]   .icon-wrapper[_ngcontent-%COMP%]:first-child{margin-left:0}#recently-used[_ngcontent-%COMP%]   .icon-wrapper[_ngcontent-%COMP%]:last-child{margin-right:0}#recently-used[_ngcontent-%COMP%]   .icon-wrapper[_ngcontent-%COMP%]     .icon:not(.icon-premium){background-color:transparent}"]}),n})();function Be(n,o){1&n&&e._UZ(0,"span",6)}function Ne(n,o){if(1&n&&(e.TgZ(0,"h3",11),e._uU(1),e.qZA()),2&n){const t=e.oxw().ngIf,i=e.oxw();e.xp6(1),e.AsE("",t.length," ",i.DataHelper.hasUnit(t.length)?"icon":"icons"," available")}}function Re(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"div",12)(1,"bd-icon",13),e.NdJ("click",function(){const c=e.CHM(t).$implicit;return e.oxw(2).setIcon(c)}),e.qZA()()}if(2&n){const t=o.$implicit;e.xp6(1),e.Q6J("icon",t)("title",t.name)}}function Ee(n,o){if(1&n&&(e.ynx(0),e.YNc(1,Ne,2,2,"h3",7),e.TgZ(2,"div",8)(3,"div",9),e.YNc(4,Re,2,2,"div",10),e.qZA()(),e.BQk()),2&n){const t=o.ngIf,i=e.oxw();e.xp6(1),e.Q6J("ngIf",!i.loading),e.xp6(3),e.Q6J("ngForOf",t)("ngForTrackBy",i.trackIconsFn)}}let Ue=(()=>{class n{constructor(t,i,r,c,a){this.iconService=t,this.categoryService=i,this.loadingService=r,this.labService=c,this.fb=a,this.searchForm=this.fb.group({keyword:this.iconService.getIconFilters().keyword,categoryId:this.iconService.getIconFilters().categoryId}),this.destroyed$=new b.xQ,this.icons$=(0,z.T)(this.iconService.getIcons(this.searchForm.value),(0,z.T)(this.keyword.valueChanges.pipe((0,p.R)(this.destroyed$),(0,B.h)(u=>!u||1!==u.length),(0,D.b)(Te.m.DEFAULT_DEBOUNCE_TIME),(0,X.x)()),this.categoryId.valueChanges.pipe((0,p.R)(this.destroyed$),(0,X.x)())).pipe(_(0),(0,ke.zg)(()=>this.iconService.getIcons(this.searchForm.value)))),this.loading=!1,this.categories$=this.categoryService.getCategories(),this.DataHelper=I.i}get keyword(){return this.searchForm.controls.keyword}get categoryId(){return this.searchForm.controls.categoryId}ngOnInit(){this.loadingService.loadingSub.pipe((0,p.R)(this.destroyed$),_(0)).subscribe(t=>this.loading=t&&this.loadingService.loadingMap.has(`${T.N.apiUrl}/icons`))}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}trackIconsFn(t,i){return i.id}setIcon(t){this.labService.setIcon(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(Ie.C),e.Y36(Le.H),e.Y36(G.b),e.Y36(h.y),e.Y36(d.qu))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-tab-icons"]],decls:10,vars:8,consts:[[1,"dashed","right"],[3,"formGroup"],["placeholder","All Categories","formControlName","categoryId","valueProp","id","labelProp","name",1,"w-100","mb-3",3,"items"],["placeholder","Search...","formControlName","keyword",1,"w-100","search-keyword"],["class","spinner",4,"ngIf"],[4,"ngIf"],[1,"spinner"],["class","mb-2",4,"ngIf"],[1,"icons-list-wrapper"],[1,"d-flex","flex-wrap","icons-list"],["class","icon-item",4,"ngFor","ngForOf","ngForTrackBy"],[1,"mb-2"],[1,"icon-item"],[3,"icon","title","click"]],template:function(t,i){1&t&&(e.TgZ(0,"h2",0),e._uU(1,"Icon Library"),e.qZA(),e.TgZ(2,"form",1),e._UZ(3,"bd-dropdown",2),e.ALo(4,"async"),e._UZ(5,"bd-search-input",3),e.qZA(),e.YNc(6,Be,1,0,"span",4),e._UZ(7,"bd-recently-used"),e.YNc(8,Ee,5,3,"ng-container",5),e.ALo(9,"async")),2&t&&(e.xp6(2),e.Q6J("formGroup",i.searchForm),e.xp6(1),e.Q6J("items",e.lcZ(4,4,i.categories$)),e.xp6(3),e.Q6J("ngIf",i.loading),e.xp6(2),e.Q6J("ngIf",e.lcZ(9,6,i.icons$)))},directives:[d._Y,d.JL,d.sg,Ae.J,d.JJ,d.u,Ze.J,l.O5,$e,l.sg,L.o],pipes:[l.Ov],styles:[".search-keyword[_ngcontent-%COMP%]{margin-bottom:2rem}.icons-list-wrapper[_ngcontent-%COMP%]{overflow-y:auto;overflow-x:hidden;max-height:calc(100% - 20rem)}.icons-list-wrapper[_ngcontent-%COMP%]   .icons-list[_ngcontent-%COMP%]{margin:0 -.5rem}.icons-list-wrapper[_ngcontent-%COMP%]   .icons-list[_ngcontent-%COMP%]   .icon-item[_ngcontent-%COMP%]{width:33.33%;padding:0 .5rem .5rem}@media (min-width: 1300px){.icons-list-wrapper[_ngcontent-%COMP%]   .icons-list[_ngcontent-%COMP%]   .icon-item[_ngcontent-%COMP%]{width:25%}}"]}),n})();var Qe=s(6068);function Je(n,o){1&n&&e._UZ(0,"span",3)}function De(n,o){if(1&n&&(e.TgZ(0,"h3"),e._uU(1),e.qZA()),2&n){const t=e.oxw().ngIf,i=e.oxw();e.xp6(1),e.AsE("",t.length," ",i.DataHelper.hasUnit(t.length)?"background":"backgrounds"," available")}}function Ye(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"div",8)(1,"bd-icon",9),e.NdJ("click",function(){const c=e.CHM(t).$implicit;return e.oxw(2).setBackground(c)}),e.qZA()()}if(2&n){const t=o.$implicit,i=e.oxw(2);e.xp6(1),e.Q6J("icon",i.IconHelper.mapBackgroundToIcon(t))("large",!0)("title",t.name)}}function je(n,o){if(1&n){const t=e.EpF();e.ynx(0),e.YNc(1,De,2,2,"h3",2),e.TgZ(2,"div",4)(3,"div",5)(4,"button",6),e.NdJ("click",function(){return e.CHM(t),e.oxw().clearBackground()}),e._uU(5,"Clear"),e.qZA(),e.YNc(6,Ye,2,3,"div",7),e.qZA()(),e.BQk()}if(2&n){const t=o.ngIf,i=e.oxw();e.xp6(1),e.Q6J("ngIf",!i.loading),e.xp6(5),e.Q6J("ngForOf",t)("ngForTrackBy",i.trackBackgroundsFn)}}let He=(()=>{class n{constructor(t,i,r){this.loadingService=t,this.backgroundService=i,this.labService=r,this.destroyed$=new b.xQ,this.backgrounds$=this.backgroundService.getBackgrounds(),this.loading=!1,this.IconHelper=Qe.U,this.DataHelper=I.i}ngOnInit(){this.loadingService.loadingSub.pipe((0,p.R)(this.destroyed$),_(0)).subscribe(t=>this.loading=t&&this.loadingService.loadingMap.has(`${T.N.apiUrl}/backgrounds`))}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}trackBackgroundsFn(t,i){return i.id}setBackground(t){this.backgroundService.setBackground(t)}clearBackground(){this.backgroundService.setBackground(null),this.labService.clearPositionSetting(U.q.Background)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(G.b),e.Y36(S.J),e.Y36(h.y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-tab-backgrounds"]],decls:5,vars:4,consts:[[1,"dashed","right"],["class","spinner",4,"ngIf"],[4,"ngIf"],[1,"spinner"],[1,"backgrounds-list-wrapper"],[1,"d-flex","flex-wrap","backgrounds-list"],[1,"btn","background-item",3,"click"],["class","background-item",4,"ngFor","ngForOf","ngForTrackBy"],[1,"background-item"],[3,"icon","large","title","click"]],template:function(t,i){1&t&&(e.TgZ(0,"h2",0),e._uU(1,"Backgrounds"),e.qZA(),e.YNc(2,Je,1,0,"span",1),e.YNc(3,je,7,3,"ng-container",2),e.ALo(4,"async")),2&t&&(e.xp6(2),e.Q6J("ngIf",i.loading),e.xp6(1),e.Q6J("ngIf",e.lcZ(4,2,i.backgrounds$)))},directives:[l.O5,l.sg,L.o],pipes:[l.Ov],styles:[".backgrounds-list-wrapper[_ngcontent-%COMP%]{overflow-y:auto;overflow-x:hidden;max-height:calc(100% - 4.1rem)}.backgrounds-list-wrapper[_ngcontent-%COMP%]   .backgrounds-list[_ngcontent-%COMP%]{margin:0 -.5rem}.backgrounds-list-wrapper[_ngcontent-%COMP%]   .backgrounds-list[_ngcontent-%COMP%]   .background-item[_ngcontent-%COMP%]{width:100%;padding:0 .5rem .5rem}@media (min-width: 1300px){.backgrounds-list-wrapper[_ngcontent-%COMP%]   .backgrounds-list[_ngcontent-%COMP%]   .background-item[_ngcontent-%COMP%]{width:50%}}.backgrounds-list-wrapper[_ngcontent-%COMP%]   .backgrounds-list[_ngcontent-%COMP%]   .background-item.btn[_ngcontent-%COMP%]{border:1px solid #dbcbf5;box-shadow:none;width:100%;height:176px;margin:0 .5rem .5rem}@media (min-width: 1300px){.backgrounds-list-wrapper[_ngcontent-%COMP%]   .backgrounds-list[_ngcontent-%COMP%]   .background-item.btn[_ngcontent-%COMP%]{width:176px}}"]}),n})(),V=(()=>{class n{constructor(){this.style$=new R.X(null)}get styleChanged(){return this.style$.asObservable()}setStyle(t){this.isActive(t)||this.style$.next(t)}isActive(t){var i;return(null===(i=this.style$.value)||void 0===i?void 0:i.id)===t.id}}return n.\u0275fac=function(t){return new(t||n)},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();function ze(n,o){if(1&n&&(e.TgZ(0,"div",1)(1,"h1",2),e._uU(2),e.qZA()()),2&n){const t=e.oxw();e.Udp("background-image",t.ImageHelper.getCssUrl(t.style.url)),e.ekj("active",t.isActive(t.style)),e.xp6(2),e.Oqu(t.style.name)}}let Xe=(()=>{class n{constructor(t){this.iconStyleService=t,this.active=!1,this.ImageHelper=Q.j}isActive(t){return this.iconStyleService.isActive(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(V))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-icon-style"]],inputs:{style:"style",active:"active"},decls:1,vars:1,consts:[["class","d-flex align-items-end p-3 icon-style","tabindex","0",3,"active","background-image",4,"ngIf"],["tabindex","0",1,"d-flex","align-items-end","p-3","icon-style"],[1,"m-0"]],template:function(t,i){1&t&&e.YNc(0,ze,3,5,"div",0),2&t&&e.Q6J("ngIf",i.style)},directives:[l.O5],styles:["[_nghost-%COMP%]{display:flex}[_nghost-%COMP%]   .icon-style[_ngcontent-%COMP%]{border:2px solid transparent;border-radius:.5rem;cursor:pointer;width:100%;height:176px;transition:all .1s ease-in-out}[_nghost-%COMP%]   .icon-style[_ngcontent-%COMP%]:hover{border-color:#14aaff}[_nghost-%COMP%]   .icon-style.active[_ngcontent-%COMP%], [_nghost-%COMP%]   .icon-style[_ngcontent-%COMP%]:active, [_nghost-%COMP%]   .icon-style[_ngcontent-%COMP%]:focus{border-color:#dbcbf5}"]}),n})();function Ge(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"div",7)(1,"bd-icon-style",8),e.NdJ("click",function(){const c=e.CHM(t).$implicit;return e.oxw(2).setStyle(c)}),e.qZA()()}if(2&n){const t=o.$implicit;e.xp6(1),e.Akn(t),e.Q6J("active",!0)}}function Ve(n,o){if(1&n&&(e.ynx(0),e.TgZ(1,"h3"),e._uU(2),e.qZA(),e.TgZ(3,"div",2)(4,"div",3),e.YNc(5,Ge,2,3,"div",4),e.TgZ(6,"div",5)(7,"h3",6),e._uU(8,"More styles are coming Soon..."),e.qZA()()()(),e.BQk()),2&n){const t=e.oxw();e.xp6(2),e.AsE("",t.styles.length," ",t.DataHelper.hasUnit(t.styles.length)?"style":"styles"," available"),e.xp6(3),e.Q6J("ngForOf",t.styles)("ngForTrackBy",t.trackStylesFn)}}let We=(()=>{class n{constructor(t){this.iconStyleService=t,this.styles=[{id:"some-id",name:"Bubbly Icons",url:`${T.N.imgUrl}/styles/bubbly-icons.png`}],this.DataHelper=I.i}ngOnInit(){this.setStyle(this.styles[0])}trackStylesFn(t,i){return i.id}setStyle(t){this.iconStyleService.setStyle(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(V))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-tab-styles"]],decls:3,vars:1,consts:[[1,"dashed","right"],[4,"ngIf"],[1,"styles-list-wrapper"],[1,"d-flex","flex-wrap","styles-list"],["class","mb-2 style-item",4,"ngFor","ngForOf","ngForTrackBy"],[1,"d-flex","justify-content-center","align-items-center","style-item","style-item-more"],[1,"m-0"],[1,"mb-2","style-item"],[3,"active","click"]],template:function(t,i){1&t&&(e.TgZ(0,"h2",0),e._uU(1,"Icon Styles"),e.qZA(),e.YNc(2,Ve,9,4,"ng-container",1)),2&t&&(e.xp6(2),e.Q6J("ngIf",i.styles))},directives:[l.O5,l.sg,Xe],styles:[".styles-list-wrapper[_ngcontent-%COMP%]{overflow-y:auto;overflow-x:hidden;max-height:calc(100% - 4.1rem)}.styles-list-wrapper[_ngcontent-%COMP%]   .styles-list[_ngcontent-%COMP%]{margin:0 -.5rem}.styles-list-wrapper[_ngcontent-%COMP%]   .styles-list[_ngcontent-%COMP%]   .style-item[_ngcontent-%COMP%]{width:100%;padding:0 .5rem .5rem}.styles-list-wrapper[_ngcontent-%COMP%]   .styles-list[_ngcontent-%COMP%]   .style-item.style-item-more[_ngcontent-%COMP%]{background-color:#f8f5fe;border-radius:.5rem;height:176px}"]}),n})();function Ke(n,o){1&n&&e._UZ(0,"bd-tab-icons")}function qe(n,o){1&n&&e._UZ(0,"bd-tab-backgrounds")}function et(n,o){if(1&n&&(e.ynx(0),e.YNc(1,Ke,1,0,"bd-tab-icons",4),e.ALo(2,"async"),e.YNc(3,qe,1,0,"bd-tab-backgrounds",4),e.ALo(4,"async"),e.BQk()),2&n){const t=e.oxw();e.xp6(1),e.Q6J("ngIf",e.lcZ(2,2,t.hasIconPosition$)),e.xp6(2),e.Q6J("ngIf",e.lcZ(4,4,t.hasBackgroundPosition$))}}function tt(n,o){1&n&&e._UZ(0,"bd-tab-styles")}let nt=(()=>{class n{constructor(t,i,r,c){this.breakpointObserver=t,this.renderer=i,this.layoutSevice=r,this.labService=c,this.hostClass=!0,this.labTabs=[{id:O.T.Icons,title:"Icons",active:!0},{id:O.T.Avatars,title:"Avatars"}],this.TabId=O.T,this.hasIconPosition$=this.labService.hasIconPosition$,this.hasBackgroundPosition$=this.labService.hasBackgroundPosition$,this.isLargeScreen=this.breakpointObserver.isMatched(this.layoutSevice.MEDIA_QUERIES.largeScreen),this.destroyed$=new b.xQ}ngOnInit(){this.listenerFn=this.renderer.listen("window","click",t=>{!this.isLargeScreen&&!t.composedPath().some(i=>{var r;return null===(r=null==i?void 0:i.classList)||void 0===r?void 0:r.contains("right-sidebar")})&&this.layoutSevice.toggleRightSidebar(!1)}),this.breakpointObserver.observe(this.layoutSevice.MEDIA_QUERIES.largeScreen).pipe((0,p.R)(this.destroyed$)).subscribe(t=>{this.isLargeScreen=t.matches,this.layoutSevice.toggleRightSidebar(this.isLargeScreen)})}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete(),this.listenerFn()}onTabChange(t){this.activeTabId=t}toggleRightSidebar(t){this.layoutSevice.toggleRightSidebar(t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(Pe),e.Y36(e.Qsj),e.Y36(E),e.Y36(h.y))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-right-sidebar"]],hostVars:2,hostBindings:function(t,i){2&t&&e.ekj("right-sidebar",i.hostClass)},decls:7,vars:6,consts:[[1,"d-flex","flex-column","sidebar-wrapper",3,"click"],[1,"content-wrapper","flex-shrink-1"],[4,"ngIf","ngIfElse"],["selectStyles",""],[4,"ngIf"]],template:function(t,i){if(1&t&&(e.TgZ(0,"aside",0),e.NdJ("click",function(){return i.toggleRightSidebar(!0)}),e.TgZ(1,"div",1),e.YNc(2,et,5,6,"ng-container",2),e.ALo(3,"async"),e.ALo(4,"async"),e.YNc(5,tt,1,0,"ng-template",null,3,e.W1O),e.qZA()()),2&t){const r=e.MAs(6);e.xp6(2),e.Q6J("ngIf",e.lcZ(3,2,i.hasIconPosition$)||e.lcZ(4,4,i.hasBackgroundPosition$))("ngIfElse",r)}},directives:[l.O5,Ue,He,We],pipes:[l.Ov],styles:['[_nghost-%COMP%]{background-color:#fcfaff;border-left:1px solid #f3eefc;padding:2rem;width:337px;height:100%;box-shadow:4px 4px 16px #dbcbf599;position:absolute;transition:right .3s ease-in-out;right:0;top:0}@media (min-width: 1300px){[_nghost-%COMP%]{width:433px}}@media (max-width: 1199px){.sidebar-hidden[_nghost-%COMP%]{right:-257px}.sidebar-hidden[_nghost-%COMP%]   .sidebar-wrapper[_ngcontent-%COMP%]:after{content:"";display:block;width:100%;height:100%;position:absolute;top:0;left:0}}[_nghost-%COMP%]   .sidebar-wrapper[_ngcontent-%COMP%]{height:100%}[_nghost-%COMP%]   .sidebar-wrapper[_ngcontent-%COMP%]   .content-wrapper[_ngcontent-%COMP%]{max-height:100%;overflow:hidden}']}),n})();function ot(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"bd-color-picker",14),e.NdJ("addToSaved",function(){const c=e.CHM(t).$implicit;return e.oxw(3).addToSaved(c.value)})("removeFromSaved",function(){const c=e.CHM(t).$implicit;return e.oxw(3).removeFromSaved(c.value)})("savedColorsChanged",function(r){return e.CHM(t),e.oxw(3).replaceSaved(r)}),e.ALo(1,"async"),e.qZA()}if(2&n){const t=o.$implicit,i=e.oxw(3);e.Q6J("formControl",t)("savedColors",e.lcZ(1,2,i.savedColors$))}}function it(n,o){if(1&n&&(e.ynx(0),e.YNc(1,ot,2,4,"bd-color-picker",13),e.BQk()),2&n){const t=e.oxw(2);e.xp6(1),e.Q6J("ngForOf",t.selectedColorControls)}}function rt(n,o){if(1&n&&(e.ynx(0),e.TgZ(1,"h3",11),e._uU(2,"Selection Colors"),e.qZA(),e.YNc(3,it,2,1,"ng-container",12),e.ALo(4,"async"),e.BQk()),2&n){const t=e.oxw(),i=e.MAs(14);e.xp6(3),e.Q6J("ngIf",e.lcZ(4,2,t.hasSelectedVectorIcon$))("ngIfElse",i)}}function st(n,o){1&n&&(e.ynx(0),e.TgZ(1,"span",15),e._uU(2,"Select the icon you want to change."),e.qZA(),e.BQk())}function ct(n,o){1&n&&(e.TgZ(0,"span",16),e._uU(1,"Raster icons cannot be modified."),e.qZA())}const at=[{path:"",component:(()=>{class n{constructor(t,i,r,c){this.labService=t,this.backgroundService=i,this.layoutService=r,this.renderer=c,this.selectedIcon$=this.labService.positionChanged.pipe((0,W.w)(a=>this.labService.getIcon(a))),this.hasSelectedIcon$=this.selectedIcon$.pipe((0,y.U)(a=>!!a)),this.hasSelectedVectorIcon$=this.selectedIcon$.pipe((0,y.U)(a=>(null==a?void 0:a.type)===N.T.Vector)),this.hasBackgroundPosition$=this.labService.hasBackgroundPosition$,this.savedColors$=this.labService.savedColorsChanged,this.iconName=new d.NI,this.backgroundColor$=this.backgroundService.backgroundColorChanged,this.hasOpenedRightSidebar$=this.layoutService.openedRightSidebar.pipe(_(0)),this.selectedColors=new d.Oe([]),this.destroyed$=new b.xQ}get selectedColorControls(){return this.selectedColors.controls}ngOnInit(){this.labService.filledElementsChanged.pipe((0,p.R)(this.destroyed$),(0,B.h)(t=>!!t)).subscribe(t=>{this.selectedColors.clear(),t.forEach(({color:i,index:r})=>{const c=new d.NI(i);this.selectedColors.push(c),this.initColorListener(c,r)})}),this.labService.iconChanged.pipe((0,p.R)(this.destroyed$)).subscribe(()=>{this.labService.clearColors()}),this.initIconNameHandler(),this.unselectPositionListenerFn=this.renderer.listen("window","keydown.escape",()=>{this.labService.unsetPosition()})}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete(),this.unselectPositionListenerFn()}addToSaved(t){this.labService.addToSavedColors(t)}removeFromSaved(t){this.labService.removeFromSavedColors(t)}replaceSaved(t){this.labService.replaceSavedColors(t)}initColorListener(t,i){t.valueChanges.pipe((0,p.R)(this.destroyed$)).subscribe(r=>this.labService.setColor(r,i))}initIconNameHandler(){this.iconName.valueChanges.pipe((0,p.R)(this.destroyed$)).subscribe(t=>this.labService.artboardName=t),this.iconName.setValue("icon-name")}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(h.y),e.Y36(S.J),e.Y36(E),e.Y36(e.Qsj))},n.\u0275cmp=e.Xpm({type:n,selectors:[["bd-lab"]],decls:20,vars:18,consts:[[1,"d-flex","justify-content-between","align-items-stretch","position-relative","overflow-hidden","lab-viewport"],[1,"d-flex","flex-column","justify-content-between","flex-grow-1","lab-wrapper"],["placeholder","Please enter the icon name...","cssClass","w-100",3,"formControl"],[1,"d-flex","align-items-center"],[1,"layout-selector"],[1,"playground"],[1,"d-flex","flex-column","flex-grow-1"],[4,"ngIf"],["rasterIconInfo",""],[1,"position-absolute","d-inline-block","lab-wrapper-preview",2,"opacity","0.5"],[1,"d-flex","d-xl-none","mx-auto",3,"showLogo"],[1,"dashed","right","color-picker-heading"],[4,"ngIf","ngIfElse"],["class","mb-2",3,"formControl","savedColors","addToSaved","removeFromSaved","savedColorsChanged",4,"ngFor","ngForOf"],[1,"mb-2",3,"formControl","savedColors","addToSaved","removeFromSaved","savedColorsChanged"],[1,"font-italic","icon-info-text"],[1,"font-weight-bold","icon-info-text"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"div",1),e.ALo(2,"async"),e._UZ(3,"bd-text-input",2),e.TgZ(4,"div",3),e._UZ(5,"bd-layout-selector",4)(6,"bd-playground",5),e.TgZ(7,"div",6),e.YNc(8,rt,5,4,"ng-container",7),e.ALo(9,"async"),e.YNc(10,st,3,0,"ng-container",7),e.ALo(11,"async"),e.ALo(12,"async"),e.YNc(13,ct,2,0,"ng-template",null,8,e.W1O),e.qZA()(),e._UZ(15,"bd-lab-actions")(16,"div",9)(17,"bd-footer",10),e.qZA(),e._UZ(18,"bd-right-sidebar"),e.ALo(19,"async"),e.qZA()),2&t&&(e.xp6(1),e.ekj("has-opened-sidebar",e.lcZ(2,8,i.hasOpenedRightSidebar$)),e.xp6(2),e.Q6J("formControl",i.iconName),e.xp6(5),e.Q6J("ngIf",e.lcZ(9,10,i.hasSelectedIcon$)),e.xp6(2),e.Q6J("ngIf",!1===e.lcZ(11,12,i.hasBackgroundPosition$)&&!1===e.lcZ(12,14,i.hasSelectedIcon$)),e.xp6(7),e.Q6J("showLogo",!0),e.xp6(1),e.ekj("sidebar-hidden",!1===e.lcZ(19,16,i.hasOpenedRightSidebar$)))},directives:[ne.t,d.JJ,d.oH,ie,ce,l.O5,l.sg,ae.h,de,pe.c,nt],pipes:[l.Ov],styles:['[_nghost-%COMP%]{width:100%}[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]{min-height:calc(100vh - 137px)}@media (min-width: 1200px){[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]{height:100vh}}[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]{padding:2rem;max-width:calc(100% - 80px);width:0}@media (min-width: 1200px){[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]{padding:3rem}}[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]   .layout-selector[_ngcontent-%COMP%], [_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]   .playground[_ngcontent-%COMP%]{margin-right:2rem}[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]   .color-picker-heading[_ngcontent-%COMP%]{margin-right:-4rem}[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]   .icon-info-text[_ngcontent-%COMP%]{color:#52269999;font-size:.625rem}@media (min-width: 1200px) and (max-width: 1299px){[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]{max-width:calc(100% - 337px)}}@media (min-width: 1300px){[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper[_ngcontent-%COMP%]{max-width:calc(100% - 433px)}}@media (max-width: 1199px){[_nghost-%COMP%]   .lab-viewport[_ngcontent-%COMP%]   .lab-wrapper.has-opened-sidebar[_ngcontent-%COMP%]:after{background-color:#fff6;content:"";width:100%;height:100%;position:absolute;top:0;left:0}}']}),n})()}];let lt=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[Z.Bz.forChild(at)],Z.Bz]}),n})();var dt=s(8408);let pt=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[[l.ez,lt,dt.m]]}),n})()}}]);
//# sourceMappingURL=411.97eaec177d454ad8.js.map