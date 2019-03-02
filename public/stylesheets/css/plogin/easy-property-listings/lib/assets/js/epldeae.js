var epl={ui:{init:null,prefix:'epl_ui_',tabs:null,accordion:null},helpers:{error:null,strip_html_special_chars:null,string_to_name:null,},hooks:null};(function($){epl.ui.init=function(){epl.ui.tabs('.epl-tabs, .epl-tabs-horizontal');epl.ui.tabs({selector:'.epl-tabs-vertical',type:'vertical'});epl.ui.accordion('.epl-accordion');}
epl.helpers.error=function(msg){throw msg;}
epl.helpers.ajax_submit=function(el,action){$(document).on('submit',$(el),function(e){e.preventDefault();$.ajax({method:"POST",url:epl_frontend_vars.ajaxurl,data:{action:action,data:$(el).serialize()}}).done(function(msg){});});}
epl.helpers.strip_html_special_chars=function(dirtyString){var container=document.createElement('div');container.innerHTML=dirtyString;dirtyString=container.textContent||container.innerText;return dirtyString.replace(/\W+/g," ");}
epl.helpers.string_to_name=function(string){string=epl.helpers.strip_html_special_chars(string);string=string.toLowerCase(string);return $.trim(string.replace(/ /g,"_"));}
epl.helpers.get_unique_name=function(string,array){var name=epl.helpers.string_to_name(string);name_orig=typeof array=='undefined'?name:array+'['+name+']';if(!$('[name="'+name_orig+'"]').length){return name_orig;}else{var i=1;while($('[name="'+name_orig+'"]').length>0){name_orig=array=='undefined'?name+'_'+i:array+'['+name+'_'+i+']';i++;}
return name_orig;}}
epl.ui.tabs=function(){var a=arguments;var l=a.length;var el=null;var opts={selector:null,first:0,type:'horizontal',};var atts={};if(l>0){if(typeof a[0]==='string'){el=a[0];}else if(typeof a[0]==='object'){atts=a[0];el=atts.selector;}
$.extend(true,opts,atts);$(el).each(function(){$(this).addClass(epl.ui.prefix+'tab_wrapper '+epl.ui.prefix+'tab_wrapper_'+opts.type+' epl-clearfix');$(this).children('div').each(function(i){if(i==opts.first){$(this).addClass(epl.ui.prefix+'tab_content_current');}
$(this).addClass(epl.ui.prefix+'tab_content');});$(this).find('ul:first li').each(function(i){if(i==opts.first){$(this).addClass(epl.ui.prefix+'tab_menu_current');$(this).closest('ul').addClass(epl.ui.prefix+'tab_menu_wrapper '+epl.ui.prefix+'tab_menu_wrapper_'+opts.type);}
$(this).addClass(epl.ui.prefix+'tab_menu');$(this).on('click',function(e){var ref=$(this).children('a:first').attr('href');e.preventDefault();$(this).trigger('tabchange',$(this).index());$(this).siblings().removeClass(epl.ui.prefix+'tab_menu_current');$(this).addClass(epl.ui.prefix+'tab_menu_current');$(this).closest(el).find(ref).siblings().removeClass(epl.ui.prefix+'tab_content_current');$(this).closest(el).find(ref).addClass(epl.ui.prefix+'tab_content_current');});});});}else{epl.helpers.error('no arguments passed to tabs');}}
epl.ui.accordion=function(){var a=arguments;var l=a.length;var el=null;var opts={selector:null,first:0,head:'h3'};var atts={};if(l>0){if(typeof a[0]==='string'){el=a[0];}else if(typeof a[0]==='object'){atts=a[0];el=atts.selector;}
$.extend(true,opts,atts);$(el).each(function(){$(this).addClass(epl.ui.prefix+'accordion_wrapper');$(this).children(opts.head).each(function(i){if(i==opts.first){$(this).addClass(epl.ui.prefix+'accordion_menu_current');$(this).next().addClass(epl.ui.prefix+'accordion_content_current');}
$(this).addClass(epl.ui.prefix+'accordion_menu');$(this).next().addClass(epl.ui.prefix+'accordion_content');$(this).on('click',function(e){$(this).toggleClass(epl.ui.prefix+'accordion_menu_current');$(this).siblings(opts.head).removeClass(epl.ui.prefix+'accordion_menu_current');$(this).next().slideToggle('fast');$(this).siblings('div').not($(this).next()).slideUp('fast');});});});}else{epl.helpers.error('no arguments passed to tabs');}}
epl.hooks_api=function(){var slice=Array.prototype.slice;var MethodsAvailable={removeFilter:removeFilter,applyFilters:applyFilters,addFilter:addFilter,removeAction:removeAction,doAction:doAction,addAction:addAction};var STORAGE={actions:{},filters:{}};function addAction(action,callback,priority,context){if(typeof action==='string'&&typeof callback==='function'){priority=parseInt((priority||10),10);_addHook('actions',action,callback,priority,context);}
return MethodsAvailable;}
function doAction(){var args=slice.call(arguments);var action=args.shift();if(typeof action==='string'){_runHook('actions',action,args);}
return MethodsAvailable;}
function removeAction(action,callback){if(typeof action==='string'){_removeHook('actions',action,callback);}
return MethodsAvailable;}
function addFilter(filter,callback,priority,context){if(typeof filter==='string'&&typeof callback==='function'){priority=parseInt((priority||10),10);_addHook('filters',filter,callback,priority,context);}
return MethodsAvailable;}
function applyFilters(){var args=slice.call(arguments);var filter=args.shift();if(typeof filter==='string'){return _runHook('filters',filter,args);}
return MethodsAvailable;}
function removeFilter(filter,callback){if(typeof filter==='string'){_removeHook('filters',filter,callback);}
return MethodsAvailable;}
function _removeHook(type,hook,callback,context){var handlers,handler,i;if(!STORAGE[type][hook]){return;}
if(!callback){STORAGE[type][hook]=[];}else{handlers=STORAGE[type][hook];if(!context){for(i=handlers.length;i--;){if(handlers[i].callback===callback){handlers.splice(i,1);}}}
else{for(i=handlers.length;i--;){handler=handlers[i];if(handler.callback===callback&&handler.context===context){handlers.splice(i,1);}}}}}
function _addHook(type,hook,callback,priority,context){var hookObject={callback:callback,priority:priority,context:context};var hooks=STORAGE[type][hook];if(hooks){hooks.push(hookObject);hooks=_hookInsertSort(hooks);}
else{hooks=[hookObject];}
STORAGE[type][hook]=hooks;}
function _hookInsertSort(hooks){var tmpHook,j,prevHook;for(var i=1,len=hooks.length;i<len;i++){tmpHook=hooks[i];j=i;while((prevHook=hooks[j-1])&&prevHook.priority>tmpHook.priority){hooks[j]=hooks[j-1];--j;}
hooks[j]=tmpHook;}
return hooks;}
function _runHook(type,hook,args){var handlers=STORAGE[type][hook],i,len;if(!handlers){return(type==='filters')?args[0]:false;}
len=handlers.length;if(type==='filters'){for(i=0;i<len;i++){args[0]=handlers[i].callback.apply(handlers[i].context,args);}}else{for(i=0;i<len;i++){handlers[i].callback.apply(handlers[i].context,args);}}
return(type==='filters')?args[0]:true;}
return MethodsAvailable;};epl.hooks=new epl.hooks_api();})(jQuery);jQuery(document).on('ready',function($){epl.ui.init();});