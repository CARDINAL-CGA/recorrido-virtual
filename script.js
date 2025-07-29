(function(){
    var script = {
 "mouseWheelEnabled": true,
 "start": "this.init()",
 "scripts": {
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getKey": function(key){  return window[key]; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "unregisterKey": function(key){  delete window[key]; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "existsKey": function(key){  return key in window; },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "registerKey": function(key, value){  window[key] = value; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); }
 },
 "paddingBottom": 0,
 "children": [
  "this.MainViewer"
 ],
 "id": "rootPlayer",
 "desktopMipmappingEnabled": false,
 "width": "100%",
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "contentOpaque": false,
 "defaultVRPointer": "laser",
 "definitions": [{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_A5325983_AF67_1230_41E5_43AA1485502E_camera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_camera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 91.19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BE70030E_AF7F_1630_41B4_4917AD176532"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   }
  }
 ],
 "partial": false,
 "class": "Panorama",
 "label": "1",
 "id": "panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "backwardYaw": -88.81,
   "yaw": 4.11,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E"
  }
 ],
 "hfov": 360,
 "overlays": [
  "this.overlay_A2C09ACD_AF6B_1630_41D4_749D3CA33AED"
 ],
 "thumbnailUrl": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_t.jpg",
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 179.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BF86D306_AF7F_1630_41D8_BB00CC28F1B4"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   }
  }
 ],
 "partial": false,
 "class": "Panorama",
 "label": "2",
 "id": "panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "backwardYaw": 4.11,
   "yaw": -88.81,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C"
  },
  {
   "backwardYaw": -3.94,
   "yaw": 60.1,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A5326132_AF67_3250_41D2_BE1B9E74506C"
  }
 ],
 "hfov": 360,
 "overlays": [
  "this.overlay_A21CCFFC_AF69_0DD0_41D5_F1C443C209EC",
  "this.overlay_A2A12793_AF69_7E50_41E5_471938445E11"
 ],
 "thumbnailUrl": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_t.jpg",
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -2.71,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BE4D9345_AF7F_1630_41E3_3547665D746C"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_camera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_camera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_camera"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -175.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BE604316_AF7F_1650_41DB_EC57A43FEDF1"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -6.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BF9542F7_AF7F_17D0_41D7_73F4C36FF9F8"
},
{
 "mouseControlMode": "drag_acceleration",
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "displayPlaybackBar": true,
 "viewerArea": "this.MainViewer"
},
{
 "items": [
  {
   "media": "this.panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_camera"
  },
  {
   "media": "this.panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_camera"
  },
  {
   "media": "this.panorama_A5326132_AF67_3250_41D2_BE1B9E74506C",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_camera"
  },
  {
   "media": "this.panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_camera"
  },
  {
   "media": "this.panorama_A5325983_AF67_1230_41E5_43AA1485502E",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_A5325983_AF67_1230_41E5_43AA1485502E_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   }
  }
 ],
 "partial": false,
 "class": "Panorama",
 "label": "5",
 "id": "panorama_A5325983_AF67_1230_41E5_43AA1485502E",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "backwardYaw": -0.57,
   "yaw": 174.22,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175"
  }
 ],
 "hfov": 360,
 "overlays": [
  "this.overlay_A2CECA40_AF6B_1630_416A_6567C1952FE0"
 ],
 "thumbnailUrl": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_t.jpg",
 "hfovMax": 130,
 "pitch": 0
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -119.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BE427336_AF7F_1650_41B0_30DA7353CFC8"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": -5.78,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BFA862D8_AF7F_17D0_41D0_E7400877D346"
},
{
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_in"
   },
   {
    "yawDelta": 323,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "linear"
   },
   {
    "yawDelta": 18.5,
    "class": "DistancePanoramaCameraMovement",
    "yawSpeed": 7.96,
    "easing": "cubic_out"
   }
  ]
 },
 "initialPosition": {
  "yaw": 176.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "camera_BE523327_AF7F_1670_41E2_7E0F567865AD"
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   }
  }
 ],
 "partial": false,
 "class": "Panorama",
 "label": "4",
 "id": "panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "backwardYaw": 174.22,
   "yaw": -0.57,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A5325983_AF67_1230_41E5_43AA1485502E"
  },
  {
   "backwardYaw": 173.36,
   "yaw": 177.29,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A5326132_AF67_3250_41D2_BE1B9E74506C"
  }
 ],
 "hfov": 360,
 "overlays": [
  "this.overlay_A286030F_AF69_1630_417E_D925E1869FF7",
  "this.overlay_A2A9B237_AF69_7650_41D8_8A097BDE4681"
 ],
 "thumbnailUrl": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_t.jpg",
 "hfovMax": 130,
 "pitch": 0
},
{
 "frames": [
  {
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/f/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/f/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/f/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/f/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "class": "CubicPanoramaFrame",
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/u/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/u/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/u/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/u/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "thumbnailUrl": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_t.jpg",
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/b/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/b/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/b/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/b/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/d/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/d/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/d/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/d/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/l/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/l/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/l/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/l/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/r/0/{row}_{column}.jpg",
      "rowCount": 8,
      "class": "TiledImageResourceLevel",
      "height": 4096,
      "width": 4096,
      "colCount": 8,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/r/1/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "height": 2048,
      "width": 2048,
      "colCount": 4,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/r/2/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "height": 1024,
      "width": 1024,
      "colCount": 2,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_0/r/3/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "height": 512,
      "width": 512,
      "colCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ]
   }
  }
 ],
 "partial": false,
 "class": "Panorama",
 "label": "3",
 "id": "panorama_A5326132_AF67_3250_41D2_BE1B9E74506C",
 "vfov": 180,
 "adjacentPanoramas": [
  {
   "backwardYaw": 60.1,
   "yaw": -3.94,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E"
  },
  {
   "backwardYaw": 177.29,
   "yaw": 173.36,
   "class": "AdjacentPanorama",
   "distance": 1,
   "panorama": "this.panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175"
  }
 ],
 "hfov": 360,
 "overlays": [
  "this.overlay_A2A5A0CD_AF69_1230_41B2_9103DFEF39CD",
  "this.overlay_A2A9ADD6_AF6F_0DD0_41CF_A121E0420E68"
 ],
 "thumbnailUrl": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_t.jpg",
 "hfovMax": 130,
 "pitch": 0
},
{
 "paddingBottom": 0,
 "transitionDuration": 500,
 "id": "MainViewer",
 "toolTipOpacity": 1,
 "width": "100%",
 "toolTipFontSize": "1.11vmin",
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "toolTipPaddingRight": 6,
 "playbackBarHeadBorderRadius": 0,
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadShadowColor": "#000000",
 "progressRight": 0,
 "playbackBarBorderRadius": 0,
 "toolTipShadowSpread": 0,
 "transitionMode": "blending",
 "playbackBarHeadBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "paddingLeft": 0,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipBorderRadius": 3,
 "progressOpacity": 1,
 "borderSize": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionColor": "#FF6600",
 "toolTipFontFamily": "Arial",
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionTime": 2000,
 "progressBackgroundColorRatios": [
  0
 ],
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "borderRadius": 0,
 "height": "100%",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "progressBackgroundColorDirection": "vertical",
 "progressHeight": 10,
 "playbackBarBottom": 5,
 "progressBorderColor": "#000000",
 "progressBackgroundOpacity": 1,
 "toolTipFontWeight": "normal",
 "playbackBarOpacity": 1,
 "propagateClick": false,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipFontStyle": "normal",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "playbackBarLeft": 0,
 "paddingRight": 0,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "toolTipTextShadowColor": "#000000",
 "vrPointerColor": "#FFFFFF",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarOpacity": 1,
 "playbackBarHeadHeight": 15,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeadShadowVerticalLength": 0,
 "progressLeft": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeight": 10,
 "toolTipFontColor": "#606060",
 "progressBorderSize": 0,
 "playbackBarHeadWidth": 6,
 "minHeight": 50,
 "playbackBarProgressOpacity": 1,
 "toolTipBorderSize": 1,
 "playbackBarBorderSize": 0,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "shadow": false,
 "toolTipBackgroundColor": "#F6F6F6",
 "paddingTop": 0,
 "minWidth": 100,
 "toolTipPaddingTop": 4,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBorderColor": "#FFFFFF",
 "progressBarBorderColor": "#000000",
 "toolTipPaddingLeft": 6,
 "playbackBarProgressBorderSize": 0,
 "playbackBarRight": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBackgroundOpacity": 1,
 "toolTipShadowHorizontalLength": 0,
 "progressBarBorderSize": 0,
 "playbackBarHeadOpacity": 1,
 "toolTipShadowVerticalLength": 0,
 "data": {
  "name": "Main Viewer"
 },
 "toolTipShadowOpacity": 1,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipPaddingBottom": 4,
 "progressBarBorderRadius": 0
},
{
 "maps": [
  {
   "hfov": 10.3,
   "yaw": 4.11,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_1_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -17.57
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E, this.camera_BE70030E_AF7F_1630_41B4_4917AD176532); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02C1CD8_AF79_13D0_41E2_6434A87E17B0",
   "pitch": -17.57,
   "yaw": 4.11,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.3,
   "distance": 100
  }
 ],
 "id": "overlay_A2C09ACD_AF6B_1630_41D4_749D3CA33AED",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 13.67,
   "yaw": -88.81,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_1_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -19.49
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C, this.camera_BE604316_AF7F_1650_41DB_EC57A43FEDF1); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02EFCD9_AF79_13D0_41B0_977CB47BC9B5",
   "pitch": -19.49,
   "yaw": -88.81,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.67,
   "distance": 100
  }
 ],
 "id": "overlay_A21CCFFC_AF69_0DD0_41D5_F1C443C209EC",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 9.66,
   "yaw": 60.1,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_1_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -26.63
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A5326132_AF67_3250_41D2_BE1B9E74506C, this.camera_BE523327_AF7F_1670_41E2_7E0F567865AD); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02EBCDA_AF79_13D0_41E0_5FA1B78D08E7",
   "pitch": -26.63,
   "yaw": 60.1,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 9.66,
   "distance": 100
  }
 ],
 "id": "overlay_A2A12793_AF69_7E50_41E5_471938445E11",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 8.48,
   "yaw": 174.22,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_1_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -27.3
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175, this.camera_BF86D306_AF7F_1630_41D8_BB00CC28F1B4); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02F1CDA_AF79_13D0_41E5_0FD10E96456F",
   "pitch": -27.3,
   "yaw": 174.22,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 8.48,
   "distance": 100
  }
 ],
 "id": "overlay_A2CECA40_AF6B_1630_416A_6567C1952FE0",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 10.03,
   "yaw": 177.29,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_1_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -31.87
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A5326132_AF67_3250_41D2_BE1B9E74506C, this.camera_BF9542F7_AF7F_17D0_41D7_73F4C36FF9F8); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02F8CDA_AF79_13D0_41D0_D89390D8FD59",
   "pitch": -31.87,
   "yaw": 177.29,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.03,
   "distance": 100
  }
 ],
 "id": "overlay_A286030F_AF69_1630_417E_D925E1869FF7",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 10.15,
   "yaw": -0.57,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_1_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -20.03
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A5325983_AF67_1230_41E5_43AA1485502E, this.camera_BFA862D8_AF7F_17D0_41D0_E7400877D346); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02F5CDA_AF79_13D0_41D1_2226F6F292A2",
   "pitch": -20.03,
   "yaw": -0.57,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.15,
   "distance": 100
  }
 ],
 "id": "overlay_A2A9B237_AF69_7650_41D8_8A097BDE4681",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 7.45,
   "yaw": -3.94,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_1_HS_0_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -24.21
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E, this.camera_BE427336_AF7F_1650_41B0_30DA7353CFC8); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02E7CDA_AF79_13D0_41D9_7F65BC12188F",
   "pitch": -24.21,
   "yaw": -3.94,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.45,
   "distance": 100
  }
 ],
 "id": "overlay_A2A5A0CD_AF69_1230_41B2_9103DFEF39CD",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "maps": [
  {
   "hfov": 12.11,
   "yaw": 173.36,
   "class": "HotspotPanoramaOverlayMap",
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_1_HS_1_0_0_map.gif",
      "width": 36,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ]
   },
   "pitch": -35.55
  }
 ],
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175, this.camera_BE4D9345_AF7F_1630_41E3_3547665D746C); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_A02FDCDA_AF79_13D0_41D4_D4A079E76204",
   "pitch": -35.55,
   "yaw": 173.36,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.11,
   "distance": 100
  }
 ],
 "id": "overlay_A2A9ADD6_AF6F_0DD0_41CF_A121E0420E68",
 "class": "HotspotPanoramaOverlay",
 "data": {
  "label": "Circle 01b"
 }
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A48FD7AD_AF67_FE70_41DB_409C62A4BA5C_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02C1CD8_AF79_13D0_41E2_6434A87E17B0",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02EFCD9_AF79_13D0_41B0_977CB47BC9B5",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A53F54ED_AF67_13F0_41E2_B6E2FD07735E_1_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02EBCDA_AF79_13D0_41E0_5FA1B78D08E7",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A5325983_AF67_1230_41E5_43AA1485502E_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02F1CDA_AF79_13D0_41E5_0FD10E96456F",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02F8CDA_AF79_13D0_41D0_D89390D8FD59",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A5E68D7F_AF67_32D0_41D6_AD2DE130E175_1_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02F5CDA_AF79_13D0_41D1_2226F6F292A2",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_1_HS_0_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02E7CDA_AF79_13D0_41D9_7F65BC12188F",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
},
{
 "class": "AnimatedImageResource",
 "rowCount": 5,
 "levels": [
  {
   "url": "media/panorama_A5326132_AF67_3250_41D2_BE1B9E74506C_1_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 600
  }
 ],
 "id": "AnimatedImageResource_A02FDCDA_AF79_13D0_41D4_D4A079E76204",
 "frameCount": 20,
 "colCount": 4,
 "frameDuration": 41
}],
 "class": "Player",
 "scrollBarWidth": 10,
 "mobileMipmappingEnabled": false,
 "minHeight": 20,
 "vrPolyfillScale": 0.5,
 "backgroundPreloadEnabled": true,
 "scrollBarMargin": 2,
 "shadow": false,
 "borderSize": 0,
 "paddingTop": 0,
 "minWidth": 20,
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarColor": "#000000",
 "borderRadius": 0,
 "data": {
  "name": "Player435"
 },
 "height": "100%",
 "horizontalAlign": "left",
 "propagateClick": false,
 "overflow": "visible",
 "paddingRight": 0,
 "gap": 10,
 "layout": "absolute",
 "downloadEnabled": false
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
