// Runs before first paint: when a Supabase session is stored, hide the prerendered public page
// so a signed-in user goes straight to the app instead of seeing the landing page flash.
try{for(var i=0;i<localStorage.length;i++){if(/^sb-.+-auth-token$/.test(localStorage.key(i))){document.documentElement.className+=' has-session';break;}}}catch(e){}
