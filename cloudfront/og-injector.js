var SITE="https://chris-sa.com";
var STATIC="https://static.chris-sa.com/gallery/";
var SITE_NAME="Chris S\xE1";
var DEF_IMG=STATIC+"10_Happy_otter_napping.webp";
var DEF_W="5185";var DEF_H="3457";

var P=[
["Bee sitting on a purple flower","00_Bee_sitting_on_a_purple_flower.webp","2395","2993"],
["Sunset over Makara hills with windmill silhouettes","01_Sunset_over_Makara_hills_with_windmill_silhouettes.webp","5184","2749"],
["Capybara at Wellington zoo","02_Capybara_at_Wellington_zoo.webp","3833","2556"],
["Fruit Splash","08_Fruit_Splash.webp","2849","3744"],
["A leaf","09_A_leaf.webp","2302","1866"],
["Happy otter napping","10_Happy_otter_napping.webp","5185","3457"],
["Tui hanging upside down in a kowhai tree","11_Tui_hanging_upside_down_in_a_kowhai_tree.webp","4219","2950"],
["Gas burner in love","12_Gas_burner_in_love.webp","3496","2127"],
["Stunning seagull","13_Stunning_seagull.webp","2849","4273"],
["Crab chilling under some water","14_Crab_chilling_under_some_water.webp","5185","3457"],
["The glowing man","15_The_glowing_man.webp","1120","1899"],
["Wood fire burning hot","16_Wood_fire_burning_hot.webp","5185","3457"],
["Huka falls","17_Huka_falls.webp","5185","3457"],
["Fly on a tree","18_Fly_on_a_tree.webp","5185","3457"],
["Morning frost on a green wooden railing","19_Morning_frost_on_a_green_wooden_railing.webp","3649","1587"],
["Train Platform","20_Train_Platform.webp","4228","2224"],
["Otters sleeping","21_Otters_sleeping.webp","5185","3457"],
["Is there a ghost","22_Is_there_a_ghost.webp","3865","2521"],
["Donkey at a petting zoo","23_Donkey_at_a_petting_zoo.webp","2849","4273"],
];

var PR={
"twentythreefiftynine":["Twenty Three Fifty Nine","A grade tracking website for university students.",SITE+"/assets/2359.png"],
"teach-python":["Teach Python","A website for learning Python programming.",SITE+"/projects/teach-python/images/HeaderImg.jpg"],
"helpamate":["Help a Mate","A fundraising platform to help individuals raise funds for causes.",SITE+"/assets/helpamate.png"],
"chapschallenge":["Chap's Challenge","A puzzle game created in Java.",SITE+"/assets/chaps-challenge.png"],
};

function esc(s){return s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

function meta(url,title,desc,img,w,h,alt){
var t=esc(title),d=esc(desc),i=esc(img),a=esc(alt||title),iw=w||DEF_W,ih=h||DEF_H,u=esc(url);
return '<meta property="og:type" content="website" />\n'+
'        <meta property="og:site_name" content="'+esc(SITE_NAME)+'" />\n'+
'        <meta property="og:url" content="'+u+'" />\n'+
'        <meta property="og:title" content="'+t+'" />\n'+
'        <meta property="og:description" content="'+d+'" />\n'+
'        <meta property="og:image" content="'+i+'" />\n'+
'        <meta property="og:image:alt" content="'+a+'" />\n'+
'        <meta property="og:image:width" content="'+iw+'" />\n'+
'        <meta property="og:image:height" content="'+ih+'" />\n'+
'        <meta name="twitter:card" content="summary_large_image" />\n'+
'        <meta name="twitter:title" content="'+t+'" />\n'+
'        <meta name="twitter:description" content="'+d+'" />\n'+
'        <meta name="twitter:image" content="'+i+'" />\n'+
'        <meta name="twitter:image:alt" content="'+a+'" />';
}

function pageMeta(uri,qs){
var photoIdx=null;
if(qs){var pts=qs.split("&");for(var i=0;i<pts.length;i++){var kv=pts[i].split("=");if(kv[0]==="photo"&&kv.length===2){var n=parseInt(kv[1],10);if(!isNaN(n)&&n>=0&&n<P.length){photoIdx=n;}}}}

if(uri==="/gallery"&&photoIdx!==null){
var p=P[photoIdx];
return meta(SITE+"/gallery?photo="+photoIdx,p[0]+" \u2014 "+SITE_NAME+" Photography","A photo by "+SITE_NAME+": "+p[0],STATIC+p[1],p[2],p[3],p[0]);
}

if(uri==="/gallery"||uri==="/gallery/"){
return meta(SITE+"/gallery","Photography \u2014 "+SITE_NAME,"A collection of moments captured through my lens.",DEF_IMG,DEF_W,DEF_H,"Happy otter napping \u2014 "+SITE_NAME+" Photography");
}

var m=uri.match(/^\/projects\/([^/]+)\/?$/);
if(m){var pr=PR[m[1]];if(pr){return meta(SITE+"/projects/"+m[1],pr[0]+" \u2014 "+SITE_NAME,pr[1],pr[2],null,null,pr[0]);}}

return meta(SITE+"/",SITE_NAME+" \u2014 Portfolio","Software engineer and photographer based in Wellington, NZ.",DEF_IMG,DEF_W,DEF_H,"Happy otter napping \u2014 "+SITE_NAME+" photography gallery");
}

var OG_START="<!-- Open Graph / Social Previews -->";
var OG_END='<meta name="twitter:image:alt"';

function handler(event){
var response=event.response;
var request=event.request;
var ct=(response.headers["content-type"]||{}).value||"";
if(ct.indexOf("text/html")===-1)return response;
var body=response.body?response.body.text:null;
if(!body)return response;
var uri=request.uri||"/";
var qs=request.querystring?Object.keys(request.querystring).map(function(k){var v=request.querystring[k];return k+"="+(v&&v.value?v.value:"");}).join("&"):"";
var newMeta=pageMeta(uri,qs);
var startIdx=body.indexOf(OG_START);
if(startIdx!==-1){var endIdx=body.indexOf("/>",body.indexOf(OG_END));if(endIdx!==-1){body=body.substring(0,startIdx)+OG_START+"\n        "+newMeta+body.substring(endIdx+2);}}
response.body=body;
return response;
}
